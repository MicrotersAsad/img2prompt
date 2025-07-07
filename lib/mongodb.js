// lib/mongodb.js
import { MongoClient } from 'mongodb';

const uri ="mongodb+srv://imgtoprompt:Fn4TOg7ynTfmHPgE@cluster0.mywvd.mongodb.net/imgtoprompt?retryWrites=true&w=majority&appName=Cluster0"
console.log(uri);

console.log('DEBUG: MONGODB_URI value in mongodb.js:', uri); // <-- ADD THIS LINE
const options = {};

let client;
let clientPromise;

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;