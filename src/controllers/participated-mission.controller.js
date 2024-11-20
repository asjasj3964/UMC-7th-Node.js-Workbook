import { StatusCodes } from "http-status-codes";
import { bodyToMemberMission } from "../dtos/participated-mission.dto.js";
import { memberMissionRegist, memberMissionUpdateCompleted } from "../services/participated-mission.service.js";

// 참여 미션 등록 핸들러
export const handleMemberMissionRegist = async(req, res, next) => {
    /*
    #swagger.tags = ['participated-mission-controller']
    #swagger.summary = '참여 미션 등록 API';
    #swagger.description = '참여 미션 등록 API입니다.'
    #swagger.requestBody = {
        required: true,
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        memberId: { type: "number" },
                        missionId: { type: "number" }
                    }
                }
            }
        }
    };
    #swagger.responses[200] = {
        description: "참여 미션 등록 성공 응답",
        content: {
            "application/json": {
                schema: {
                    $ref: "#/components/schemas/MissionSuccessResponse"
                }
            }
        }
    };
    #swagger.responses[400] = {
        description: "참여 미션 등록 실패 응답",
        content: {
            "application/json": {
                schema: {
                    $ref: "#/components/schemas/ErrorResponse"
                }
            }
        }
    };
    */
    console.log("특정 회원에게 미션 할당");
    console.log("body: ", req.body); // 값이 잘 들어오는지 테스트
    const memberMission = await memberMissionRegist(bodyToMemberMission(req.body)); // 요청 데이터를 DTO로 변환 (member 객체 생성)
    res.status(StatusCodes.OK).success(memberMission); // 성공 공통 응답 전달
}


// 특정 회원의 특정 미션 상태 업데이트(진행 중 -> 진행 완료) 핸들러
export const handleMissionUpdateCompleted = async(req, res, next) => {
    /* 
    #swagger.tags = ['participated-mission-controller']
    #swagger.summary = '미션 상태 업데이트 API';
    #swagger.description = '미션 상태 업데이트 API입니다.';
    #swagger.responses[200] = {
        description: "미션 상태 업데이트 성공 응답",
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        resultType: { type: "string", example: "SUCCESS" },
                        error: { type: "object", nullable: true, example: null },
                        success: {
                            allOf: [
                                { $ref: "#/components/schemas/MissionSuccessResponse/properties/success" },
                                {
                                    type: "object", 
                                    properties: {
                                        status: { type: "number", example: 1 }
                                    }   
                                }
                            ]
                        }    
                    }
                }
            }
        }
    };
    #swagger.responses[400] = {
        description: "미션 상태 업데이트 실패 응답",
        content: {
            "application/json": {
                schema: {
                    $ref: "#/components/schemas/ErrorResponse"
                }
            }
        }
    };
    */
    const missions = await memberMissionUpdateCompleted(
        parseInt(req.params.participatedMissionId),
    )
    res.status(StatusCodes.OK).success(missions);
}
