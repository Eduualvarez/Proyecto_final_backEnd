import mongoose from "mongoose";


const cart_collection = 'carts'

const cartSchema = new mongoose.Schema({

    products: [{
        type: mongoose.Schema.Types.ObjectId, ref: 'products' ,
       
    }]


},
{ timestamps: false, versionKey: false })

export const Cart = mongoose.model(cart_collection, cartSchema);