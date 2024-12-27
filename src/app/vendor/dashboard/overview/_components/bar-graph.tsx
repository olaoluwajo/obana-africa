"use client";

import React from "react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";

const data = [
	{ name: "Jan", total: Math.floor(0) + 0 },
	{ name: "Feb", total: Math.floor(0) + 0 },
	{ name: "Mar", total: Math.floor(0) + 0 },
	{ name: "Apr", total: Math.floor(0) + 0 },
	{ name: "May", total: Math.floor(0) + 0 },
	{ name: "Jun", total: Math.floor(0) + 0 },
	{ name: "Jul", total: Math.floor(0) + 0 },
	{ name: "Aug", total: Math.floor(0) + 0 },
	{ name: "Sep", total: Math.floor(0) + 0 },
	{ name: "Oct", total: Math.floor(0) + 0 },
	{ name: "Nov", total: Math.floor(0) + 0 },
	{ name: "Dec", total: Math.floor(0) + 0 },
];

export function BarGraph() {
	return (
		<ResponsiveContainer width="100%" height={300}>
			<BarChart data={data}>
				<XAxis dataKey="name" stroke="#888888" fontSize={10} tickLine={false} axisLine={true} />
				<YAxis
					stroke="#888888"
					fontSize={12}
					tickLine={true}
					axisLine={true}
					tickFormatter={(value) => `N${value}`}
				/>
				<Tooltip
					cursor={{ fill: "#f3f3f3" }}
					formatter={(value) => `N${value.toLocaleString()}`}
				/>
				<Bar dataKey="total" fill="#1B3C5F" radius={[4, 4, 0, 0]} />
			</BarChart>
		</ResponsiveContainer>
	);
}
