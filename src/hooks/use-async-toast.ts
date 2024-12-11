// import { useState } from "react";
// import { toast } from "sonner";

// export function useAsyncToast() {
// 	const [isLoading, setIsLoading] = useState(false);

// 	const executeAsyncToast = async (asyncFn: () => Promise<any>, messages: any) => {
// 		setIsLoading(true);
// 		try {
// 			const result = await asyncFn();

// 			toast.promise(Promise.resolve(result), messages);

// 			return result;
// 		} catch (error) {
// 			toast.promise(Promise.reject(error), messages);
// 			throw error;
// 		} finally {
// 			setIsLoading(false);
// 		}
// 	};

// 	return { isLoading, executeAsyncToast };
// }
