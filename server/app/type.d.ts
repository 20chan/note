import { User } from "./src/accounts";
import { Request } from "express";

declare global {
    namespace Express {
        export interface Request {
            user: User;
        }
    }
}
