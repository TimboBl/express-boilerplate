import * as express from "express";
import * as cors from "cors";
import * as Bluebird from "bluebird";
import { PORT } from "./configs/config";
import * as http from "http";
import { logger } from "./utils/logger";
import { AppT } from "./types/App";
import { MongoServiceT } from "./types/services/MongoServiceT";

export const App = (mongoService: MongoServiceT): AppT => {
    const app = express();
    let server: http.Server;

    app.use((req: express.Request, res: express.Response, next: Function) => {
        logger.info("New Request: ", {
            method: req.method,
            url: req.url,
        });
        req.headers["Content-Type"] = "application/json";
        next();
    });

    // Instantiate your middleware here
    app.use(express.json()); // Parse the body of the request as JSON
    app.use(express.urlencoded({extended: true})); // Parse all URL encoded parameters
    app.use(cors()); // Set Allow Access Origin Headers

    // Catch any errors that happened during the parsing process
    app.use((err: Error, req: express.Request, res: express.Response, next: Function) => {
       if (err) {
           logger.error("Parsing error on incoming request!", {error: err});
           res.status(422/*Unprocessable Entity*/)
               .send({message: "The parameters you supplied are not compatible with this API"});
           return;
       }
       next();
    });

    // Your routes go here!

    // This route sends a 404 if non of your routes matched

    app.all("*", (req: express.Request, res: express.Response) => {
        logger.info("Request to non recognizes route", {
            method: req.method,
            url: req.url,

        });
        res.status(404).send({message: "Not found"});
    });

    const listen = () => {
        server = app.listen(PORT, (err: Error) => {
            if (err) {
                return Bluebird.reject(err);
            }
            return Bluebird.resolve();
        });
    };

    const shutdown = () => {
        server.close((err: Error) => {
            if (err) {
                return Bluebird.reject(err);
            }
            return Bluebird.resolve();
        });
    };

    return {
        listen,
        shutdown
    };
};
