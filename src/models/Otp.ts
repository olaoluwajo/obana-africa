import { connectToDatabase } from "../lib/db/mongodb";

export async function storeOtp(email: string, otp: string) {
	const { db } = await connectToDatabase();

	// OTP Collection
	const collection = db.collection("otps");

	//5 minutes (300 seconds) to expire
	const expirationTime = new Date(Date.now() + 5 * 60 * 1000);

	// Insert OTP into the database (with expiration time)
	await collection.updateOne(
		{ email },
		{
			$set: {
				otp,
				createdAt: new Date(),
				expiresAt: expirationTime,
			},
		},
		{ upsert: true },
	);
}

export async function getOtp(email: string) {
	const { db } = await connectToDatabase();

	const collection = db.collection("otps");

	// Finding the otp
	const otpDoc = await collection.findOne({ email });
	if (otpDoc && new Date() < otpDoc.expiresAt) {
		return otpDoc.otp;
	} else {
		return null;
	}
}

export async function deleteOtp(email: string) {
	const { db } = await connectToDatabase();

	const collection = db.collection("otps");
	console.log(`Deleting OTP for email: ${email}`);
	// db.collection("otps").createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
	await collection.deleteOne({ email });
}
