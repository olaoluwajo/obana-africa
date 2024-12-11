'use client'
import { useState } from "react";
import axios from "axios";

function UploadImage({ itemId }: { itemId: string }) {
	const [file, setFile] = useState(null);
	const [uploadStatus, setUploadStatus] = useState("");

	const handleFileChange = (event: any) => {
		const selectedFile = event.target.files[0];
		if (selectedFile) {
			setFile(selectedFile);
		}
	};

	const handleUpload = async () => {
		if (!file) {
			alert("Please select a file to upload.");
			return;
		}

		const formData = new FormData();
		formData.append("file", file);
		formData.append("itemId", itemId);

		try {
			setUploadStatus("Uploading...");
			const response = await axios.post("/api/uploadImage", formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});

			if (response.data.success) {
				setUploadStatus("Upload successful!");
			} else {
				setUploadStatus("Upload failed.");
			}
		} catch (error) {
			setUploadStatus("Error uploading image.");
			console.error(error);
		}
	};

	return (
		<div>
			<input type="file" onChange={handleFileChange} />
			<button onClick={handleUpload}>Upload Image</button>
			{uploadStatus && <p>{uploadStatus}</p>}
		</div>
	);
}

export default UploadImage;
