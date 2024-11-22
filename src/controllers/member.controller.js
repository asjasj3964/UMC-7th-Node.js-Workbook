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

// 특정 회원 모든 리뷰 조회
export const handleListMemberReviews = async(req, res, next) => {
    /*
    #swagger.ignore = false
    #swagger.tags = ['member-controller']
    #swagger.summary = "회원의 리뷰 목록 조회 API";
    #swagger.description = '회원의 리뷰 목록 조회 API입니다.'
    #swagger.parameters['memberId'] = {
        $ref: "#/components/parameters/MemberIdParam"
    }
    #swagger.parameters['cursor'] = {
        $ref: "#/components/parameters/CursorParam"
    }
    #swagger.responses[200] = {
        description: "미션 목록 조회 성공 응답",
        content: {
            "application/json": {
                schema: {
                    $ref: "#/components/responses/ReviewListSuccessResponse"
                }
            }
        }
    }
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
    const reviews = await listMemberReviews(
        parseInt(req.params.memberId),
        typeof req.query.cursor === "string"? parseInt(req.query.cursor) : 0
        // cursor(Query Parameter)가 문자열이라면 parseInt로 정수로 변환, 그렇지 않으면 기본값 0
    )
    res.status(StatusCodes.OK).success(reviews);
}

// 특정 회원의 진행 중인 모든 미션 조회
export const handleListMemberMission = async(req, res, next) => {
    /*
    #swagger.ignore = false
    #swagger.tags = ['member-controller']
    #swagger.summary = "회원의 진행 중인 미션 목록 조회 API";
    #swagger.description = '회원의 진행 중인 미션 목록 조회 API입니다.'
    #swagger.parameters['memberId'] = {
        $ref: "#/components/parameters/MemberIdParam"
    }
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
    const missions = await listMemberMissions(
        parseInt(req.params.memberId),
        typeof req.query.cursor === "string"? parseInt(req.query.cursor) : 0
    )
    res.status(StatusCodes.OK).success(missions);
}