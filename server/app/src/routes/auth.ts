import * as express from "express";
import { User, Account } from "../accounts";

const routes = express.Router();

routes.post("/login", async (req, resp, next) => {
    const user: User = req.body;
    console.log(`attempts: ${user.id}, ${user.password}`);
    if (user && Account.match(user.id, user.password)) {
        user.password = "";
        resp.send(user);
    } else {
        resp.status(401);
        next(new Error("401 Wrong credentials provided"));
    }
});

export { routes };