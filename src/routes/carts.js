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

CartsRouter.get('/', async (req, res)=>{
    try {
        const carts = await Cart.find({})
        if(!carts){throw new Error({message:'not carts found'})}
        res.status(200).send({message:'get all carts correctly',data:carts})
    } catch (error) {
        res.status(400).send({message:error.mesagge})
    }
})
CartsRouter.get('/:cid', async (req, res)=>{ // obtener el carrito por id, agregar populate para ver los productos completos pero solo guardar los id's
          try {
            const {cid} = req.params;
            const cart = await Cart.findById({'_id':cid}).populate('products')
          
            if (!cart)
              {throw new Error("cant get  the cart")}
            

            res.status(200).send({message:"get cart success",  data:cart})
          } catch (error) {
            res.status(404).send({message: error.message})
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

      const patch_cart = await Cart.findByIdAndUpdate(
        cid,  // ID del carrito
        { $push: { products: product._id } },  // Usamos $push para agregar el producto al carrito
        { new: true }  // Retorna el carrito actualizado
      );
    res.status(200).send({message:'product added successfull',data:patch_cart})
            } 
            catch (error) 
            {
              res.status(404).send(`${error}`)
            }
                      });



CartsRouter.delete('/:cid/products/:pid', async (req, res)=>{
  const {cid, pid} = req.params;
    try {
      const cart = await Cart.findById(cid);
      if (!cart) {
        return res.status(404).send({ message: 'Cart does not exist or cannot find it' });
      }
  
      // Eliminar el producto del carrito utilizando el _id del producto (pid)
       await Cart.findByIdAndUpdate(
        cid, 
        { $pull: { products: pid } }, 
        { new: true }  // Esto devuelve el carrito actualizado
      );
      const updated_cart = await  Cart.find({"_id":cid})
        res.status(200).send({message:'product deleted correctly', data:updated_cart})
    } catch (error) {
      res.status(400).send({mesage:'some gone wrong', error})
    }


})


CartsRouter.put('/:cid/products', async (req, res)=>{ 
  //traer el carrito e insertarle un array de productos, recibidos por req.query

    try {
      const { cid } = req.params;
      const { products } = req.body;
     
   
     //validar si los objeos no estan em el cart,
     //en el caso que esten debemos incrementar la candidad en 1, en la collection de Product
     
     //en el caso de que no esten agrearlos al cart y aumentar la cantidad en 1 en la collection de Product
     
      const products_ids = [...products]
      let products_to_add =  await Product.find({"_id":{$in : products_ids}}, "_id")
      const productIdsToAdd = products_to_add.map(product => product._id);

      for (let i = 0; i < productIdsToAdd.length; i +=1)
        {
          
          const productId = productIdsToAdd[i];

      // Verificar si el producto ya está en el carrito
      const productInCart = await Cart.findOne({
        _id: cid,
        "products": productId
      });

      if (!productInCart) {
        // Si el producto no está en el carrito, agregarlo sin cantidad (solo el _id)
        await Cart.findByIdAndUpdate(
          cid,
          { $push: { products: {_id: productId } } } // Solo agregamos el _id sin cantidad
        );

        // También incrementar la cantidad en la colección Product
        await Product.updateOne(
          { _id: productId },
          { $inc: { quantity: 1 } } // Incrementar la cantidad en la colección Product
        );
      } else {
        // Si el producto ya está en el carrito, solo incrementar la cantidad en la colección Product
        await Product.updateOne(
          { _id: productId },
          { $inc: { quantity: 1 } } // Incrementar la cantidad en la colección Product
        );
      }
    }
                  
                
                
                
              
              
              const updated_cart = await Cart.findById({"_id":cid})
              res.status(200).send({message:'products added', data: updated_cart })

      
            } 
              catch (error) 
            {
              res.status(404).send(`${error}`)
            }
                      });


CartsRouter.delete('/:cid', async (req, res)=>{
      try {
        const {cid} = req.params
          await Cart.findByIdAndDelete(cid)
          const cart = await Cart.findById(cid)
          if(!cart)
            {
              res.status(200).send({message:'cart deleted with success'})
            }
      } catch (error) {
        res.status(400).send({message:'some gone wrong'})
      }


})              

CartsRouter.put('/:cid/products/:pid',async(req, res)=>{
try {
      const{cid, pid}= req.params;
      const {quantity}= req.body;
      const cart = await Cart.findById(cid);
    if (!cart) {
      return res.status(404).send({ message: 'Cart not found' });
    }

    // Verificamos si el producto está en el carrito
    const productInCart = cart.products.some(product => product.toString() === pid);
    if (!productInCart) {
      return res.status(404).send({ message: 'Product is not in the cart' });
    }

    
    // Si el producto está en el carrito, lo actualizamos en la colección de productos
    const productUpdated = await Product.findByIdAndUpdate(
      pid,
      { $inc: { quantity: quantity } },  // Incrementamos la cantidad en el producto
      { new: true }  // Esto devolverá el producto actualizado
    );

    res.status(200).send({ message: 'Product quantity updated successfully', data: productUpdated });

  } catch (error) {
    res.status(400).send({ message: 'Something went wrong', error: error.message });
  }
})