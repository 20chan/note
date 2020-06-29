import * as express from "express";
import * as mongo from "mongodb";
import { DB } from "../db";

const routes = express.Router();

const getCollection = () => {
    return DB.client.db('note').collection('notes');
};

const mapItem = (item: any) => {
    return {
        id: item._id,
        title: item.title,
        content: item.content,
    };
};

routes.get("/note", (req, resp) => {
    const user = req.user.id;
    const collection = getCollection();
    const result = collection.find({"author": user}).toArray((err, items) => {
        if (err) {
            resp.status(500);
            console.error("error on todo.routes.get /note", err);
        } else {
            items = items.map(mapItem);
            resp.json(items);
        }
    });
});

routes.get("/note/:id", async (req, resp) => {
    const id = req.params.id;
    const user = req.user.id;
    const collection = getCollection();
    try {
        const result = await collection.findOne({"_id": new mongo.ObjectID(id), "author": user});
        const item = mapItem(result);
        resp.json(item);
    } catch {
        resp.status(404);
    }
});

routes.post("/note", async (req, resp) => {
    const collection = getCollection();
    const item = {
        user: req.user.id,
        title: req.body.title,
        content: req.body.content,
    };
    if (!item.title || !item.content) {
        resp.status(400);
        resp.send({"error": true});
    } else {
        await collection.insert(item);
        resp.send({"error": false});
    }
});

routes.put("/note/:id", async (req, resp) => {
    const id = req.params.id;
    const user = req.user.id;
    const collection = getCollection();
    const item = {
        user: req.user.id,
        title: req.body.title,
        content: req.body.content,
    };
    try {
        await collection.updateOne({"_id": new mongo.ObjectID(id), "author": user}, item);
        resp.send({"error": false});
    } catch {
        resp.status(404);
        resp.send({"error": true});
    }
});

export { routes };