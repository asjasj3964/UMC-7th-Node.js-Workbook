import { StatusCodes } from "http-status-codes";
import { bodyToMission } from "../dtos/mission.dto.js";
import { missionRegist } from "../services/mission.service.js";

// 미션 등록 핸들러
export const handleMissionRegist = async(req, res, next) => {
    /*
    #swagger.tags = ['mission-controller']
    #swagger.summary = '미션 등록 API';
    #swagger.description = '미션 등록 API입니다.'
    #swagger.requestBody = {
        required: true,
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        restaurantId: { type: "number" },
                        name: { type: "string" },
                        introduction: { type: "string" },
                        deadline: { type: "string", format: "date-time", example: "2025-02-01T00:00:00Z" },
                        points: { type: "number", example: 100 },
                        status: { type: "number", example: 0 }
                    }
                }
            }
        }
    };
    #swagger.responses[200] = {
        description: "미션 등록 성공 응답",
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
                                id: { type: "string", example: "1" },
                                restaurant: { type: "string" },
                                name: { type: "string" },
                                introduction: { type: "string" },
                                deadline: { type: "string", format: "date-time", example: "2025-02-01T00:00:00Z" },
                                points: { type: "string", example: "100" },
                                status: { type: "number", example: 0 }
                            }
                        }    
                    }
                }
            }
        }
    };
    #swagger.responses[500] = {
        description: "미션 등록 실패 응답",
        content: {
            "application/json": {
                schema: {
                    $ref: "#/components/responses/NotFoundErrorResponse"
                },
                examples: {
                    "잘못된 마감기한 설정": {
                        summary: "잘못된 마감기한 설정",
                        description: "미션의 마감기한을 과거로 설정하였습니다.",
                        value: {
                            resultType: "FAIL",
                            error: { 
                                errorCode: "U403",
                                reason: "마감기한을 과거로 설정하였음",
                                data: {}
                            },
                            success: null 
                        },
                    },
                    "존재하지 않는 식당": {
                        $ref: "#/components/examples/RestaurantNotFoundErrorExample"
                    }, 
                    "중복된 미션": {
                        summary: "중복된 미션",
                        description: "이미 동일한 식당, 미션명, 미션 설명, 마감기한의 미션이 존재합니다.",
                        value: {
                            resultType: "FAIL",
                            error: { 
                                errorCode: "U001",
                                reason: "중복된 미션",
                                data: {}
                            },
                            success: null 
                        },
                    }, 
                    "서버 내부 오류": {
                        $ref: "#/components/examples/ServerErrorExample"
                    } 
                }
            }
        }
    };
    */
    console.log("미션 등록");
    console.log("body: ", req.body);
    const mission = await missionRegist(bodyToMission(req.body));
    res.status(StatusCodes.OK).success(mission);
}