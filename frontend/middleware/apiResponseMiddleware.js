const apiResponseMiddleware = (store) => (next) => (action) => {
    const { payload, meta } = action;
    if (action.type.endsWith("/fulfilled")) {
        const statusCode = meta?.baseQueryMeta?.response?.status;
        const transformedAction = {
            ...action,
            payload: {
                status: statusCode,
                message: payload?.message,
                errors: payload?.errors,
                data: payload?.data,
            },
        };
        return next(transformedAction);
    }
	if (action.type.endsWith("/rejected")) {
		const isFetchError =
			payload?.status === "FETCH_ERROR";

		if (isFetchError) {
			console.log("Transforming FETCH_ERROR");
			const transformedAction = {
				...action,
				payload: {
					status: 500,
					message: "Error de conexión.",
					errors: null,
                    data: null,
				},
			};
			return next(transformedAction);
		}
		const transformedAction = {
			...action,
			payload: {
				status: payload?.status || 500,
				message: payload?.data?.message || "Ocurrió un error inesperado.",
				errors: payload?.data?.errors || null,
                data: payload?.data?.data || null,
			},
		};
		return next(transformedAction);
	}

	return next(action);
};

export default apiResponseMiddleware;
