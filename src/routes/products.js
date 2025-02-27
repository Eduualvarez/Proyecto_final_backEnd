import { Router } from "express";
import path from 'path'
import { config } from '../config/config.js';
import fs from 'fs'

import { Product } from "../models/products.models.js";
import { pagination } from "../models/paginate.js";
import { validate_req_body } from "../middlewares/validate_product_model_input.js";




export const ProductsRouter = Router();

export const pathToProducts = path.join(config.dirname, './src/data/products.json');





ProductsRouter.get('/', async (req, res)=>{
  try {
    let {limit, page, query, sort, categories, status} =  req.query

    limit = limit ? Number(limit) : 10;
    const skip = (limit * page)-limit;

    page = page ? Number(page) : 1;

    let searchQuery = {};//si no viene la query 
    if(query) searchQuery = { "product.title": { $regex: query, $options: 'i'}};
    if (categories) searchQuery = {"product.category": { $regex: categories, $options: 'i'}}//si viene una categories

    if (status !== undefined){      //si viene un status para filtrar por el mismo 
      const str = 'true';
       (status===str)
       ?(status=true)
       :(status=false);//pasando de str a booleano para buscar en la db
      };
     searchQuery = {'product.status':status}
    

    let sortQuery = {};
    if (sort === 'asc') {
      sortQuery = { "product.price": 1 }; // Ordenar por precio ascendente
    } else if (sort === 'desc') {
      sortQuery = { "product.price": -1 }; // Ordenar por precio descendente
    } 
    let products_data =  await Product.find(searchQuery)
                     .limit(limit)
                     .skip(skip)
                     .sort(sortQuery)       

                     
    const totalProducts = await Product.countDocuments(searchQuery)
    res.status(200).send
    ({
      message:'products get with success',
      data: products_data,
      pagination: await pagination(totalProducts, limit, page, query, sort)
    })} // try
              
    catch (error) {
    res.status(500).send({mesagge:`server internal error: ${error}`})
  }//catch
})//endpoint get



ProductsRouter.post('/',validate_req_body, async (req, res) => {
  
    try { 
      
      const product_to_create = validate_req_body
      Product.insertOne(product_to_create)
       res.status(200).send({ message: 'Producto creado', data: product_to_create })
        
    } catch (error) {
        res.status(400).send({mesagge:`error: ${error}`})
    }});


    //para obtener un producto solo mediante parametros 


ProductsRouter.get('/:pid', async (req, res)=>{
      const {pid} = req.params;
    try {

      let productsString = await fs.promises.readFile(pathToProducts, 'utf-8')
      const products = JSON.parse(productsString)
      
      const productsFiltred = products.filter((product)=>product.id === pid)
      if (productsFiltred.length === 0) {
        res.status(404).send({ message: 'Producto no encontrado' });
      } else {
        res.status(200).send(productsFiltred[0]);  // Enviamos el primer producto encontrado
      }
    } catch (error) {
      res.status(500).send({ message: `Error: ${error}` })}})





      //metodo patch

ProductsRouter.put(('/:pid'), async (req, res)=>{

        const {pid}= req.params;

   
      
      try {
        // Leemos y parseamos el archivo de productos
        let productsString = await fs.promises.readFile(pathToProducts, 'utf-8');
        const products = JSON.parse(productsString);
    
        // Buscamos el producto que se quiere actualizar
        const productToPatch = products.find((product) => product.id === pid);
    
        // Verificamos si el producto existe
        if (!productToPatch) {
          return res.status(404).json({ message: `Producto con ID ${pid} no encontrado` });
        }
    
        // Validamos los datos que vienen en el cuerpo de la solicitud
        const { title, description, code, price, status, stock, category, thumbnails } = req.body;
        if (!title || !description || !code || !price || !status || !stock || !category || !thumbnails) {
          return res.status(400).json({ message: 'Todos los campos deben ser proporcionados' });
        }
    
        // Actualizamos el producto con los nuevos datos
        const updatedProduct = {
          id: pid, // Mantenemos el mismo ID
          title,
          description,
          code,
          price,
          status,
          stock,
          category,
          thumbnails,
        };
    
        // Reemplazamos el producto en la lista
        const updatedProducts = products.map((product) =>
          product.id === pid ? updatedProduct : product
        );
    
        // Escribimos la lista de productos actualizada en el archivo
        await fs.promises.writeFile(pathToProducts, JSON.stringify(updatedProducts, null, 2));
    
        // Respondemos con éxito
        res.status(200).json({ product: updatedProduct, message: 'Producto actualizado' });
      } catch (error) 
      {
        res.status(500).json({ message: 'Error al actualizar el producto. Intente nuevamente más tarde.' });
      }
    
      })

      //metodo delete 
ProductsRouter.delete('/:pid', async (req, res)=>{
        const {pid} = req.params;
      try {
  
        let productsString = await fs.promises.readFile(pathToProducts, 'utf-8')
        const products = JSON.parse(productsString)
       
        const productToDelete = products.find((product)=>product.id===pid)

        if (!productToDelete) {
          return res.status(404).json({ message: `Producto con ID ${pid} no encontrado` });
        }
   
        const updatedProducts = products.filter((product) => product.id !== pid);

 
        await fs.promises.writeFile(pathToProducts, JSON.stringify(updatedProducts, null, 2));

    
        res.status(200).json({ message: 'Producto eliminado con éxito' });

        
      } catch (error) {
        res.status(500).send({ message: `Error: ${error}` })}})
        
        