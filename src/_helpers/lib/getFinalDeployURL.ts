/**
 * Resolve Netlify final deploy URL
 * @param branchDomains - branches having their own domains
 * @return - final deploy URL
 */
export const getFinalDeployURL = ({
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
