import type { IncomingMessage, ServerResponse } from "http";
import { insertProduct, readProduct } from "../service/product.service";
import type { IProduct } from "../types/product.type";
import { parseBody } from "../utility/parseBody";
import { sendResponse } from "../utility/sendResponse";

export const productController = async (req: IncomingMessage, res: ServerResponse) => {
    const url = req.url;
    const method = req.method;

    const urlParts = url?.split('/');
    // console.log(urlParts);
    const id = urlParts && urlParts[1] === 'products' ? Number(urlParts[2]) : null;
    // console.log(id);


    if (url === '/products' && method === 'GET') { //Get all products
        const products = readProduct();

        readProduct();
        try {
            return sendResponse(res, 200, true, "Products retrieved successfully", products);
        } catch (error) {
            return sendResponse(res, 500, false, "Something went", error);
        }
    }
    else if (method === 'GET' && id !== null) { //Get single product
        const products = readProduct();
        const product = products.find((p: IProduct) => p.id === id);
        if (!product) {
            return sendResponse(res, 404, false, "Products not found");
        }
        // console.log(product);
        try {
            return sendResponse(res, 200, true, "Products retrieved successfully!",product);
        } catch (error) {
            return sendResponse(res, 500, false, "Something went wrong!",error);
        }
    }
    else if (method === 'POST' && url === 'products') {
        const body = await parseBody(req);
        const products = readProduct();
        // console.log('Body', body);
        const newProduct = {
            id: Date.now(),
            ...body,
        }
        products.push(newProduct);
        insertProduct(products);
        res.writeHead(200, { 'content-type': 'application/json' })
        res.end(JSON.stringify({
            message: 'This is products route',
        }))
    }
    else if (method === 'PUT' && id !== null) {
        const body = await parseBody(req);
        const products = readProduct();

        const index = products.findIndex((p: IProduct) => p.id === id);
        console.log(index);
        if (index < 0) {
            sendResponse(res, 404, false, "Products not found");
        }
        // console.log(products[index])
        products[index] = { id: products[index].id, ...body }
        insertProduct(products);
        sendResponse(res, 200, true, "Products updated successfully",products[index]);
    }
    else if (method === 'DELETE' && id !== null) {
        const products = readProduct()
        const index = products.findIndex((p: IProduct) => p.id === id)
        if (index < 0) {
            res.writeHead(404, { 'content-type': 'application/json' })
            res.end(JSON.stringify({
                message: "Product not found",
                data: null
            }))
        }
        products.splice(index, 1);
        insertProduct(products);
        res.writeHead(200, { 'content-type': 'application/json' })
        res.end(
            JSON.stringify({
                message: 'Poduct Deleted',
                data: null
            }))
    }
};