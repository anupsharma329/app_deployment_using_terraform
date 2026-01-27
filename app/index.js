import express from "express";
const app = express();

app.get("/", (req, res) => {
  res.send("Hello from PROD EC2 🚀");
});

app.listen(3000, () => {
  console.log("App running on port 3000");
});



