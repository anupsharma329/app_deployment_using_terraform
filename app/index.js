import express from "express";
const app = express();

const env = "PROD";

app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <title>${env} App</title>
        <style>
          * { box-sizing: border-box; }
          body {
            margin: 0;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #6366f1, #ec4899, #f97316);
            font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
            color: #0f172a;
          }
          .card {
            background: rgba(255, 255, 255, 0.92);
            padding: 2.25rem 3rem;
            border-radius: 18px;
            box-shadow: 0 20px 50px rgba(15, 23, 42, 0.35);
            text-align: center;
            max-width: 480px;
            width: 100%;
          }
          .badge {
            display: inline-block;
            padding: 0.25rem 0.9rem;
            border-radius: 999px;
            font-size: 0.7rem;
            letter-spacing: 0.12em;
            text-transform: uppercase;
            background: #0f172a;
            color: #e5e7eb;
            margin-bottom: 0.9rem;
          }
          h1 {
            margin: 0 0 0.5rem;
            font-size: 2rem;
          }
          p {
            margin: 0.15rem 0;
            font-size: 0.95rem;
            color: #4b5563;
          }
          .accent {
            font-weight: 600;
            color: #2563eb;
          }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="badge">${env} environment</div>
          <h1>Hello from your EC2 app 🚀</h1>
          <p>This Node.js service is <span class="accent">running on port 3000</span>.</p>
          <p>Try the <span class="accent">/health</span> endpoint for a JSON status check.</p>
        </div>
      </body>
    </html>
  `);
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

// nodemon index.js to run the application 
