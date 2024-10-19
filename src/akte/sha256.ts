export async function sha256(input: string, salt: string, truncate?: number): Promise<string> {
	const encoder = new TextEncoder()
	const data = encoder.encode(input + salt)

	const hashBuffer = await crypto.subtle.digest("SHA-256", data)
	const hashArray = Array.from(new Uint8Array(hashBuffer))

	const hashHex = hashArray.map((byte) => byte.toString(16).padStart(2, "0")).join("")

	return truncate ? hashHex.slice(0, truncate) : hashHex
}
