import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import authRouter from "./routes/authRouter.js"; // import the new authRouter
import commentRouter from "./routes/commentRouter.js";
import articlesRouter from "./routes/articlesRouter.js";
import profileRouter from "./routes/profileRouter.js";
import likeRouter from "./routes/likeRouter.js";
import viewRouter from "./routes/viewRouter.js";
import apiKeyCheck from "./middlewares/apiKeyCheck.js";

const app = express();
const PORT = 3000;

app.use(cors({ origin: "*" }));
dotenv.config();
app.use(bodyParser.json());
app.use(apiKeyCheck);
app.use("/auth", authRouter); // add the auth router
app.use("/articles", articlesRouter);
app.use("/articles/likes", likeRouter);
app.use("/articles/comments", commentRouter);
app.use("/articles/views", viewRouter);
app.use("/profile", profileRouter);
app.use((err, _, res, __) => {
  console.error(err.stack);
  res.status(500).send("Internal Server Error");
});

const server = app.listen(PORT, () => {
  const host = server.address().address;
  const port = server.address().port;
  console.log(`App listening at http://${host}:${port}`);
});
