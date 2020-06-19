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
    const collection = getCollection();
    const result = collection.find({}).toArray((err, items) => {
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
    const collection = getCollection();
    try {
        const result = await collection.findOne({"_id": new mongo.ObjectID(id)});
        const item = mapItem(result);
        resp.json(item);
    } catch {
        resp.status(404);
    }
});

routes.post("/note", (req, resp) => {
    const collection = getCollection();
    const item = {
        title: req.body.title,
        content: req.body.content,
    };
    if (!item.title || !item.content) {
        resp.status(400);
        resp.send({"error": true});
    } else {
        collection.insert(item);
        resp.send({"error": false});
    }
});

export { routes };