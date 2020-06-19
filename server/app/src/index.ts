import express from "express";
import { Auth } from "./routes/auth";
import * as todo from "./routes/todo";
import { DB } from "./db";
import { Account } from "./accounts";
import { errorMiddleware } from "./middlewares/error";

const app = express();
const PORT = process.env.PORT || 7000;
const MONGO_ADDR = process.env.MONGO_ADDR || "localhost:27017";
const ACCOUNTS_PATH = process.env.ACCOUNTS_PATH || "accounts.json";

const AUTH_EXPIRES = Number(process.env.AUTH_EXPIRES) || 60 * 60;
const AUTH_SECRET = process.env.AUTH_SECRET || "super-secret-key";

app.use(express.json());

app.get("/api/health", (req, res) => {
    res.send("healthcheck");
});

const auth = new Auth(AUTH_EXPIRES, AUTH_SECRET);

app.use("/api/auth", auth.router);
app.use("/api", auth.auth, todo.routes);

app.use(errorMiddleware);

const server = app.listen(PORT, () => {
    console.log(`server started at localhost:${PORT}`);
});

server.on("listening", async () => {
    console.log(`server started at localhost:${PORT}`);
    try {
        await Account.load(ACCOUNTS_PATH);
        console.log("accounts loaded");
    } catch (err) {
        console.error("error loading accounts", err);
    }
    try {
        await DB.connect(`mongodb://${MONGO_ADDR}`);
        console.log("db connected");
    } catch (err) {
        console.error("error connecting db", err);
    }
});