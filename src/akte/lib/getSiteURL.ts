import process from "node:process";

/**
 * Resolve Netlify deploy URL
 * @param config - configuration object
 * @param config.branchDomains - branches having their own domains
 * @return - final deploy URL
 */
export function getSiteDeployURL({
	branchDomains = [],
}: {
	branchDomains: string[];
}): string | null {
	if (
		!process.env.URL ||
		!process.env.BRANCH ||
		!process.env.DEPLOY_PRIME_URL
	) {
		return null;
	}

	switch (process.env.CONTEXT) {
		// Production gets production URL
		case "production":
			return process.env.URL;

		// Branch deploys having dedicated domains get their dedicated domains
		case "branch-deploy":
			if (branchDomains.includes(process.env.BRANCH)) {
				return process.env.URL.replace(
					/^(https?:\/\/)/,
					`$1${process.env.BRANCH.toLowerCase()}.`,
				);
			}
			return process.env.DEPLOY_PRIME_URL;

		// Everything else gets prime URL
		default:
			return process.env.DEPLOY_PRIME_URL;
	}
}

export function getSiteURL(): string {
	const maybeDeployURL = getSiteDeployURL({
		branchDomains: ["staging"],
	});

	if (maybeDeployURL) {
		return maybeDeployURL;
	}

	if (process.env.APP_URL) {
		return process.env.APP_URL;
	}

	// Preview edge case
	if (process.env.AWS_LAMBDA_FUNCTION_NAME && process.env.URL) {
		return process.env.URL;
	}

	throw new Error("Could not resolve site URL");
}
