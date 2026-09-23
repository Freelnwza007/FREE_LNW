require("dotenv").config({ path: "server/.env" });

const app = require("../server/src/app");
const connectDB = require("../server/src/config/db");

// The cached Mongoose connection is reused by warm Vercel function instances.
module.exports = async (req, res) => {
  try {
    // The rewrite names the requested Express path in `path`; restore it before
    // handing the request to Express while preserving the request query string.
    const requestUrl = new URL(req.url, `http://${req.headers.host || "localhost"}`);
    const apiPath = requestUrl.searchParams.get("path");
    if (apiPath !== null) {
      requestUrl.searchParams.delete("path");
      const query = requestUrl.searchParams.toString();
      req.url = `/api/${apiPath}${query ? `?${query}` : ""}`;
    }
    await connectDB();
    return app(req, res);
  } catch (error) {
    console.error("Database connection failed:", error.message);
    return res.status(500).json({ message: "Database connection failed" });
  }
};
