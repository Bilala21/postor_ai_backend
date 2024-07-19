const { User, PostMedia } = require("../models");
const { PLATFORMS } = require("../utils/constants");

const postToSocialMedia = async (post, userId) => {
  const user = await User.findByPk(userId, { raw: true });
  const mediaUrls = await PostMedia.findAll({
    where: { post_id: post.id },
  }).map((media) => media.media_url);

  await Promise.all([
    postToFacebook(user.facebook_access_token, post.content, mediaUrls),
    postToInstagram(user.instagram_access_token, post.content, mediaUrls),
    postToTwitter(user.twitter_access_token, post.content, mediaUrls),
    postToTikTok(user.tiktok_access_token, post.content, mediaUrls),
  ]);
};

// Dummy implementations for posting to social media
const postToFacebook = async (accessToken, content, mediaUrls) => {
  // Implement the logic to post to Facebook
};

const postToInstagram = async (accessToken, content, mediaUrls) => {
  // Implement the logic to post to Instagram
};

const postToTwitter = async (accessToken, content, mediaUrls) => {
  // Implement the logic to post to Twitter
};

const postToTikTok = async (accessToken, content, mediaUrls) => {
  // Implement the logic to post to TikTok
};

module.exports.uploadPostToPlatform = async (platform, post, files) => {
  const user = await User.findByPk(post.user_id, { raw: true });
  switch (platform) {
    case PLATFORMS.FACEBOOK:
      return uploadToFacebook(post, user, files);
    case PLATFORMS.INSTAGRAM:
      return uploadToInstagram(post, user, files);
    case PLATFORMS.LINKEDIN:
      return uploadToLinkedIn(post, user, files);
    case PLATFORMS.TIKTOK:
      return uploadToTikTok(post, user, files);
    case PLATFORMS.TWITTER:
      return uploadToTwitter(post, user, files);
    case PLATFORMS.YOUTUBE:
      return uploadToYoutube(post, user, files);
    default:
      throw new Error("Unsupported platform");
  }
};

const uploadToFacebook = async (post, user, files) => {
  // Implement the logic to upload post
  return { id: "fb-id", platform: PLATFORMS.FACEBOOK };
};

const uploadToInstagram = async (post, user, files) => {
  // Implement the logic to upload post
  return { id: "insta-id", platform: PLATFORMS.INSTAGRAM };
};

const uploadToLinkedIn = async (post, user, files) => {
  // Implement the logic to upload post
  return { id: "linkedin-id", platform: PLATFORMS.LINKEDIN };
};

const uploadToTikTok = async (post, user, files) => {
  // Implement the logic to upload post
  return { id: "tiktok-id", platform: PLATFORMS.TIKTOK };
};

const uploadToTwitter = async (post, user, files) => {
  // Implement the logic to upload post
  return { id: "twitter-id", platform: PLATFORMS.TWITTER };
};

const uploadToYoutube = async (post, user, files) => {
  // Implement the logic to upload post
  return { id: "youtube-id", platform: PLATFORMS.YOUTUBE };
};

module.exports = {
  postToSocialMedia,
  postToFacebook,
  postToInstagram,
  postToTwitter,
  postToTikTok,
};
