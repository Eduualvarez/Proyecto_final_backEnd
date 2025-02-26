import  initApp  from "./app/index.js";
import { config } from "./config/config.js";

const app = initApp();



const server = app.listen(config.PORT, ()=>{
    console.info(`server is active listen on http://localhost:${config.PORT}`)
})

