type SubSubCategoryOptions = {
	[key: string]: { value: string; id: string; weight: any }[]; // Add the index signature
};

export const categoryOptions = [
	{
		value: "beauty",
		label: "Beauty Products",
		subCategories: [{ value: "Beauty", id: "4650667000010310069" }],
		// subCategories: ["Beauty"] ,
		id: "4650667000010310117",
	},
	{
		value: "fashion",
		label: "Fashion",
		subCategories: [
			{ value: "Men", id: "4650667000010310063" },
			{ value: "Women", id: "4650667000000093016" },
		],
		// 1
		id: "4650667000000093014",
	},
	{
		value: "lifestyle",
		label: "Lifestyle",
		subCategories: [
			{ value: "Electronics", id: "4650667000013210783" },
			{ value: "Headsets", id: "4650667000013210787" },
		],
		id: "4650667000002104001",
	},
];

export const subCategoryOptions = {
	beauty: [{ value: "Beauty", id: "4650667000010310117" }],
	fashion: [
		{ value: "Men", id: "4650667000010310063" },
		{ value: "Women", id: "4650667000000093016" },
	],
	lifestyle: [
		{ value: "Electronics", id: "4650667000013210783" },
		{ value: "Headsets", id: "4650667000013210787" },
	],
};

// export const subSubCategoryOptions: SubSubCategoryOptions = {
// 	Beauty: [{ value: "Beauty", id: "4650667000010310117" }],
// 	Electronics: [],
// 	Headsets: [],
// 	Men: [
// 		{ value: "T-shirts", id: "4650667000012637679" },
// 		{ value: "Shorts", id: "4650667000010310091" },
// 		{ value: "Assesories", id: "4650667000000093018" },
// 		{ value: "Sneakers", id: "4650667000012605017" },
// 		{ value: "Trousers", id: "4650667000013523057" },
// 		{ value: "Polo", id: "4650667000012637747" },
// 		{ value: "Shirts", id: "4650667000010310055" },
// 		{ value: "Hoodies", id: "4650667000013523147" },
// 		{ value: "Jackets", id: "4650667000013523117" },
// 		{ value: "Smart Pants", id: "4650667000013523033" },
// 		{ value: "Sweatshirts", id: "4650667000012637651" },
// 	],
// 	Women: [
// 		{ value: "Dresses", id: "4650667000012163053" },
// 		{ value: "Shirts", id: "4650667000012605033" },
// 		{ value: "Assesories", id: "4650667000000862086" },
// 	],
// };
export const subSubCategoryOptions: SubSubCategoryOptions = {
	Beauty: [{ value: "Beauty", id: "4650667000010310117", weight: 0.3 }],
	Electronics: [{ value: "Electronics", id: "4650667000013210783", weight: 1.5 }],
	Headsets: [{ value: "Headsets", id: "4650667000013210787", weight: 0.4 }],
	Men: [
		{ value: "T-shirts", id: "4650667000012637679", weight: 0.4 },
		{ value: "Shorts", id: "4650667000010310091", weight: 0.5 },
		{ value: "Accessories", id: "4650667000000093018", weight: 0.3 },
		{ value: "Sneakers", id: "4650667000012605017", weight: 1.2 },
		{ value: "Trousers", id: "4650667000013523057", weight: 0.7 },
		{ value: "Polo", id: "4650667000012637747", weight: 0.4 },
		{ value: "Shirts", id: "4650667000010310055", weight: 0.5 },
		{ value: "Hoodies", id: "4650667000013523147", weight: 1.0 },
		{ value: "Jackets", id: "4650667000013523117", weight: 1.5 },
		{ value: "Smart Pants", id: "4650667000013523033", weight: 0.6 },
		{ value: "Sweatshirts", id: "4650667000012637651", weight: 0.8 },
	],
	Women: [
		{ value: "Dresses", id: "4650667000012163053", weight: 0.7 },
		{ value: "Shirts", id: "4650667000012605033", weight: 0.5 },
		{ value: "Accessories", id: "4650667000000862086", weight: 0.2 },
	],
};
