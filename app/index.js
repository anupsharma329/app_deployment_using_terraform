import express from "express";
const app = express();

const env = "DEV EC2 Instance";

app.get("/", (req, res) => {
    res.send(`Hello from ${env} EC2`);
});

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    env,
    timestamp: new Date().toISOString(),
  });
});

app.listen(3000, () => {
  console.log(`App running on port 3000 in ${env} mode`);
});

// nodemon index.js