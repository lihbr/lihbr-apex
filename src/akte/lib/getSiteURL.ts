/**
 * Resolve Netlify deploy URL
 * @param branchDomains - branches having their own domains
 * @return - final deploy URL
 */
export const getSiteDeployURL = ({
	branchDomains = [],
}: {
	branchDomains: string[];
}): string | null => {
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

		// Everything else gets prime URL
		default:
			return process.env.DEPLOY_PRIME_URL;
	}
};

export const getSiteURL = (): string => {
	const maybeDeployURL = getSiteDeployURL({
		branchDomains: ["staging"],
	});

	if (maybeDeployURL) {
		return maybeDeployURL;
	}

	if (process.env.APP_URL) {
		return process.env.APP_URL;
	}

	throw new Error("Could not resolve site URL");
};
