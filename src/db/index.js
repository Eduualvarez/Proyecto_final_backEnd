import mongoose from "mongoose"

export const dataBase = async ()=>{
    try {
        await mongoose.connect(`mongodb+srv://proyectoFinalBackEnd:j6TFT5meLYMlmHZs@cluster0.hnr7u.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`)
        console.info("database connected with success")
        
    } 
        
       catch (error) {
        
        console.error(error, "error to connect with database")
    }}

