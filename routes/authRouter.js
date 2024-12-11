import { Router } from "express";
import {
  validateRegister,
  validateLogin,
  validateEmailParam,
  checkEmailExists,
  hashPassword,
} from "../middlewares/authMiddleware.js"; // Adjust the path to your middleware file
import {
  checkEmailHandler,
  loginHandler,
  signUpHandler,
} from "../handlers/authHandlers.js";
import { doesEmailExist } from "../utils/doesEmailExist.js";
const authRouter = Router();

authRouter.post(
  "/register",
  // validateRegister,
  // checkEmailExists(doesEmailExist),
  // hashPassword,
  signUpHandler,
);

// Login route
authRouter.post("/login", validateLogin, loginHandler);

authRouter.get("/check-email/:email", validateEmailParam, checkEmailHandler);

export default authRouter;
