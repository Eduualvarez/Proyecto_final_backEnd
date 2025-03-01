import { Router } from "express";
import { Cart } from "../models/cart.model.js";
import { Product } from "../models/products.models.js";

export const CartsRouter = Router()




CartsRouter.post('/', async (req, res)=>{//hacer un carrito
    try{

      const cart =  new Cart;
      const new_cart = await Cart.insertOne(cart)
      await new_cart.save()
      res.status(200).send({message: 'carrito creado con exito', data:new_cart })
      
      
    }
    catch (error) {
        
        res.send({message:`error ${error}`})}});


CartsRouter.get('/:cid', async (req, res)=>{ // obtener el carrito por id, agregar populate para ver los productos completos pero solo guardar los id's
          try {
            const {cid} = req.params;
            const cart = await Cart.findById({'_id':cid})
          

          if (!cart){res.status(404).send({message:'cant find cart'})}

            res.status(200).send({message:"get cart success",  data:cart})
          } catch (error) {
            res.status(404).send({message: `${error}`})
          }});


CartsRouter.post('/:cid/products/:pid', async (req, res)=>{ 
  
  try{
    const {cid,pid} = req.params
    //traemos el producto
    const product = await Product.findById({"_id":pid});
    if (!product){res.status(404).send({message:'product not exist or cant find it '})};
    
    //traemos el cart 
    const cart = await Cart.findById({"_id":cid});
      if (!cart){res.status(404).send({message:'cart not exist or cant find it'})};

      const patch_cart = await Cart.insertOne({'products':product._id})
    res.status(200).send({message:'product added successfull',data:patch_cart})
            } 
            catch (error) 
            {
              res.status(404).send(`${error}`)
            }
                      });



CartsRouter.delete('/:cid/products/:pid', async (req, res)=>{
    try {
        const {cid, pid} = req.params;
        const cart = await Cart.findById({"_id":cid});
          if (!cart){res.status(404).send({message:'cart not exist or cant find it'})};
       

          const updatedCart = await Cart.findByIdAndUpdate(
            cid, 
            { $pull: { 'products': { _id: pid } } }, 
            { new: true }  
        );
        res.status(200).send({message:'product deleted correctly', data:updatedCart})
    } catch (error) {
      res.status(400).send({mesage:'some gone wrong', error})
    }


})


