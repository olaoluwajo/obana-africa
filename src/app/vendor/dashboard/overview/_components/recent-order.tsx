import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const getStatusVariant = (status: string) => {
	switch (status) {
		case "confirmed":
			return "active";
		case "fulfilled":
			return "success";
		case "failed":
			return "destructive";
		case "pending":
			return "warning";
		default:
			return "default";
	}
};

const RecentOrders = ({ salesOrders }: { salesOrders: any }) => {
	return (
		<Table>
			<TableCaption>A list of orders available</TableCaption>
			<TableHeader>
				<TableRow>
					<TableHead>Product name</TableHead>
					<TableHead>Status</TableHead>
					<TableHead>Quantity</TableHead>
					<TableHead className="text-right">Price</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{salesOrders.map((order: any) => (
					<TableRow key={order.salesorder_id} className="text-xs">
						<TableCell className="font-medium">{order.item_name}</TableCell>
						<TableCell>
							{/* <Badge variant={order.status ? "active" : "destructive"}>
								{order.status ? "Enabled" : "Disabled"}
							</Badge> */}
							<Badge variant={getStatusVariant(order.status)}>
								{order.status
									? order.status.charAt(0).toUpperCase() + order.status.slice(1)
									: "Unknown"}
							</Badge>
						</TableCell>
						<TableCell>{order.quantity}</TableCell>
						<TableCell className="text-right">
							{/* {order.item_price} */}
							{new Intl.NumberFormat("en-NG", {
								style: "currency",
								currency: "NGN",
							}).format(order.item_price)}
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
};

export default RecentOrders;
