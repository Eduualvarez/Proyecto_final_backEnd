
import mongoose from "mongoose";



const productsCollection = 'products';

const productSchema = new mongoose.Schema({

    title: 
    {
        type:String,
            required:true
        },
    description:  
    {
        type:String,
        required:true
    },
    code:  
    {
        type:String,
        required:true
    },
    price: 
    {
        type:Number,
        requiered:true

    },
    status:
    { 
        type:Boolean,
        requiered:true
    },
    stock:Number,
    category:  
    {   
        type:String,
        required:true
    },
    thumbnails:
    {
        type:[String],
        requiered:true
    },
    quantity: 
    {
        type:Number,
        requiered:false
    }
},
{ timestamps: false, versionKey: false });

export  const Product = mongoose.model(productsCollection, productSchema)



