import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";


dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());


app.get("/", (req, res) => {
  res.send("hello world");
});

connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(` Server is running on port ${PORT}`);
});
