import {Setting} from "./settings.js";
import {MongoClient} from "mongodb";

const srcClient = new MongoClient(Setting.srcUri);
const destClient = new MongoClient(Setting.destUri);
let srcDb;
let destDb;
try {
    srcDb = await srcClient.connect();
    destDb = await destClient.connect();
} catch (err) {
    console.error("There was an error connecting to the databases", err);
}


const srcDbO = srcDb.db(Setting.srcDatabaseName);
const destDbO = destDb.db(Setting.destDatabaseName);

await srcDbO.listCollections().toArray((err, result) => {
    result.forEach(async (c) => {
        const collectionName = c.name;
        await destDbO.createCollection(collectionName);
        const documents = await srcDbO.collection(collectionName).find().toArray();
        await destDbO.collection(collectionName).insertMany(documents)

        console.log(documents, documents.length);
    })
})

