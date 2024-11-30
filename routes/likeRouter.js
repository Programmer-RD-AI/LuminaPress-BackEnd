import { Router } from "express";
import { toggleLikeHandler } from "../handlers/likeHandlers.js";
import { validateLikeInput } from "../middlewares/likeMiddleware.js";

const likeRouter = Router();

// Route to like/unlike an article
likeRouter.post("/", validateLikeInput, toggleLikeHandler);

export default likeRouter;
