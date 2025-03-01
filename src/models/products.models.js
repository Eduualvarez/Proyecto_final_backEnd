
import mongoose from "mongoose";



const productsCollection = 'products';

const productSchema = new mongoose.Schema({

    title: 
    {
        type:String,
            required:false
        },
    description:  
    {
        type:String,
        required:false
    },
    code:  
    {
        type:String,
        required:false
    },
    price: 
    {
        type:Number,
        requiered:false

    },
    status:
    { 
        type:Boolean,
        requiered:false
    },
    stock:Number,
    category:  
    {   
        type:String,
        required:false
    },
    thumbnails:
    {
        type:[String],
        requiered:false
    },
    quantity: 
    {
        type:Number,
        requiered:false
    }
},
{ timestamps: false, versionKey: false });

export  const Product = mongoose.model(productsCollection, productSchema)



