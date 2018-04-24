import {App} from "./app";
import {MongoService} from "./services/MongoService";
import { MongoServiceT } from "./types/services/MongoServiceT";
import { AppT } from "./types/App";
import { logger } from "./utils/logger";
import { PORT } from "./configs/config";

const startServer = () => {
    let app: AppT;
  MongoService.connect().then((mongoService: MongoServiceT) => {
        app = App(mongoService);
        return app.listen()
  }).then(() => {
      logger.info("Server is running!", {PORT});
  }).catch((err: Error) => {
      logger.error("There was an issue starting up the server! See the logs above to find the reason.", {error: err});
      process.exit(-1);
  });

  process.on("SIGINT", () => {
      MongoService.shutdown().then(() => {
          logger.info("MongoDB connection was closed");
          return app.shutdown();
      }).then(() => {
          logger.info("HTTP Server was closed. Ending Process now");
          process.exit(0);
      }).catch((err: Error) => {
          logger.error("Shutting down the server failed!", {error: err});
      });
  });
};

startServer();
