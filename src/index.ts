import express from "express";

const app = express();

app.set("port", process.env.PORT || 7000);

app.get("/", (req, res) => {
    res.send("Hello world!");
});

const server = app.listen(app.get("port"), () => {
    console.log(`server started at localhost:${app.get("port")}`);
})