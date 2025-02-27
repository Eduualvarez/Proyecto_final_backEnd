import  initApp  from "./app/index.js";
import { config } from "./config/config.js";
import {dataBase} from './db/index.js'


await dataBase()
const app = initApp();



const server = app.listen(config.PORT, ()=>{
    console.info(`server is active listen on http://localhost:${config.PORT}`)
})

