import {} from "jest";
import * as request from "supertest";
import { App } from "../app";
import { MongoService } from "../services/MongoService";
import { MongoServiceT } from "../types/services/MongoServiceT";
import { AppT } from "../types/App";

let APP: AppT;
MongoService.connect().then((mongoService: MongoServiceT) => {
    APP = App(mongoService);
});

describe("General Tests", () => {
    test("This is a sample test", () => {
        expect(3 === 3).toBe(true);
    });

    test("This is a sample API test", () => {
        return request(APP).get("/status")
            .then((result: any) => {
                // Cause there is no route we expect 404 from the error route
                expect(result.status).toBe(404);
            });
    });
});
