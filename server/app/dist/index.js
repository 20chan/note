"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = express_1.default();
app.set("port", process.env.PORT || 7000);
app.get("/api/health", (req, res) => {
    res.send("healthcheck");
});
const server = app.listen(app.get("port"), () => {
    console.log(`server started at localhost:${app.get("port")}`);
});
//# sourceMappingURL=index.js.map