const router = require("express").Router();
const controller = require("../controllers/post.controller");
const upload = require("../middlewares/multer");

// router.post("/", controller.createPost);
router.post("/", upload.array("media", 3), controller.createPosts);
router.post("/caption", controller.generateCaption);
router.get("/scheduled", controller.schedulePostFilter);
router.get("/top-rated", controller.getRecentToRatedPosts);
router.get("/:id", controller.getPost);
router.get("/", controller.getPosts);

module.exports = router;
