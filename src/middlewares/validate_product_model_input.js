
 export const validate_req_body = async (req, res, next)=>
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
           error=("need full all fields")
        }
       
        next()
    }
