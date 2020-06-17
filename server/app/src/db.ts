import * as mongo from "mongodb";
import MongoClient = mongo.MongoClient;

export class DB {
    public static client: mongo.MongoClient;

    public static connect(url: string) : Promise<MongoClient> {
        return new Promise<MongoClient>((resolve, reject) => {
            MongoClient.connect(url, {}, (err, client) => {
                if (err) {
                    reject(err);
                } else {
                    DB.client = client;
                    resolve(client);
                }
            });
        });
    }

    public static disconnect() {
        this.client.close();
    }
}