import type { IncomingMessage, ServerResponse } from "http";
import { productController } from "../controller/product.controller";

export const routeHandler = (req: IncomingMessage, res: ServerResponse) => {
    // console.log(req.url);
    // console.log(req.method);
    const method = req.method;
    const url = req.url;

    if (url === '/' && method === 'GET') {
        //console.log("This is Root Route");
        res.writeHead(200, { 'content-type': 'application/json' });
        res.end(JSON.stringify({ message: "This is root route" }));
    }
    else if (url?.startsWith('/product')) {
        productController(req, res);
    }
    else {
        res.writeHead(404, { 'content-type': 'application/json' });
        res.end(JSON.stringify({ message: "Route not found" }));
    }
}