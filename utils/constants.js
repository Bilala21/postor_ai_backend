require("dotenv/config");

const constants = {
  PORT: 4000,
  MODEL_OPTS: {
    underscored: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  },
  POST_STATUSES: {
    ACTIVE: "active",
    DRAFT: "draft",
    SCHEDULED: "scheduled",
    SCHEDULED: "faild",
  },
  USER_ROLES: {
    PERSONAL: "personal",
    STUDENT: "student",
    EMPLOYEE: "employee",
    CONTENT_CREATOR: "content_creator",
    LARGE_BUSINESS: "large_business",
    SMALL_BUSINESS: "small_business",
  },
  MEDIA_TYPES: {
    VIDEO: "video",
    AUDIO: "audio",
  },
  PLATFORMS: {
    FACEBOOK: "facebook",
    INSTAGRAM: "instagram",
    TIKTOK: "tiktok",
    TWITTER: "twitter",
    YOUTUBE: "youtube",
    LINKEDIN: "linkedin",
  },
  ENV: process.env,
  ...process.env,
};

module.exports = constants;
