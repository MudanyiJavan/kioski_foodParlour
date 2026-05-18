const express = require("express")
const path = require("path")
const {MongoClient, ObjectId}= require("mongodb") // const {MongoClient}= require("mongodb")

const app = express()
//Global variables
const url = 'mongodb://localhost:27017'
const url2 = 'mongodb://mudanyi:2024Japheth@ac-fwaq8g6-shard-00-00.moxtnys.mongodb.net:27017,ac-fwaq8g6-shard-00-01.moxtnys.mongodb.net:27017,ac-fwaq8g6-shard-00-02.moxtnys.mongodb.net:27017/?ssl=true&replicaSet=atlas-tq1wnq-shard-0&authSource=admin&appName=Nairobi-kioski'
const client = new MongoClient(url2)
//middlewares
app.use(express.static("public"))
app.use(express.json())
// database connection
let connectedDatabase;
async function connect(){
    try {
        await client.connect()
        console.log("successfuly connected to mongodb")
       connectedDatabase = client.db('ecommerce')//first database was kioski remember to clean it:: second database is kiosk
        return
    } catch (error) {
        console.log(error.message)
    }
}
connect()
app.get('/', (req, res)=>{
    res.sendFile(path.join(__dirname, "public/ecommerce/admin/superAdmin.html"))
})
app.get("/landing", (req, res)=>{
    res.sendFile(path.join(__dirname, "public/ecommerce/customers/landing.html"))
})
app.get("/cart2", (req,res)=>{
    res.sendFile(path.join(__dirname, "public/ecommerce/customers/cart.html"))
})
//Admin upload new products into the database
app.post('/', async (req, res)=>{
    const productName = req.body.product
    const productPrice = Number(req.body.price)
    //console.log(productName)
    const dataObject = {
        product: productName,
        price:productPrice
    }  
    try {        
        let collection = connectedDatabase.collection("products")

        await collection.insertOne(dataObject)
        let response = await collection.find().sort({ $natural: -1 }).limit(1).toArray()
        //console.log(response)
        res.status(201).json(response)
    } catch (error) {
        console.log(error.message)  
        res.status(500).json({ error: "Internal server error" });
    }
    
})

//retrieving all stored data when page loads
app.get("/products", async(req, res)=>{
    try {        
        const collection = connectedDatabase.collection("products")
        //await collection.deleteMany({});
        const data = await collection.find().toArray()
        //console.log(data)
        res.json(data)
    } catch (error) {
        console.log(error.message)
    }
})

//customer adding products to cart
app.post("/cart", async(req, res)=>{
    const productID = req.body.itemID
    const quantity = Number(req.body.quantity)
    //console.log("product_id",productID)
    //console.log("quantity:", quantity)
    try {
        const collection = await connectedDatabase.collection("products")
        const results= await collection.findOne({ _id: new ObjectId(productID)})
        //console.log(results)

        const Cartcollection = await connectedDatabase.collection("cart")
        const cartObject = { _id:productID, product: results.product, price:Number(results.price), Qty:quantity}
        await Cartcollection.insertOne(cartObject)
        const cartData = await Cartcollection.find().sort({ $natural: -1 }).limit(1).toArray();
        //console.log(cartData)
        //console.log("products in the cart")
        const updatedCart = await collection.find({}).toArray();
        //console.log(updatedCart)
        res.json(cartData)

    } catch (error) {
        console.log(error.message)
    }
})
app.patch("/cart", async(req, res)=>{
    const one_product_id= req.body.product_id
    const product_quantity= req.body.qty
    //console.log(one_product_id)
    if (!one_product_id || product_quantity === undefined) {
        return res.status(400).json({ error: "Missing product_id or qty" })
    }
    try {
        const collection = await connectedDatabase.collection("cart")
        const queryFilter = { _id: one_product_id };

        const result = await collection.updateOne(
            queryFilter, // Match condition (adjust "id" to "_id" if using MongoDB's default IDs)
            { $set: { Qty: product_quantity } } // Only update the qty field
        )
        //console.log(result)
        const updatedCart = await collection.find({}).toArray();
        //console.log(updatedCart)
        res.status(200).json({ message: "Quantity updated successfully", result })
    } catch (error) {        
        res.status(500).json({ error: "Internal server error", details: error.message })
    }

})
app.delete("/cart", async(req, res)=>{
    const product_id = req.body.product_id;
    if (!product_id) {
        return res.status(400).json({ error: "Missing product ID" });
    }
    try {
        const collection = await connectedDatabase.collection("cart") 
        const result = await collection.deleteOne({ _id: product_id });
        const updatedCart = await collection.find({}).toArray();
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: "Item not found in cart" });
        }
        //console.log(updatedCart)
        res.status(200).json({ message: "Item removed from cart successfully", result })

    } catch (error) {
        
    }


})

app.get("/cart_documents", async(req, res)=>{
    try {
        const collection = connectedDatabase.collection("cart")
        let documents= await collection.countDocuments({})
        //console.log(documents)
        res.json(documents)
    } catch (error) {
        
    }
})
app.get("/cart_GrandTotal_price", async(req, res)=>{
    try {
        const collection = await connectedDatabase.collection("cart") 
        const result = await collection.aggregate([
            {
                $group: {
                    _id: null, // null means group everything into a single total
                    grandTotal: { 
                        // For each document, multiply price by Qty, then sum them up
                        $sum: { $multiply: [ "$price", "$Qty" ] } 
                    }
                }
            }
        ]).toArray();
        // If the cart is empty, result will be an empty array. Handle that case:
        const totalAmount = result.length > 0 ? result[0].grandTotal : 0;
        //console.log(totalAmount)
        res.json(totalAmount);
    } catch (error) {
        console.error("Aggregation failed:", error);
        res.status(500).json({ success: false, error: error.message });
    }
})
//retrieving all cart stored data
app.get("/cart", async(req, res)=>{
    try {        
        const collection = connectedDatabase.collection("cart")
        //await collection.deleteMany({});
        const cartData = await collection.find().toArray()
       console.log(cartData)
        res.json(cartData);
    } catch (error) {
        console.log(error.message)
    }
})

app.post("/order", async(req, res)=>{
    const items= req.body.items
    const total_Amount= req.body.total_Amount
    const location= req.body.location
    let order_object= {
        items: items,
        total_Amount:total_Amount,
        location:location,
        orderDate: new Date(), // Automatically record when the order happened
        status: "Pending"
    }
    
    try {
        const collection = await connectedDatabase.collection("orders")    
        const result= await collection.insertOne(order_object)

        // Optional: Clear the user's cart here since they just checked out!
        await connectedDatabase.collection("cart").deleteMany({});
        console.log(order_object)
        res.json(order_object);
    } catch (error) {
        
    }
})
app.get("/order", async(req, res)=>{
    try {        
        const collection = connectedDatabase.collection("orders")
        //await collection.deleteMany({});
        const Order_data = await collection.find().toArray()
       //console.log(cartData)
        res.json(Order_data);
    } catch (error) {
        console.log(error.message)
    }
})

//usefull checker
app.get("/check-types", async (req, res) => {
    try {
        const collection = await connectedDatabase.collection("cart");

        // Find documents where Qty is a string OR price is a string
        const brokenDocuments = await collection.find({
            $or: [
                { Qty: { $type: "string" } },
                { price: { $type: "string" } }
            ]
        }).toArray();

        res.json({
            message: `Found ${brokenDocuments.length} broken items containing strings instead of numbers.`,
            badData: brokenDocuments
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>{
    console.log(`server running on http://localhost:${PORT}`)
})


