const { Op, literal, fn, col } = require("sequelize");
const schedule = require("node-schedule");
const { GROQ_API_KEY } = require("../utils/constants");
const { Post, PostMedia, User, sequelize, PostPlatform, Like, Share, Comment, Rating } = require("../models");
const {
  postToSocialMedia,
  uploadPostToPlatform,
} = require("../services/social-media-service");
const { api, parallel, uploadFileToS3 } = require("../utils/helpers");
const { default: Groq } = require("groq-sdk");
const like = require("../models/like");

const groq = new Groq({ apiKey: GROQ_API_KEY });

async function createPostMedia(postId, mediaUrls, transaction) {
  const postMedia = mediaUrls.map((url) => ({
    post_id: postId,
    media_url: url,
    media_type: url.endsWith(".mp4") ? "video" : "image",
  }));
  await PostMedia.bulkCreate(postMedia, { transaction });
}

async function schedulePost(post, userId, scheduledAt) {
  schedule.scheduleJob(new Date(scheduledAt), () => postToSocialMedia(post, userId));
}

async function handleFileUploads(userId, files, transaction) {
  const postMedias = [];
  for (const file of files) {
    const s3Url = await uploadFileToS3(
      `${userId}/${Date.now()}-${file.originalname}`,
      file.path
    );
    if (!s3Url) throw new Error("Failed to upload your media files to AWS");
    const postMedia = await PostMedia.create(
      {
        post_id: post.id,
        media_url: s3Url,
        media_type: file.mimetype.includes("video") ? "video" : "image",
      },
      { transaction }
    );
    postMedias.push(postMedia.get({ plain: true }));
  }
  return postMedias;
}

async function uploadPostsToPlatforms(platforms, post, files) {
  const platformResponses = await parallel(platforms, (platform) =>
    uploadPostToPlatform(platform, post, files)
  );
  return platformResponses
    .filter((response) => response.id)
    .map((response) => ({
      post_id: post.id,
      platform_type: response.platform,
      platform_post_id: response.id,
    }));
}

