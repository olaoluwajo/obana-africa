// import { v2 as cloudinary } from "cloudinary";
// import multer, { File } from "multer";
// import { NextApiRequest, NextApiResponse } from "next";
// import nc from "next-connect";

// // Set up Cloudinary configuration
// cloudinary.config({
// 	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
// 	api_key: process.env.CLOUDINARY_API_KEY,
// 	api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// const upload = multer();

// // Create a Next.js API route handler with next-connect
// const handler = nc<NextApiRequest, NextApiResponse>();

// // Middleware for handling file upload
// handler.use(upload.single("image"));

// // API POST request handler
// handler.post((req: any, res: any) => {
// 	// Type assertion: `req.file` is typed as `File | undefined`, so ensure it's not undefined
// 	const file = req.file as File;

// 	if (!file) {
// 		return res.status(400).json({ message: "No file uploaded." });
// 	}

// 	// Upload the image to Cloudinary
// 	cloudinary.v2.uploader
// 		.upload_stream(
// 			{ resource_type: "auto" }, // Automatically detect file type (e.g., image, video)
// 			(error: any, result: any) => {
// 				if (error) {
// 					return res.status(500).json({ message: "Error uploading image", error });
// 				}
// 				return res.status(200).json({ url: result?.secure_url });
// 			},
// 		)
// 		.end(file.buffer); // Multer buffer from the uploaded file
// });

// export default handler;
