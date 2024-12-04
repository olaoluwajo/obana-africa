import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI || "mongodb://localhost:27017");

let db: any;

export async function connectToDatabase() {
	if (db) {
		return { db, client };
	}

	await client.connect();
	db = client.db("otpDB");
	console.log("MongoDB connected successfully!");
	return { db, client };
}
