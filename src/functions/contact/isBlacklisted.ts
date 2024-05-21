import blacklist from "./blacklist.json"

export function isBlacklisted(mail: string): boolean {
	if (mail in blacklist.mail) {
		return true
	}

	const [_user, host] = mail.split("@")
	if (host in blacklist.host) {
		return true
	}

	return false
}
