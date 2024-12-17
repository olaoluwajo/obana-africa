import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

console.log("Cloudinary Config:", {
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY ? "Loaded" : "Not Loaded",
	api_secret: process.env.CLOUDINARY_API_SECRET ? "Loaded" : "Not Loaded",
});


export const runtime = "nodejs";

// Named export for POST method
export async function POST(req: Request) {
	console.log("REQUEST", req);
	try {
		// Parse the FormData from the request
		const formData = await req.formData();
		const image = formData.get("image") as File | null;

		if (!image) {
			return new Response(JSON.stringify({ error: "No image provided" }), { status: 400 });
		}

		// Convert the image to a Base64 string
		const buffer = await image.arrayBuffer();
		const base64Image = Buffer.from(buffer).toString("base64");
		const dataUri = `data:${image.type};base64,${base64Image}`;

		// Upload to Cloudinary
		const result = await cloudinary.uploader.upload(dataUri, { folder: "Home" });
		console.log("Cloudinary Result:", result);

		return new Response(JSON.stringify({ url: result.secure_url }), { status: 200 });
	} catch (error) {
		console.error("Error uploading image:", error);
		return new Response(JSON.stringify({ error: (error as Error).message }), { status: 500 });
	}
}
