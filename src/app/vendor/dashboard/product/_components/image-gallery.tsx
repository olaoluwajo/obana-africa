// components/ImageGallery.tsx
"use client";

import React, { useEffect } from "react";
import PhotoSwipeLightbox from "photoswipe/lightbox";
import "photoswipe/style.css";

type ImageGalleryProps = {
	galleryID: string;
	images: {
		largeURL: string;
		thumbnailURL: string;
		width: number;
		height: number;
	}[];
};

export default function ImageGallery({ galleryID, images }: ImageGalleryProps) {
	useEffect(() => {
		const lightbox = new PhotoSwipeLightbox({
			gallery: `#${galleryID}`,
			children: "a",
			pswpModule: () => import("photoswipe"),
		});
		lightbox.init();

		return () => {
			lightbox.destroy();
		};
	}, [galleryID]);

	return (
		<div
			className="pswp-gallery grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4"
			id={galleryID}>
			{images.map((image, index) => (
				<a
					href={image.largeURL}
					data-pswp-width={image.width}
					data-pswp-height={image.height}
					key={`${galleryID}-${index}`}
					target="_blank"
					rel="noreferrer">
					<img
						src={image.thumbnailURL}
						alt={`Image ${index + 1}`}
						className="w-full h-[200px] object-contain rounded-md shadow-md hover:shadow-lg transition hover:scale-105 duration-700 "
					/>
				</a>
			))}
		</div>
	);
}
