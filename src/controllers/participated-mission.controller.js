import { StatusCodes } from "http-status-codes";
import { bodyToMemberMission } from "../dtos/participated-mission.dto.js";
import { memberMissionRegist, memberMissionUpdateCompleted, listMemberMissions } from "../services/participated-mission.service.js";
import { NotExistError } from "../errors.js";

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
                    $ref: "#/components/responses/MissionSuccessResponse"
                }
            }
        }
    };
    #swagger.responses[500] = {
        description: "참여 미션 등록 실패 응답",
        content: {
            "application/json": {
                schema: {
                    $ref: "#/components/responses/NotFoundErrorResponse"
                },
                examples: {
                    "존재하지 않는 미션": {
                        summary: "존재하지 않는 미션",
                        description: "등록되어 있지 않은 미션 ID로 조회하였습니다.",
                        value: {
                            resultType: "FAIL",
                            error: { 
                                errorCode: "U404",
                                reason: "존재하지 않는 미션",
                                data: {}
                            },
                            success: null 
                        },
                    },
                    "존재하지 않는 회원": {
                        $ref: "#/components/examples/MemberNotFoundErrorExample"
                    }, 
                    "이미 종료된 미션": {
                        $ref: "#/components/examples/DeadlineErrorExample"
                    }, 
                    "이미 참여한 미션": {
                        summary: "이미 참여한 미션",
                        description: "이미 참여 미션으로 등록한 미션입니다.",
                        value: {
                            resultType: "FAIL",
                            error: { 
                                errorCode: "U001",
                                reason: "이미 참여한 미션",
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
    console.log("특정 회원에게 미션 할당");
    console.log("body: ", req.body); // 값이 잘 들어오는지 테스트
    if (!req.user) {
        throw new NotExistError("로그인 또는 회원가입을 해주세요.", req.body);
    }
    const memberId = req.user.id;
    const memberMission = await memberMissionRegist(memberId, bodyToMemberMission(req.body)); // 요청 데이터를 DTO로 변환 (member 객체 생성)
    res.status(StatusCodes.OK).success(memberMission); // 성공 공통 응답 전달
}

// 특정 진행 중인 미션 상태 업데이트(진행 중 -> 진행 완료) 핸들러
export const handleMissionUpdateCompleted = async(req, res, next) => {
    /* 
    #swagger.tags = ['participated-mission-controller']
    #swagger.summary = '미션 상태 업데이트 API';
    #swagger.description = '미션 상태 업데이트 API입니다.';
    #swagger.parameters['participatedMissionId'] = {
        in: 'path',
        required: true,
        description: "참여한 미션의 ID 입력",
        '@schema': {
            type: "integer",
            format: "int64"
        }
    };
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
                                { $ref: "#/components/responses/MissionSuccessResponse/properties/success" },
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
    #swagger.responses[500] = {
        description: "참여 미션 상태 업데이트 실패 응답",
        content: {
            "application/json": {
                schema: {
                    $ref: "#/components/responses/NotFoundErrorResponse"
                },
                examples: {
                    "회원이 참여하지 않은 미션": {
                        summary: "회원이 참여하지 않은 미션",
                        description: "등록되어 있지 않은 참여 미션의 ID로 조회하였습니다.",
                        value: {
                            resultType: "FAIL",
                            error: { 
                                errorCode: "U404",
                                reason: "회원이 참여하지 않은 미션",
                                data: {}
                            },
                            success: null 
                        }
                    },
                    "이미 완료된 미션": {
                        summmary: "이미 완료된 미션",
                        description: "이미 완료된 미션입니다.",
                        value: {
                            resultType: "FAIL",
                            error: { 
                                errorCode: "U403",
                                reason: "이미 완료된 미션",
                                data: {}
                            },
                            success: null                         
                        }
                    },
                    "이미 종료된 미션": {
                        $ref: "#/components/examples/DeadlineErrorExample"
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
    const missions = await memberMissionUpdateCompleted(
        memberId,
        parseInt(req.params.participatedMissionId),
    )
    res.status(StatusCodes.OK).success(missions);
}

// 나의 진행 중인 모든 미션 조회
export const handleListMemberMission = async(req, res, next) => {
    /*
    #swagger.ignore = false
    #swagger.tags = ['participated-mission-controller']
    #swagger.summary = "회원의 진행 중인 미션 목록 조회 API";
    #swagger.description = '회원의 진행 중인 미션 목록 조회 API입니다.'
    #swagger.parameters['cursor'] = {
        $ref: "#/components/parameters/CursorParam"
    }
    #swagger.responses[200] = {
        description: "미션 목록 조회 성공 응답",
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
                                data: {
                                    type: "array",
                                    items: {
                                        $ref: "#/components/responses/MissionSuccessResponse/properties/success",
                                    }
                                },
                                pagination: {
                                    $ref: "#/components/schemas/PaginationSchema"
                                }     
                            }
                        }
                    }
                }
            }
        }
    };
    #swagger.responses[500] = {
        description: "미션 목록 조회 실패 응답",
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
    }
    */
    if (!req.user) {
        throw new NotExistError("로그인 또는 회원가입을 해주세요.", req.body);
    }
    console.log("req.user.id: ", req.user.id);
    const memberId = req.user.id;
    const missions = await listMemberMissions(
        //parseInt(req.params.memberId),
        memberId,
        typeof req.query.cursor === "string"? parseInt(req.query.cursor) : 0
    )
    res.status(StatusCodes.OK).success(missions);
}