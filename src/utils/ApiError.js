class ApiError extends Error {
    constructor(
        statusCode,
        message = "something went wrong",
        errors = [],
        statck = ""
    ) {
        super(message);
        this.statusCode = statusCode;
        this.data = null; // you can add more data to the error
        this.errors = errors;

        this.message = message;
        this.success = false;

        if (statck) {
            this.stack = statck;
        }
        else {
            Error.captureStackTrace(this, this.constructor); // this will capture the stack trace
        }

    }
}


export { ApiError }