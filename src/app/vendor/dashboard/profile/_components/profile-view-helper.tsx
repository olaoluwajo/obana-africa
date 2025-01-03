import React from "react";
import { format } from "date-fns";
import {
	User,
	Building,
	Mail,
	Phone,
	MapPin,
	Globe,
	CreditCard,
	Clock,
	CheckCircle,
	XCircle,
	Briefcase,
	Users,
	MessageCircleQuestion,
	CircleDollarSign,
	Store,
	Facebook,
	Twitter,
	Link,
	PenSquare,
} from "lucide-react";
import { FaXTwitter } from "react-icons/fa6";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import * as Tooltip from "@radix-ui/react-tooltip";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const formatDateTime = (dateString: string) => {
	const date = new Date(dateString);
	return {
		date: format(date, "dd MMM yyyy"),
		time: format(date, "HH:mm"),
	};
};

interface DetailItemProps {
	icon: React.ReactElement;
	label: string;
	value: string | number;
	tooltipContent?: string;
}

const DetailItem: React.FC<DetailItemProps> = ({ icon, label, value, tooltipContent }) => (
	<div className="bg-gray-50 p-3 rounded-lg">
		<div className="flex items-center mb-1">
			{icon && React.cloneElement(React.Children.only(icon), { size: 16 })}
			<span className="ml-2 font-medium text-gray-600">{label}</span>
			{tooltipContent && (
				<Tooltip.Root>
					<Tooltip.Trigger>
						<MessageCircleQuestion size={12} className="text-black/40 ml-2" />
					</Tooltip.Trigger>
					<Tooltip.Content
						side="top"
						sideOffset={2}
						className="bg-black/80 text-white px-2 py-1 rounded-md text-xs max-w-[200px]">
						{tooltipContent}
						<Tooltip.Arrow className="fill-black/80" />
					</Tooltip.Content>
				</Tooltip.Root>
			)}
		</div>
		<p className={`font-semibold text-gray-800 ${typeof value === "number" ? "text-right" : ""}`}>
			{value || "Not provided"}
		</p>
	</div>
);

const AddressCard = ({ title, address }: { title: string; address: any }) => (
	<div className="bg-gray-50 p-4 rounded-lg">
		<div className="flex items-center mb-3">
			<MapPin className="text-gray-500" size={16} />
			<h3 className="font-semibold text-gray-700 ml-2">{title}</h3>
		</div>
		<div className="space-y-2 pl-6">
			<p className="text-gray-700 font-medium">{address.attention}</p>
			<div className="text-gray-600">
				<p>{address.address}</p>
				{address.street2 && <p>{address.street2}</p>}
				<p>{`${address.city}, ${address.state} ${address.zip || ""}`}</p>
				<p>{address.country}</p>
			</div>
			<div className="flex items-center mt-2 text-gray-600">
				<Phone size={14} className="mr-2" />
				<span>{address.phone}</span>
			</div>
		</div>
	</div>
);

