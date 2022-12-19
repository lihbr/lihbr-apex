export const logErrors = <THandler extends (...args: unknown[]) => unknown>(
	handler: THandler,
): THandler => {
	return ((...args) => {
		try {
			return handler(...args);
		} catch (error) {
			console.error(error);
			throw error;
		}
	}) as THandler;
};
