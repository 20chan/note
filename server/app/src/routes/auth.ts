import * as express from "express";
import * as jwt from "jsonwebtoken";
import { User, Account } from "../accounts";
import HttpError from "../errors/HttpError";

interface Token {
    token: string;
    expiresIn: number;
}

interface TokenData {
    _id: string;
}

export class Auth {
    public router: express.Router;
    private expires: number;
    private secret: string;

    constructor(expires: number, secret: string) {
        this.expires = expires;
        this.secret = secret;

        this.router = express.Router();
        this.router.post("/login", this.login);
    }

    public auth = async (req: express.Request, resp: express.Response, next: express.NextFunction) => {
        const cookies = req.cookies;
        console.log("oh..");
        if (cookies && cookies.Authorization) {
            try {
                const data = jwt.verify(cookies.Authorization, this.secret) as TokenData;
                const id = data._id;
                const user = Account.find(id);
                if (user) {
                    req.user = user;
                    next();
                } else {
                    next(new HttpError(401, "Wrong auth token"));
                }
            } catch {
                next(new HttpError(401, "Wrong auth token"));
            }
        }
        next(new HttpError(401, "Auth token not found"));
    }

    private login = async (req: express.Request, resp: express.Response, next: express.NextFunction) => {
        const user: User = req.body;
        console.log(`attempts: ${user.id}, ${user.password}`);
        if (user && Account.match(user.id, user.password)) {
            user.password = "";
            const token = this.createToken(user);
            resp.setHeader("Set-Cookie", [this.createCookie(token)]);
            resp.send(user);
        } else {
            resp.status(401);
            next(new HttpError(401, "Wrong credentials provided"));
        }
    }

    private createCookie(token: Token): string {
        return `Authorization=${token.token}; HttpOnly; Max-Age=${token.expiresIn}`;
    }

    private createToken(user: User): Token {
        const data: TokenData = {
            _id: user.id,
        };
        return {
            expiresIn: this.expires,
            token: jwt.sign(data, this.secret, { expiresIn: this.expires }),
        };
    }
}
