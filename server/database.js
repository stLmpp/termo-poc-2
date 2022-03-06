const { MongoClient, ServerApiVersion } = require('mongodb');

// const uri = `mongodb+srv://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@termo-predictions.gdwqi.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(process.env.DATABASE_URI, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function getClientConnection() {
  await client.connect();
  return client;
}

module.exports = {
  getClientConnection,
}