async function createPostInTransaction(data, files) {
  const transaction = await sequelize.transaction();
  try {
    let post = await Post.create(data, { transaction });
    post = post.get({ plain: true });
    const postMedias = files && files.length > 0 ? await handleFileUploads(data.user_id, files, transaction) : [];
    post.post_medias = postMedias;
    await transaction.commit();
    return post;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}



module.exports = {
  createPost: async (req, res) => {
    try {
      const { content, media_urls: mediaUrls, user_id: userId, scheduled_at: scheduledAt = null } = req.body;
      const post = await Post.create({ user_id: userId, content, scheduled_at: scheduledAt });

      if (mediaUrls && mediaUrls.length > 0) {
        await createPostMedia(post.id, mediaUrls);
      }

      if (scheduledAt) {
        schedulePost(post, userId, scheduledAt);
        return res.status(201).json({ message: "Post scheduled successfully." });
      } else {
        await postToSocialMedia(post, userId);
        return res.status(201).json({ message: "Post created and shared successfully." });
      }
    } catch (error) {
      console.error("Error creating post:", error);
      res.status(500).json({ message: "Internal server error." });
    }
  },

  createPosts: async (req, res) => {
    const { user_id: userId = req.user.id, title, desc, scheduled_at: scheduledAt } = req.body;
    const files = req.files;
    const hashtags = JSON.parse(req.body.hashtags || "[]");
    const platforms = JSON.parse(req.body.platforms || "[]");

    try {
      const post = await createPostInTransaction(
        {
          user_id: userId,
          title,
          desc,
          hashtags: hashtags.join(","),
          scheduled_at: scheduledAt,
          platforms: JSON.stringify(platforms),
        },
        files
      );

      if (!scheduledAt) {
        const postPlatformsBody = await uploadPostsToPlatforms(platforms, post, files);
        if (postPlatformsBody.length) {
          await PostPlatform.bulkCreate(postPlatformsBody);
        }
      } else {
        schedule.scheduleJob(new Date(scheduledAt), async () => {
          const postPlatformsBody = await uploadPostsToPlatforms(platforms, post, files);
          if (postPlatformsBody.length) {
            await PostPlatform.bulkCreate(postPlatformsBody);
          }
        });
      }

      return res.status(201).json({ success: true, post, message: "Posts made successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Failed to create post" });
    }
  },

  getPosts: (req, res) => api(res, async () => {
    const month = req.query.month;
    const whereCondition = month ?
      sequelize.where(sequelize.fn('MONTH', sequelize.col('Post.created_at')), month) :
      {};

    const posts = await Post.findAll({
      where: whereCondition,
      include: [{
        model: PostMedia,
        as: 'media',
        required: false,
      }],
    });

    return res.json({ success: true, statusCode: 200, data: posts });
  }),


  getRecentToRatedPosts: async (req, res) => {
    const query = `
   SELECT 
    posts.id,
    posts.title,
    COALESCE(SUM(like_counts.like_count), 0) AS like_count,
    COALESCE(SUM(share_counts.share_count), 0) AS share_count,
    COALESCE(SUM(comment_counts.comment_count), 0) AS comments_count,
    COALESCE(MAX(ratings.rating), 0) AS rating,
    -- Retrieve a single media URL for each post, e.g., the first one (based on order or criteria)
    MAX(post_medias.media_url) AS media_url,
    COALESCE(COUNT(DISTINCT post_medias.id), 0) AS media_count,
    (COALESCE(SUM(like_counts.like_count), 0) + 
     COALESCE(SUM(share_counts.share_count), 0) + 
     COALESCE(SUM(comment_counts.comment_count), 0)) AS total_score,
    -- Format the percentage to 2 decimal places
    CASE 
        WHEN (COALESCE(SUM(like_counts.like_count), 0) + 
              COALESCE(SUM(share_counts.share_count), 0) + 
              COALESCE(SUM(comment_counts.comment_count), 0)) > 0
        THEN FORMAT((COALESCE(MAX(ratings.rating), 0) / 
                     (COALESCE(SUM(like_counts.like_count), 0) + 
                      COALESCE(SUM(share_counts.share_count), 0) + 
                      COALESCE(SUM(comment_counts.comment_count), 0))) * 100, 2)
        ELSE '0.00'
    END AS rating_percentage
FROM posts
LEFT JOIN (
    SELECT post_id, COUNT(*) AS like_count
    FROM likes
    WHERE user_id = ${req.user.id}
    GROUP BY post_id
) AS like_counts ON posts.id = like_counts.post_id
LEFT JOIN (
    SELECT post_id, COUNT(*) AS share_count
    FROM shares
    WHERE user_id = ${req.user.id}
    GROUP BY post_id
) AS share_counts ON posts.id = share_counts.post_id
LEFT JOIN (
    SELECT post_id, COUNT(*) AS comment_count
    FROM comments
    WHERE user_id = ${req.user.id}
    GROUP BY post_id
) AS comment_counts ON posts.id = comment_counts.post_id
LEFT JOIN ratings ON posts.id = ratings.post_id
LEFT JOIN post_medias ON posts.id = post_medias.post_id
GROUP BY posts.id, posts.title
HAVING 
    COALESCE(SUM(like_counts.like_count), 0) > 0 AND 
    COALESCE(SUM(share_counts.share_count), 0) > 0 AND 
    COALESCE(SUM(comment_counts.comment_count), 0) > 0
ORDER BY total_score DESC
LIMIT 4;
`;
    const topPosts = await sequelize.query(query, {
      type: sequelize.QueryTypes.SELECT
    });
    return res.status(200).json({ success: true, data: topPosts });
  },

  getPost: (req, res) => api(res, async () => {
    const post = await Post.findOne({
      where: { id: req.params.id },
      include: { model: PostMedia, as: "media" },
    });
    if (!post) {
      return res.status(404).json({ success: false, message: "Post Not Found!" });
    }
    return res.json({ success: true, data: post });
  }),

  generateCaption: (req, res) => api(res, async () => {
    const { title } = req.body;
    if (!title) {
      return res.status(400).json({ success: false, message: "Title is missing in the body" });
    }

    const prompt = `I'll give you a JSON object which stores either 'title' key or a 'desc' key. Based on it's content, I need you to give me a JSON object with the following keys: 'title' (255 characters max), 'desc' (1000 words max), 'hashtags' (8 max, an array, each item within it having '#' in the beginning). Generate the description based on title and vice versa in case it's missing. Your response should not have anything except this JSON object, don't enclose it in triple backticks either. The object: ${JSON.stringify(req.body)}`;
    const response = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama3-8b-8192",
    });
    const data = JSON.parse(response.choices[0]?.message?.content || "");
    return res.json({ success: true, data });
  }),

  schedulePostFilter: (req, res) => api(res, async () => {
    const { month, year } = req.query;
    const posts = await Post.findAll({
      where: {
        scheduled_at: {
          [Op.not]: null,
        },
        [Op.and]: [
          sequelize.where(sequelize.fn('YEAR', sequelize.col('scheduled_at')), year),
          sequelize.where(sequelize.fn('MONTH', sequelize.col('scheduled_at')), month)
        ],
      },
      include: [{
        model: PostMedia,
        as: 'media',
        required: false,
        // attributes: ['id'], // Specify attributes to select from post_medias table
      }],
    });
    if (!posts?.length) {
      return res.json({ success: true, statusCode: 404, data: [] });
    }
    return res.json({ success: true, statusCode: 200, data: posts });
  })
};
