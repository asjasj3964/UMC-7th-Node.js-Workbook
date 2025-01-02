import { StatusCodes } from "http-status-codes";
import { bodyToFavoriteFoodKind } from "../dtos/favorite-foodkind.dto.ts";
import { favoriteFoodKindUpdate } from '../services/favorite-foodkind.service.ts'
import { Response, Request, NextFunction } from 'express';
import { NotExistError } from "../errors.ts";

export const handleFavoriteFoodKindUpdate = async(req: Request, res: Response, next: NextFunction) => {
    /*
    #swagger.tags = ['favorite-foodkind-controller']
    #swagger.summary = '선호 음식 종류 수정 API';
    #swagger.description = '선호 음식 종류 수정 API입니다.'
    #swagger.requestBody = {
        required: true,
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        favoriteFoodKinds: { type: "array", items: { type: "number" } }                                
                    }
                }
            }
        }
    };
    #swagger.responses[200] = {
        description: "선호 음식 종류 수정 성공 응답",
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
                                favoriteFoodKinds: { type: "array", items: { type: "string" } }                                
                            }
                        }    
                    }
                }
            }
        }
    };
    #swagger.responses[500] = {
        description: "선호 음식 종류 수정 실패 응답",
        content: {
            "application/json": {
                schema: {
                    $ref: "#/components/responses/NotFoundErrorResponse"
                },
                examples: {
                    "존재하지 않는 회원": {
                        $ref: "#/components/examples/MemberNotFoundErrorExample"
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
    if (!req.user) {
        throw new NotExistError("로그인 또는 회원가입을 해주세요.", req.body);
    }
    const memberId = req.user.id;
    const foodKind = await favoriteFoodKindUpdate(memberId, bodyToFavoriteFoodKind(req.body));
    res.status(StatusCodes.OK).success(foodKind);
}