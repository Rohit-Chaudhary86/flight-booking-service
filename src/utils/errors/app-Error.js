class appError extends Error{
    constructor(message,statusCode){
        super(message);
        this.statusCode=statusCode;
        this.explanation=message;
    }
}

module.exports=appError;