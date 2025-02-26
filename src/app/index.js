import express from 'express';
import {ProductsRouter} from '../routes/products.js'
import { CartsRouter } from '../routes/carts.js';
import { dataBase } from '../db/index.js';
 const initApp = ()=>{

    const app = express();
     dataBase()

    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))

    app.use('/api/products', ProductsRouter)
    app.use('/api/products/:pid', ProductsRouter)
    app.use('/api/carts', CartsRouter)
    app.use('/api/carts/:cid', CartsRouter)
    app.use('/api/carts/:cid/products/:pid', CartsRouter)
    return app
};


export default initApp