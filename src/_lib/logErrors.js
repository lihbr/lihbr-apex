const logErrors = (handler) => {
	return (...args) => {
		try {
			return handler(...args);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};
};

module.exports = logErrors;
