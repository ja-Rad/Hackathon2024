import { MongoClient, Db } from "mongodb";

const uri: string | undefined = process.env.MONGODB_URI;

if (!uri) {
    throw new Error("Add Mongo URI to .env");
}

let client: MongoClient;
let clientPromise: Promise<MongoClient>; // NOSONAR

declare global {
    // eslint-disable-next-line no-var
    var _mongoClientPromise: Promise<MongoClient>; // NOSONAR
}

if (process.env.NODE_ENV === "development") {
    if (!global._mongoClientPromise) {
        // NOSONAR
        client = new MongoClient(uri);
        global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
} else {
    client = new MongoClient(uri);
    clientPromise = client.connect();
}

// Helper function to connect to the database
export const connectToDatabase = async (): Promise<{ client: MongoClient; db: Db }> => {
    const client = await clientPromise;
    const db = client.db("coventryCityDB");
    return { client, db };
};

export default clientPromise;
