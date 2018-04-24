import * as mongoose from "mongoose";
import { MONGO_CONNECTION_STRING } from "../configs/config";
import * as Bluebird from "bluebird";
import { logger } from "../utils/logger";
import { MongoServiceT } from "../types/services/MongoServiceT";

export const MongoService = ((): {connect(): Bluebird<MongoServiceT>, shutdown(): Bluebird<void>} => {
    (<any>mongoose).Promise = Bluebird;

    // Implement your queries here and add them to the mongoService object

    const mongoService: MongoServiceT = {};

    const connect = (): Bluebird<MongoServiceT> => {
        logger.debug("Connecting to mongoDB", {connectionString: MONGO_CONNECTION_STRING});
        if (!MONGO_CONNECTION_STRING) {
            logger.info("You need to set the Mongo Connection string in your env variables!");
            return Bluebird.reject("You have not provided a connection string in the env properties");
        }
        mongoose.connection.on("error", (err: Error) => logger.error("There was an error connection to mongoDB", {error: err}));
        return mongoose.connect(MONGO_CONNECTION_STRING).then(() => {
            return mongoService;
        });
    };

    const shutdown = (): Bluebird<void> => {
        return mongoose.connection.close();
    };

    return {
        connect,
        shutdown,
    };
})();
