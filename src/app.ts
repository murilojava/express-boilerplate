import "dotenv/config";
import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.json({ message: "It's alive!" });
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
