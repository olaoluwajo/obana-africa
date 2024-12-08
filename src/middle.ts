// import { NextResponse } from "next/server";
// import { jwtVerify } from "jose";

// const JWT_SECRET = process.env.JWT_SECRET_KEY;

// interface JwtPayload {
// 	role: string;
// 	[key: string]: any;
// }

// // Middleware function
// export async function middleware(req: any) {
// 	console.log("Middleware called");

// 	let token = req.cookies.get("otpToken")?.value;

// 	if (!token) {
// 		const authHeader = req.headers.get("authorization");
// 		if (authHeader?.startsWith("Bearer ")) {
// 			token = authHeader.substring(7);
// 		}
// 	}

// 	console.log("Received token:", token);

// 	if (!token || typeof token !== "string") {
// 		console.error("Token is missing or not a string");

// 		if (req.url.startsWith("/sign-in")) {
// 			return NextResponse.next();
// 		}

// 		return NextResponse.redirect(new URL("/sign-in", req.url));
// 	}

// 	try {
// 		// Using jose to verify the JWT
// 		const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
// 		console.log("DECODED", payload);
// 		console.log("Request URL:", req.url);

// 		req.user = payload;
// 		console.log("Decoded Payload:", req.user);

// 		if (req.url.startsWith("/sign-in")) {
// 			return NextResponse.redirect(new URL("/vendor/dashboard", req.url));
// 		}

// 		if (req.url.startsWith("/vendor/dashboard")) {
// 			return NextResponse.rewrite(new URL("/vendor/dashboard/overview", req.url));
// 		}

// 		if (payload.role !== "admin" && req.url.startsWith("/admin")) {
// 			console.log("Access denied for non-admin role on /admin route");
// 			return NextResponse.redirect(new URL("/unauthorized", req.url));
// 		}

// 		if (payload.role !== "vendor" && req.url.startsWith("/vendor")) {
// 			console.log("Access denied for non-vendor role on /vendor route");
// 			return NextResponse.redirect(new URL("/unauthorized", req.url));
// 		}

// 		return NextResponse.next();
// 	} catch (err) {
// 		console.error("Error verifying JWT:", err);
// 		return NextResponse.redirect(new URL("/sign-in", req.url));
// 	}
// }

// export const config = {
// 	matcher: ["/admin/:path*", "/vendor/:path*"],
// };