const VendorProfileView = ({ vendorDetails }: any) => {
	const router = useRouter();
	const createdTime = formatDateTime(vendorDetails.created_time);
	const modifiedTime = formatDateTime(vendorDetails.last_modified_time);

	const handleEditClick = () => {
		router.push("/vendor/dashboard/profile/edit");
	};

	return (
		<div className="container mx-auto px-4 py-8">
			{/* Enhanced Header Section */}
			<div className="bg-white rounded-lg shadow-md p-8 mb-8">
				<div className="flex flex-col md:flex-row items-start gap-8">
					<div className="relative">
						<img
							src={vendorDetails.contact_persons[0]?.photo_url || "/api/placeholder/120/120"}
							alt={vendorDetails.company_name}
							className="w-40 h-40 rounded-xl object-cover shadow-lg"
						/>
						<div
							className={`absolute -top-3 -right-3 px-4 py-2 rounded-lg ${
								vendorDetails.status === "active"
									? "bg-green-100 text-green-800"
									: "bg-red-100 text-red-800"
							}`}>
							<div className="flex items-center">
								{vendorDetails.status === "active" ? (
									<CheckCircle size={16} />
								) : (
									<XCircle size={16} />
								)}
								<span className="ml-2 font-medium text-sm">
									{vendorDetails.status.toUpperCase()}
								</span>
							</div>
						</div>
						<div className="flex items-center gap-4 mt-4">
							{vendorDetails.facebook && (
								<a
									href={vendorDetails.facebook}
									className="text-blue-600 hover:text-blue-800 transition-all duration-300 transform hover:scale-110"
									target="_blank"
									rel="noopener noreferrer">
									<Facebook className="size-6" />
								</a>
							)}
							{vendorDetails.twitter && (
								<a
									href={vendorDetails.twitter}
									className="text-black hover:text-gray-700 transition-all duration-300 transform hover:scale-110"
									target="_blank"
									rel="noopener noreferrer">
									<FaXTwitter className="size-6" />
								</a>
							)}
						</div>
					</div>

					<div className="flex-1 space-y-4">
						<div>
							<h1 className="text-3xl font-bold text-gray-900">
								{vendorDetails.company_name}
							</h1>
							<p className="text-lg text-gray-600 mt-1">
								ID: {vendorDetails.contact_number}
							</p>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
							<div className="flex items-center text-gray-600">
								<Mail className="w-5 h-5 mr-2" />
								<span>{vendorDetails.email}</span>
							</div>
							<div className="flex items-center text-gray-600">
								<Phone className="w-5 h-5 mr-2" />
								<span>{vendorDetails.phone}</span>
							</div>
							<div className="flex items-center text-gray-600">
								<Link className="w-5 h-5 mr-2" />
								<span>{vendorDetails.website || "No website provided"}</span>
							</div>
						</div>
					</div>
				</div>

				<div className="mt-6 flex justify-end">
					<Button
						onClick={handleEditClick}
						className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2">
						<PenSquare size={16} />
						Edit Your Details
					</Button>
				</div>
			</div>

			<div className="grid md:grid-cols-2 gap-8">
				{/* Primary Contact Information */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center">
							<User className="mr-2 text-blue-600" size={20} />
							Primary Contact Information
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="grid grid-cols-2 gap-4">
							<DetailItem
								icon={<User className="text-purple-600" />}
								label="First Name"
								value={vendorDetails.first_name}
							/>
							<DetailItem
								icon={<User className="text-purple-600" />}
								label="Last Name"
								value={vendorDetails.last_name}
							/>
							<DetailItem
								icon={<Building className="text-purple-600" />}
								label="Company Name"
								value={vendorDetails.company_name}
							/>
							<DetailItem
								icon={<Mail className="text-blue-600" />}
								label="Email"
								value={vendorDetails.email}
							/>
							<DetailItem
								icon={<Phone className="text-green-600" />}
								label="Phone"
								value={vendorDetails.phone}
							/>
							<DetailItem
								icon={<Phone className="text-indigo-600" />}
								label="Mobile"
								value={vendorDetails.mobile}
							/>
						</div>
					</CardContent>
				</Card>

				{/* Financial Information */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center">
							<CircleDollarSign className="mr-2 text-green-600" size={20} />
							Financial Information
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="grid grid-cols-2 gap-4">
							<DetailItem
								icon={<CreditCard className="text-blue-600" />}
								label="Outstanding Payable"
								value={new Intl.NumberFormat("en-NG", {
									style: "currency",
									currency: "NGN",
								}).format(vendorDetails.outstanding_payable_amount)}
							/>
							<DetailItem
								icon={<CreditCard className="text-green-600" />}
								label="Unused Credits"
								value={new Intl.NumberFormat("en-NG", {
									style: "currency",
									currency: "NGN",
								}).format(vendorDetails.unused_credits_payable_amount)}
							/>
							<DetailItem
								icon={<Clock className="text-orange-600" />}
								label="Payment Terms"
								value={vendorDetails.payment_terms_label}
							/>
							<DetailItem
								icon={<Globe className="text-purple-600" />}
								label="Currency"
								value={vendorDetails.currency_code}
							/>
						</div>
					</CardContent>
				</Card>

				{/* Address Information */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center">
							<MapPin className="mr-2 text-red-600" size={20} />
							Address Information
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-6">
						<AddressCard title="Billing Address" address={vendorDetails.billing_address} />
						<AddressCard title="Shipping Address" address={vendorDetails.shipping_address} />
					</CardContent>
				</Card>

				{/* Additional Information */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center">
							<Store className="mr-2 text-violet-600" size={20} />
							Additional Information
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="grid grid-cols-2 gap-4">
							<DetailItem
								icon={<Briefcase className="text-blue-600" />}
								label="Contact Type"
								value={vendorDetails.contact_type.toUpperCase()}
							/>
							<DetailItem
								icon={<Users className="text-green-600" />}
								label="Customer Type"
								value={vendorDetails.customer_sub_type.toUpperCase()}
							/>
							<DetailItem
								icon={<Clock className="text-amber-600" />}
								label="Created"
								value={`${createdTime.date} at ${createdTime.time}`}
							/>
							<DetailItem
								icon={<Clock className="text-purple-600" />}
								label="Last Modified"
								value={`${modifiedTime.date} at ${modifiedTime.time}`}
							/>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
};

export default VendorProfileView;
