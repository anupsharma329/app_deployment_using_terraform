import express from "express";
const app = express();

const env = process.env.NODE_ENV === "production" ? "PROD" : "DEV";

app.get("/", (req, res) => {
  if (env === "DEV") {
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <title>Dev EC2</title>
          <style>
            body {
              margin: 0;
              height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
              background: linear-gradient(135deg, #ff9a9e 0%, #fad0c4 25%, #fad0c4 50%, #fbc2eb 75%, #a6c1ee 100%);
              font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
            }
            .card {
              background: rgba(255, 255, 255, 0.9);
              padding: 2rem 3rem;
              border-radius: 16px;
              box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
              text-align: center;
            }
            .badge {
              display: inline-block;
              padding: 0.25rem 0.75rem;
              border-radius: 999px;
              font-size: 0.8rem;
              letter-spacing: 0.08em;
              text-transform: uppercase;
              background: #2563eb;
              color: #f9fafb;
              margin-bottom: 0.75rem;
            }
            h1 {
              margin: 0 0 0.5rem;
              font-size: 2rem;
              color: #111827;
            }
            p {
              margin: 0;
              color: #4b5563;
            }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="badge">DEV ENVIRONMENT</div>
            <h1>Hello from DEV EC2</h1>
            <p>Your colorful dev app is up and running on port 3000.</p>
          </div>
        </body>
      </html>
    `);
  } else {
    res.send(`Hello from ${env} EC2`);
  }
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
