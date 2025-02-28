
 export const validate_req_body = async (req, res, next)=>
    {
  const { title,
            description, 
            code,
            price, 
            status, 
            stock,
            category,
            thumbnails} = await req.body;

    if((title||description||code||price||status||stock||category||thumbnails)===undefined)
        {
           throw new Error("need full all fields")
        }
       
        next()
    }
