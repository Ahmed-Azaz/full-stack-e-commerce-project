const { MongoClient } = require("mongodb");
require("dotenv").config({ path: "./.env" });

async function testDBConnection() {
    const uri = process.env.MONGO_URI;
    const client = new MongoClient(uri);
    try {
    await client.connect();
    const collections = await client.db("e_commerce_project").listCollections().toArray();
    console.log("Collections found:", collections.map(col => col.name));
    
    }
    catch (error) {
        console.error("MongoDB connection failed:", error.message);
    }
    finally {
        await client.close();
    }
}
testDBConnection()