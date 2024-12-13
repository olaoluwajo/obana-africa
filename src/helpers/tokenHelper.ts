export function setTokenInLocalStorage(token: string, issuedAt: number) {
	localStorage.setItem("accessToken", token);
	localStorage.setItem("tokenIssuedAt", issuedAt.toString());
}

export function getTokenFromLocalStorage() {
	const token = localStorage.getItem("accessToken");
	const issuedAt = localStorage.getItem("tokenIssuedAt");
	return {
		token,
		issuedAt: issuedAt ? parseInt(issuedAt, 10) : null,
	};
}
