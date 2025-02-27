
 export const validate_req_body = (req, res, next)=>
    {
    const { title,
            description, 
            code,
            price, 
            status, 
            stock,
            category,
            thumbnails} = req.body;

    if((title||description||code||price||status||stock||category||thumbnails)===undefined)
        {
            new Error("need full all fields")
        }
        next()



    }

/* "product": {
        "title": "producto 1",
        "description": "descripcion de prueba 1",
        "code": "abc 2",
        "price": 101,
        "status": false,
        "stock": 50,
        "category": "category 1",
        "thumbnails": [
          "prueba 1",
          "prueba 2"
        ]*/ 