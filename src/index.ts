import "dotenv/config";
import { serve } from "@hono/node-server";
import app from "./api/index.js";

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server start at: http://localhost:${info.port}`);
  }
);
