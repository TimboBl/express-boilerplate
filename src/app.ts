import * as express from "express";
import * as Bluebird from "bluebird";
import { PORT } from "./configs/config";
import * as http from "http";

export const App = (() => {
    const app = express();
    let server: http.Server;

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
})();
