# Vercel deployment

1. Push both the `server` submodule and this repository, then import this repository in Vercel with the repository root as the project root. Vercel must have access to the `server` repository too.
2. In **Storage**, create a Vercel Blob store and connect it to the project. Vercel adds `BLOB_READ_WRITE_TOKEN` automatically.
3. In **Settings > Environment Variables**, add `MONGO_URI` (your MongoDB Atlas connection string) and a long random `JWT_SECRET`. Use `.env.example` as the variable reference.
4. In MongoDB Atlas, allow Vercel to connect to the cluster. For a simple initial deployment, add `0.0.0.0/0` to the Atlas IP access list; restrict it later through your chosen network setup.
5. Deploy. The Vite site is served from `client/dist`, `/api/*` runs as a Vercel Function, and image uploads up to 4 MB are written to Blob under `products/`.

For local API development, keep `MONGO_URI`, `JWT_SECRET`, and `BLOB_READ_WRITE_TOKEN` in `server/.env`.
