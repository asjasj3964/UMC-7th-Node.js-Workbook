export class DuplicateError extends Error{
    errorCode = "U001";
    constructor(reason, data){
        super(reason);
        this.reason = reason;
        this.data = data;
    }
}

export class CannotHandleError extends Error{
    errorCode = "N404"
    constructor(reason, data){
        super(reason);
        this.reason = reason;
        this.data = data;
    }
}

export class NotExistError extends Error{
    errorCode = "U400"
    constructor(reason, data){
        super(reason);
        this.reason = reason;
        this.data = data;
    }
}