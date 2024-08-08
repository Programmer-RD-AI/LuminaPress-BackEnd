import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";

const app = express();
const PORT = 3000;

app.use(cors({ origin: "*" }));
dotenv.config();
app.use(bodyParser.json());

app.use((err, _, res, __) => {
  console.error(err.stack);
  res.status(500).send("Internal Server Error");
});

const server = app.listen(PORT, () => {
  const host = server.address().address;
  const port = server.address().port;
  console.log(`App listening at http://${host}:${port}`);
});
