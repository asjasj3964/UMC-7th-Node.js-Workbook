import { MemberModel } from "../src/models/member.ts";

declare global {
    namespace Express {
        export interface User extends MemberModel {}

        export interface Response {
            success(success: any): this;
            error(error: {
                errorCode?: string;
                reason?: string | null;
                data?: any | null;
            }): this;
        }
        export interface Request {
            files?: Express.Multer.File[]; // Multer에서 사용하는 파일 타입
        }
    }
}