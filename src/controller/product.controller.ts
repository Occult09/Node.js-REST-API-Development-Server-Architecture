import type { IncomingMessage, ServerResponse } from "http";
import { readProduct } from "../service/product.service";
import type { IProduct } from "../types/product.type";

export const productController = (req: IncomingMessage, res: ServerResponse) => {
    const url = req.url;
    const method = req.method;

    const urlParts = url?.split('/');
    // console.log(urlParts);
    const id = urlParts && urlParts[1] === 'products' ? Number(urlParts[2]) : null;
    // console.log(id);


    if (url === '/products' && method === 'GET') { //Get all products
        const products = readProduct();
        readProduct();
        res.writeHead(200, { 'content-type': 'application/json' });
        res.end(JSON.stringify({
            message: 'This is product route',
            data: products
        }));
    }
    else if (method === 'GET' && id !== null) { //Get single product
        const products = readProduct();
        const product = products.find((p: IProduct) => p.id === id);
        // console.log(product);
        res.writeHead(200, { 'content-type': 'application/json' });
        res.end(JSON.stringify({
            message : `This is product ${id}`,
            data: product
        }))
    }
};