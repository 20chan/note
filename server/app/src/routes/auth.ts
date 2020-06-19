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
    private secret: Buffer;

    constructor(expires: number, secret: string) {
        this.expires = expires;
        this.secret = Buffer.from(secret, "base64");

        this.router = express.Router();
        this.router.post("/login", this.login);
        this.router.get("/logout", this.logout);
    }

    public auth = async (req: express.Request, resp: express.Response, next: express.NextFunction) => {
        const cookies = req.cookies;
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
        } else {
            next(new HttpError(401, "Auth token not found"));
        }
    }

    private login = async (req: express.Request, resp: express.Response, next: express.NextFunction) => {
        const user: User = req.body;
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

    private logout = async (req: express.Request, resp: express.Response, next: express.NextFunction) => {
        resp.setHeader("Set-Cookie", ["Authorization=; Max-age=0"]);
        resp.status(200);
    }

    private createCookie(token: Token): string {
        return `Authorization=${token.token}; HttpOnly; Max-Age=${token.expiresIn}; Path=/;`;
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
