import express from "express";
import * as auth from "./routes/auth";
import * as todo from "./routes/todo";
import { DB } from "./db";
import { Account } from "./accounts";

const app = express();
const PORT = process.env.PORT || 7000;
const MONGO_ADDR = process.env.MONGO_ADDR || "localhost:27017";
const ACCOUNTS_PATH = process.env.ACCOUNTS_PATH || "accounts.json";

app.use(express.json());

app.get("/api/health", (req, res) => {
    res.send("healthcheck");
});

app.use("/api", todo.routes);
app.use("/api/auth", auth.routes);

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