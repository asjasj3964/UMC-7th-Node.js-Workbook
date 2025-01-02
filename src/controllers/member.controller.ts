import { StatusCodes } from "http-status-codes";
import { bodyToMember, bodyToUpdateMember } from "../dtos/member.dto.ts";
import { memberSignUp, memberUpdate } from "../services/member.service.ts"
import { NotExistError } from "../errors.js";
import { Response, Request, NextFunction } from 'express';

// 회원 등록 핸들러
export const handleMemberSignUp = async(req: Request, res: Response, next: NextFunction) => {
    /*
    #swagger.tags = ['member-controller']
    #swagger.summary = '회원가입 API';
    #swagger.description = '회원가입 API입니다.'
    #swagger.requestBody = {
        required: true,
        content: {
            "application/json": {
                schema: {
                    $ref: "#/components/schemas/MemberSchema"
                }
            }
        }
    };
    #swagger.responses[200] = {
        description: "회원가입 성공 응답",
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        resultType: { type: "string", example: "SUCCESS" },
                        error: { type: "object", nullable: true, example: null },
                        success: {
                            allOf: [
                                { $ref: "#/components/schemas/MemberSchema" },
                                { 
                                    type: "object",
                                    properties: {
                                        id: { type: "string", example: "1" },
                                        favoriteFoodKinds: { type: "array", items: { type: "string" } }
                                    }
                                },
                            ]
                        }    
                    }
                }
            }
        }
    };
    #swagger.responses[500] = {
        description: "회원가입 실패 응답",
        content: {
            "application/json": {
                schema: {
                    $ref: "#/components/responses/NotFoundErrorResponse"
                },
                examples: {
                    "중복된 이메일": {
                        summary: "중복된 이메일",
                        description: "이미 등록된 계정으로 가입 시도를 하였습니다.",
                        value: {
                            resultType: "FAIL",
                            error: { 
                                errorCode: "U001",
                                reason: "중복된 이메일",
                                data: {}
                            },
                            success: null 
                        },
                    },
                    "존재하지 않는 음식 종류": {
                        $ref: "#/components/examples/FoodKindNotFoundErrorExample"
                    }, 
                    "서버 내부 오류": {
                        $ref: "#/components/examples/ServerErrorExample"
                    } 
                }
            }
        }
    };
    */
    console.log("회원가입 요청");
    console.log("body: ", req.body); // 값이 잘 들어오는지 테스트
    const member = await memberSignUp(bodyToMember(req.body)); // 요청 데이터를 DTO로 변환 (member 객체 생성)
    res.status(StatusCodes.OK).success(member); // 성공 공통 응답 전달
    // HTTP 응답 반환, JSON 형식의 member 객체를 클라이언트에 전달
}   

// 회원 정보 수정 핸들러
export const handleMemberUpdate = async(req: Request, res: Response, next: NextFunction) => {
    /*
    #swagger.tags = ['member-controller']
    #swagger.summary = '회원 정보 수정 API';
    #swagger.description = '회원 정보 수정 API입니다.'
    #swagger.requestBody = {
        required: true,
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        name: { type: "string" },
                        nickname: { type: "string" },
                        gender: { type: "number" },
                        birth: { type: "string", example: "2000-04-24" },
                        location: { type: "string" },
                        phoneNumber: { type: "string", example: "010-0000-0000" },
                    }
                }
            }
        }
    };
    #swagger.responses[200] = {
        description: "회원 정보 수정 성공 응답",
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        resultType: { type: "string", example: "SUCCESS" },
                        error: { type: "object", nullable: true, example: null },
                        success: {
                            type: "object",
                            properties: {
                                name: { type: "string" },
                                nickname: { type: "string" },
                                gender: { type: "number" },
                                birth: { type: "string", example: "2000-04-24" },
                                location: { type: "string" },
                                email: { type: "string" },
                                phoneNumber: { type: "string", example: "010-0000-0000" },
                            }
                        }   
                    }
                }
            }
        }
    };
    #swagger.responses[500] = {
        description: "회원 정보 수정 실패 응답",
        content: {
            "application/json": {
                schema: {
                    $ref: "#/components/responses/NotFoundErrorResponse"
                },
                examples: {
                    "존재하지 않는 회원": {
                        $ref: "#/components/examples/MemberNotFoundErrorExample"
                    }, 
                    "서버 내부 오류": {
                        $ref: "#/components/examples/ServerErrorExample"
                    } 
                }
            }
        }
    };
    */
    if (!req.user) {
        throw new NotExistError("로그인 또는 회원가입을 해주세요.", req.body);
    }
    const memberId = req.user.id;
    const member = await memberUpdate(memberId, bodyToUpdateMember(req.body));
    res.status(StatusCodes.OK).success(member);
}