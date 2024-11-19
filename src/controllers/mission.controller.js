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
    #swagger.responses[400] = {
        description: "미션 등록 실패 응답",
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        resultType: { type: "string", example: "FAIL" },
                        error: { 
                            type: "object",
                            properties: {
                                errorCode: { type: "string", example: "U001" },
                                reason: { type: "string" },
                                data: { type: "object" }
                            } 
                        },
                        success: { type: "object", nullable: true, example: null }    
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