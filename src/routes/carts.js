import { Router } from "express";
import { config } from "../config/config.js";
import {  v4 as uuidv4,} from "uuid";
import path from 'path'
import fs from 'fs'
//import { pathToProducts } from "./products.js";
export const CartsRouter = Router()

const pathToCarts = path.join(config.dirname, './src/data/carts.json');


CartsRouter.post('/', async (req, res)=>{
    let cartsToString = await fs.promises.readFile(pathToCarts, 'utf-8');
        const carts =  JSON.parse(cartsToString);

        const  id = uuidv4()
        
        try {
            
            const cart =
         {
            id:id, 
            products:[]
    
         };
    carts.push(cart);

    await fs.promises.writeFile(pathToCarts, JSON.stringify(carts, null, 2));


    res.status(200).send({message: 'carrito creado con exito'})
        
    } catch (error) {
        
        res.send({message:`error ${error}`})}});


CartsRouter.get('/:cid', async (req, res)=>{

          let cartsToSring = await fs.promises.readFile(pathToCarts, 'utf-8');
            const carts = JSON.parse(cartsToSring);

            const {cid} = req.params 
          try {
            
            const cartById = carts.find((cart)=>cart.id === cid);

            if(!cartById){throw new Error('carrito no encontrado')};

            res.status(200).json(cartById.products)
          } catch (error) {
            res.status(404).json({message: `${error}`})
          }});


CartsRouter.post('/:cid/products/:pid', async (req, res)=>{
  
  //traemos las dos rutas para esta logica,
  //  ya que hay que traer el carro deseado,
  //  acceder a el,
  //  luego hacer un push de los id de los productos deseados,
  //en el caso de que ya exista ese producto hay que incrementar la cantidad del porducto en su prop quantity
  try {
              let cartsToSring = await fs.promises.readFile(pathToCarts, 'utf-8');
                const carts = JSON.parse(cartsToSring);
            
              let productsToString = await fs.promises.readFile(pathToProducts, 'utf-8')
                const products = JSON.parse(productsToString)
            
                const {cid, pid} = req.params
                          const cartById = carts.find((cart)=>cart.id===cid);
                            if(!cartById){throw new Error('carrito no encontrado')};

                          const productById = products.find((prod)=>prod.id === pid)
                            if(!productById){throw new Error('producto no encontrado')}

                        
                            // Verificar si el producto ya está en el carrito
                            const productInCart = cartById.products.find((prod) => prod.id === pid);
                        
                            if (productInCart) {
                              // Si el producto está en el carrito, incrementar la cantidad
                              productInCart.quantity += 1;
                              
                            } else {
                              // Si el producto no está en el carrito, agregarlo con cantidad 1
                              cartById.products.push({id:productById.id, quantity:1});
                              
                            }
                            const updatedCarts = JSON.stringify(carts, null, 2);
                            await fs.promises.writeFile(pathToCarts, updatedCarts);
                            res.status(200).json({message: productInCart ? 'Cantidad incrementada correctamente' : 'Producto agregado al carrito correctamente'})
            } 
            catch (error) 
            {
              res.status(404).json(`${error}`)
                        }})  


