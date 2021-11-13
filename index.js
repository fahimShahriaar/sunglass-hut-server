const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

require('dotenv').config();
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;


//middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.sta54.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const databse = client.db("sunglassdb");
        const productsCollecton = databse.collection("products");
        const ordersCollection = databse.collection('orders');
        const usersCollection = databse.collection('users');
        const reviewCollection = databse.collection('reviews');


        //user post api
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user)
            // console.log(result);
            res.json(result)
        })


        //orders post api
        app.post('/orders', async (req, res) => {
            const order = req.body;
            const result = await ordersCollection.insertOne(order)
            res.json(result)
        })


        //order get api
        app.get('/orders', async (req, res) => {
            const params = req.params;

            const cursor = ordersCollection.find({});
            const order = await cursor.toArray();
            // console.log(order);
            res.json(order);
        })

        //Delete order API

        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            console.log(query);
            const result = await ordersCollection.deleteOne(query);
            // console.log("delet with id:", result);
            res.json(result);
        })

        //Get product API
        app.get('/products', async (req, res) => {
            const params = req.params
            // console.log(params);
            const cursor = productsCollecton.find({});
            const services = await cursor.toArray();
            res.send(services);
        })

        // post product API

        app.post('/products', async (req, res) => {
            const service = req.body;
            // console.log('post hit api', service);
            const result = await productsCollecton.insertOne(service);
            res.json(result);
        })

        //Delete products API

        app.delete('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            console.log(query);
            const result = await productsCollecton.deleteOne(query);
            console.log("delet with id:", result);
            res.json(result);
        })


        //user put api for Admin  
        app.put('/users/admin', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const updateDoc = { $set: { role: 'admin' } };
            const result = await usersCollection.updateOne(filter, updateDoc);
            res.json(result);
        })
        //admin get API
        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const user = await usersCollection.findOne(query);
            let isAdmin = false;
            if (user?.role === 'admin') {
                isAdmin = true;
            }
            res.json({ admin: isAdmin });
        })

        //post Review API
        app.post('/reviews', async (req, res) => {
            const newReview = req.body;
            const result = await reviewCollection.insertOne(newReview);
            console.log('got new review', req.body);
            console.log('added review', result);
            res.json(result);
        })

        //get Review API
        app.get('/reviews', async (req, res) => {
            const cursor = reviewCollection.find({});
            const users = await cursor.toArray();
            res.send(users);
        })



    }
    finally {

    }


}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('server is running');
});
app.listen(port, () => {
    console.log('server running at port', port);
})