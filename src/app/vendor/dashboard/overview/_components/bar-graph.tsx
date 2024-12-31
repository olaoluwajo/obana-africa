"use client";

import React from "react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, TooltipProps } from "recharts";

interface SalesOrder {
	salesorder_id: string;
	zcrm_potential_id: string;
	zcrm_potential_name: string;
	customer_name: string;
	customer_id: string;
	sales_order_date: string;
	date: string;
	item_price: number;
	item_name: string;
}

interface BarGraphProps {
	salesOrders: SalesOrder[];
}

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Custom Tooltip Component
const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
	if (active && payload && payload.length) {
		const items = payload[0].payload.items || [];
		return (
			<div style={{ backgroundColor: "#fff", padding: "10px", border: "1px solid #ccc" }}>
				<p style={{ margin: 0, fontWeight: "semi-bold" }}>{label}</p>
				{items.map((item: any, index: number) => (
					<p key={index} style={{ margin: 0, fontSize: "10px" }}>
						{item.item_name}: N{item.item_price.toLocaleString()}
					</p>
				))}
			</div>
		);
	}

	return null;
};

export function BarGraph({ salesOrders }: BarGraphProps) {
	const data = months.map((month, index) => {
		// Filter orders by month
		const filteredOrders = salesOrders.filter((order) => {
			const orderDate = new Date(order.date);
			return orderDate.getMonth() === index;
		});

		// Calculate total and include item details for the tooltip
		const monthTotal = filteredOrders.reduce((sum, order) => sum + (order.item_price || 0), 0);

		return {
			name: month,
			total: monthTotal,
			items: filteredOrders.map((order) => ({
				item_name: order.item_name,
				item_price: order.item_price,
			})),
		};
	});

	return (
		<ResponsiveContainer width="100%" height={300}>
			<BarChart data={data}>
				<XAxis dataKey="name" stroke="#888888" fontSize={10} tickLine={false} axisLine={true} />
				<YAxis
					stroke="#888888"
					fontSize={12}
					tickLine={true}
					axisLine={true}
					// tickFormatter={(value) => `N${value}`}
					tickFormatter={(value) =>
						new Intl.NumberFormat("en-NG", {
							style: "currency",
							currency: "NGN",
						}).format(value)
					}
					tickCount={5}
					domain={[0, "auto"]}
					// ticks={[0, 500, 1000, 1500, 2000]}
				/>
				<Tooltip content={<CustomTooltip />} />
				<Bar dataKey="total" fill="#1B3C5F" radius={[4, 4, 0, 0]} />
			</BarChart>
		</ResponsiveContainer>
	);
}
