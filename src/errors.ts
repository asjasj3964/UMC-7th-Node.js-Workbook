// 중복 데이터 에러 처리
export class DuplicateError extends Error{
    errorCode = "U001"; // 인증 문제 또는 잘못된 사용자 요청 (권한 부족)
    reason: string;
    data: string;
    constructor(reason: string, data: any){
        super(reason);
        this.reason = reason;
        this.data = data;
    }
}

// 처리할 데이터의 특정 조건이 만족되지 않을 경우 에러 처리
export class CannotHandleError extends Error{
    errorCode = "U403" // Forbidden, 클라이언트가 요청한 작업을 수행할 수 없을 때
    reason: string;
    data: any;
    constructor(reason: string, data: any){
        super(reason);
        this.reason = reason;
        this.data = data;
    }
}

// 조회할 수 없는(정의되지 않은) 데이터 에러 처리
export class NotExistError extends Error{
    errorCode = "U404" // 404 Not Found, 해당 리소스를 찾을 수 없음
    reason: string;
    data: any;
    constructor(reason: string, data: any){
        super(reason);
        this.reason = reason;
        this.data = data;
    }
}

// 서버 내부의 에러 처리
export class ServerError extends Error{
    errorCode = "U500" // Internal Server Error, 서버 내부에서 예상치 못한 오류 발생 // 사용자 정의????
    reason: string;
    constructor(reason: string){
        super(reason);
        this.reason = reason;
    }
}

export class BaseError extends Error {
    status: number;

    constructor(message: string, status: number) {
        super(message);
        this.status = status;
        Object.setPrototypeOf(this, BaseError.prototype);
    }
}