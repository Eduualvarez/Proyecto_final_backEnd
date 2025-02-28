import { Router } from "express";
import { Product } from "../models/products.models.js";
import { pagination } from "../models/paginate.js";
import { validate_req_body } from "../middlewares/validate_product_model_input.js";




export const ProductsRouter = Router();







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
       :(status=false)//pasando de str a booleano para buscar en la db
       searchQuery = {'product.status':status}
      };
         
    

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
      
      const product_to_create = req.body;

    const validate_if_exist = await Product.findOne({"title":product_to_create.title})
      if (validate_if_exist){throw new Error('el producto ya existe ')}
      
      const newProduct = new Product(product_to_create);
      await newProduct.save();

       res.status(200).send({ message: 'Producto creado', data: newProduct })
        
    } catch (error) {
        res.status(400).send({message:`error: ${error}`})
    }});


    //para obtener un producto solo mediante parametros 


ProductsRouter.get('/:pid', async (req, res)=>{
      const {pid} = req.params;
    try {
      const product_filtered_byId = await Product.findOne({"_id":pid})
        res.status(200).send({message:'get product by Id with success', data: product_filtered_byId})
      
    } catch (error) {
      res.status(500).send({ message: "product not found, or dosen't exist" })}})





      //metodo patch
      ProductsRouter.put(('/:pid'), async (req, res)=>{
        
        const {pid}= req.params;
        const { title,
          description, 
          code,
          price, 
          status, 
          stock,
          category,
          thumbnails} = req.body;

        
        try {
          // Leemos y parseamos el archivo de productos
          let product_to_patch = await Product.findOneAndUpdate({"_id":pid},{"product":{
            title,
            description,
            code,
            price,
           status,
           stock,
           category,
           thumbnails}},{new:true});

            
            console.log(product_to_patch)                                                                
           

              res.status(200).send({message:'product updated successfull',data:product_to_patch}) 
          
          

        } catch (error) 
        {
          res.status(500).json({ message: 'Error al actualizar el producto. Intente nuevamente más tarde.',error });
          }
          
          })//metodo patch
          
          /*
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
        
        */