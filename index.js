const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_KEY}@cluster0.at4k8pd.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
        serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true,
        }
});
async function run() {
        try {
                await client.connect();
                const database = client.db("volunteer_networks");
                const donationCollection = database.collection("donation");
                const userCollection = database.collection('volunteer_users');

                // post method
                app.post('/donation_add', async (req, res) => {
                        const result = await donationCollection.insertOne(req.body.newVolunteer);
                        res.json(result);
                })
                app.post('/volunteer/users', async (req, res) => {
                        console.log(req.body);

                })

                // get method
                app.get('/volunteer', async (req, res) => {
                        const result = await donationCollection.find().toArray();
                        res.send(result);
                })
                app.get('/volunteer/:id', async (req, res) => {
                        const id = req.params.id;
                        const objectId = new ObjectId(id);
                        const query = { _id: objectId };
                        const result = await donationCollection.findOne(query);
                        res.send(result);

                })
        } finally {
                // Ensures that the client will close when you finish/error
                //   await client.close();
        }
}
run().catch(console.dir);


app.get('/', (req, res) => {
        res.send('Hello World!');
});

app.listen(port, () => {
        console.log(`Server running on port ${port}`);
});