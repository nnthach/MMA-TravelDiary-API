import express from "express";
import { CLOSE_DB, CONNECT_DB } from "~/config/mongodb";
import exitHook from "async-exit-hook";
import { env } from "~/config/environment";
import { APIs_V1 } from "~/routes/v1";

const START_SERVER = () => {
  const app = express();
  const hostname = env.APP_HOST;
  const port = env.APP_PORT;

  app.use(express.json());

  app.use("/v1", APIs_V1);

  app.listen(port, hostname, () => {
    console.log(`3. Server running at http://${hostname}:${port}/`);
  });

  // clean up before close server
  exitHook(() => {
    console.log("4. Server is shutting down...");
    CLOSE_DB();
    console.log("5. Sever disconnected");
  });
};

// IIFE
(async () => {
  try {
    console.log("1. Connecting to MongoDB Atlas...");
    await CONNECT_DB();
    console.log("2. Connected to mongodb atlas");

    START_SERVER();
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(0);
  }
})();
