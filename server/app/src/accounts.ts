import * as crypto from "crypto-js";
import { readFile } from "fs";

export interface User {
    id: string;
    password: string;
}

export class Account {
    public static users: User[];

    public static load(path: string): Promise<User[]> {
        return new Promise<User[]>((resolve, reject) => {
            readFile(path, "utf-8", (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    Account.users = JSON.parse(data);
                    resolve(Account.users);
                }
            });
        });
    }

    public static match(id: string, password: string): boolean {
        const match = this.users.find(user => user.id === id);
        if (match) {
            return match.password === crypto.SHA512(password).toString();
        }
        return false;
    }

    public static find(id: string): User | undefined {
        return this.users.find(user => user.id === id);
    }
}