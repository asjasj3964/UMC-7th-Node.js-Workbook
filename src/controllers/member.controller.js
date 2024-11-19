import { StatusCodes } from "http-status-codes";
import { bodyToMember } from "../dtos/member.dto.js";
import { memberSignUp } from "../services/member.service.js"
import { listMemberReviews, listMemberMissions } from "../services/member.service.js";

// 회원 등록 핸들러
export const handleMemberSignUp = async(req, res, next) => {
    /*
    #swagger.tags = ['member-controller']
    #swagger.summary = '회원가입 API';
    #swagger.description = '회원가입 API입니다.'
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
                        birth: { type: "string" },
                        location: { type: "string" },
                        email: { type: "string" },
                        phoneNumber: { type: "string" },
                        favoriteFoodKinds: { type: "array", items: { type: "number" } }
                    }
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
                            type: "object", 
                            properties: {
                                name: { type: "string" },
                                nickname: { type: "string" },
                                gender: { type: "number", example: 1 },
                                birth: { type: "string" },
                                location: { type: "string" },
                                email: { type: "string" },
                                phoneNumber: { type: "string" },
                                favoriteFoodKinds: { type: "array", items: { type: "string" } }
                            }
                        }    
                    }
                }
            }
        }
    };
    #swagger.responses[400] = {
        description: "회원가입 실패 응답",
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
    console.log("회원가입 요청");
    console.log("body: ", req.body); // 값이 잘 들어오는지 테스트
    const member = await memberSignUp(bodyToMember(req.body)); // 요청 데이터를 DTO로 변환 (member 객체 생성)
    res.status(StatusCodes.OK).success(member); // 성공 공통 응답 전달
    // HTTP 응답 반환, JSON 형식의 member 객체를 클라이언트에 전달
}   

// 특정 회원 모든 리뷰 조회
export const handleListMemberReviews = async(req, res, next) => {
    /*
    #swagger.ignore = false
    #swagger.tags = ['member-controller']
    #swagger.summary = "회원의 리뷰 목록 조회 API";
    #swagger.description = '회원의 리뷰 목록 조회 API입니다.'
    #swagger.responses[200] = {
        description: "회원의 리뷰 목록 조회 성공 응답",
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
                                        type: "object",
                                        properties: {
                                            id: { type: "string", example: "1" },
                                            restaurant: { type: "string" },
                                            writer: { type: "string" },
                                            content: { type: "string" },
                                            rating: { type: "number", example: 4.5 },
                                            status: { type: "number" },
                                            createdAt: { type: "string", format: "date-time", example: "2024-11-18T14:23:45.123456Z" }
                                        }
                                    }
                                },
                                pagination: {
                                    type: "object",
                                    properties: {
                                        cursor: {
                                            type: "number",
                                            nullable: true
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    #swagger.responses[400] = {
        description: "회원의 리뷰 목록 조회 실패 응답",
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        resultType: { type: "string", example: "FAIL" },
                        error: {
                            type: "object",
                            properties: {
                                errorCode: { type: "string", example: "U404" },
                                reason: { type: "string" },
                                data: { type: "object" }
                            }
                        },
                        success: { type: "object", nullable: true, example: null }
                    }
                }
            }
        }
    }
    */
    const reviews = await listMemberReviews(
        parseInt(req.params.memberId),
        typeof req.query.cursor === "string"? parseInt(req.query.cursor) : 0
        // cursor(Query Parameter)가 문자열이라면 parseInt로 정수로 변환, 그렇지 않으면 기본값 0
    )
    res.status(StatusCodes.OK).success(reviews);
}

// 특정 회원 모든 미션 조회
export const handleListMemberMission = async(req, res, next) => {
    /*
    #swagger.ignore = false
    #swagger.tags = ['member-controller']
    #swagger.summary = "회원의 참여 미션 목록 조회 API";
    #swagger.description = '회원의 참여 미션 목록 조회 API입니다.'
    #swagger.responses[200] = {
        description: "회원의 참여 미션 목록 조회 성공 응답",
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
                                        type: "object",
                                        properties: {
                                            id: { type: "string", example: "1" },
                                            member: { type: "string" },
                                            restaurant: { type: "string" },
                                            name: { type: "string" },
                                            introduction: { type: "string" },
                                            points: { type: "string", example: "100" },
                                            status: { type: "number", example: 0 },
                                            deadline: { type: "string", format: "data-time", example: "2025-01-01T00:00:00Z" }
                                        }
                                    }
                                },
                                pagination: {
                                    type: "object",
                                    properties: {
                                        cursor: {
                                            type: "number",
                                            nullable: true
                                        }
                                    }
                                }     
                            }
                        }
                    }
                }
            }
        }
    };
    #swagger.responses[400] = {
        description: "회원의 참여 미션 목록 조회 실패 응답",
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        resultType: { type: "string", example: "FAIL" },
                        error: {
                            type: "object",
                            properties: {
                                errorCode: { type: "string", example: "U404" },
                                reason: { type: "string" },
                                data: { type: "object" }
                            }
                        },
                        success: { type: "object", nullable: true, example: null }
                    }
                }
            }
        }
    }
    */
    const missions = await listMemberMissions(
        parseInt(req.params.memberId),
        typeof req.query.cursor === "string"? parseInt(req.query.cursor) : 0
    )
    res.status(StatusCodes.OK).success(missions);
}