import { StatusCodes } from "http-status-codes";
import { bodyToRestaurant } from "../dtos/restaurant.dto.js";
import { restaurantRegist } from "../services/restaurant.service.js"
import { listRestaurantReviews, listRestaurantMissions } from "../services/restaurant.service.js";
import { NotExistError } from "../errors.js";

// 식당 등록 핸들러
export const handleRestaurantRegist = async(req, res, next) => {
    /*
    #swagger.tags = ['restaurant-controller']
    #swagger.summary = '식당 등록 API';
    #swagger.description = '식당 등록 API입니다.'
    #swagger.requestBody = {
        required: true,
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        "regionId": { type: "number" },
                        "name": { type: "string" },
                        "introduction": { type: "string" },
                        "foodKinds": { type: "array", items: { type: "number" } },
                        "startTime": { type: "string", example: "09:00:00" },
                        "endTime": { type: "string", example: "21:00:00" }
                    }
                }
            }
        }
    };
    #swagger.responses[200] = {
        description: "식당 등록 성공 응답",
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
                                "id": { type: "string", example: "1" },
                                "ceo": { type: "string" },
                                "region": { type: "string" },
                                "name": { type: "string" },
                                "introduction": { type: "string" },
                                "foodKinds": { type: "array", items: { type: "string" } },
                                "startTime": { type: "string", example: "09:00:00" },
                                "endTime": { type: "string", example: "21:00:00" }
                            }
                        }  
                    }
                }
            }
        }
    };
    #swagger.responses[500] = {
        description: "식당 등록 실패 응답",
        content: {
            "application/json": {
                schema: {
                    $ref: "#/components/responses/NotFoundErrorResponse"
                },
                examples: {
                    "존재하지 않는 CEO": {
                        summary: "존재하지 않는 CEO",
                        description: "등록되어 있지 않은 CEO ID로 조회하였습니다.",
                        value: {
                            resultType: "FAIL",
                            error: { 
                                errorCode: "U404",
                                reason: "존재하지 않는 CEO",
                                data: {}
                            },
                            success: null 
                        },
                    },
                    "존재하지 않는 위치": {
                        summary: "존재하지 않는 위치",
                        description: "등록되어 있지 않은 위치 ID로 조회하였습니다.",
                        value: {
                            resultType: "FAIL",
                            error: { 
                                errorCode: "U404",
                                reason: "존재하지 않는 위치",
                                data: {}
                            },
                            success: null 
                        }
                    },
                    "존재하지 않는 음식 종류": {
                        $ref: "#/components/examples/FoodKindNotFoundErrorExample"
                    }, 
                    "중복된 식당": {
                        summary: "중복된 식당",
                        description: "이미 동일한 위치와 이름의 식당이 존재합니다.",
                        value: {
                            resultType: "FAIL",
                            error: { 
                                errorCode: "U001",
                                reason: "중복된 식당",
                                data: {}
                            },
                            success: null 
                        }                    
                    },
                    "서버 내부 오류": {
                        $ref: "#/components/examples/ServerErrorExample"
                    } 
                }
            }
        }
    };
    */
    console.log("식당 등록");
    console.log("body: ", req.body);
    if (!req.user) {
        throw new NotExistError("로그인 또는 회원가입을 해주세요.", req.body);
    }
    const memberId = req.user.id;
    const restaurant = await restaurantRegist(memberId, bodyToRestaurant(req.body));
    res.status(StatusCodes.OK).success(restaurant);
}

// 특정 식당 모든 리뷰 조회 핸들러
export const handleListRestaurantReviews = async(req, res, next) => {
    /*
    #swagger.ignore = false
    #swagger.tags = ['restaurant-controller']
    #swagger.summary = "식당의 리뷰 목록 조회 API";
    #swagger.description = '식당의 리뷰 목록 조회 API입니다.'
    #swagger.parameters['restaurantId'] = {
        $ref: "#/components/parameters/RestaurantIdParam"

    }
    #swagger.parameters['cursor'] = {
        $ref: "#/components/parameters/CursorParam"
    }
    #swagger.responses[200] = {
        description: "리뷰 목록 조회 성공 응답",
        content: {
            "application/json": {
                schema: {
                    $ref: "#/components/responses/ReviewListSuccessResponse"
                }
            }
        }
    };
    #swagger.responses[500] = {
        description: "리뷰 목록 조회 실패 응답",
        content: {
            "application/json": {
                schema: {
                    $ref: "#/components/responses/NotFoundErrorResponse"
                },
                examples: {
                    "존재하지 않는 식당": {
                        $ref: "#/components/examples/RestaurantNotFoundErrorExample"
                    },
                    "서버 내부 오류": {
                        $ref: "#/components/examples/ServerErrorExample"
                    } 
                }
            }
        }
    };
    */
    const reviews = await listRestaurantReviews(
        parseInt(req.params.restaurantId), // URL 경로에서 restaurantId(Path Parameter)를 가져온다.
        typeof req.query.cursor === "string"? parseInt(req.query.cursor) : 0
        // cursor(Query Parameter)가 문자열이라면 parseInt로 정수로 변환, 그렇지 않으면 기본값 0
    ); 
    res.status(StatusCodes.OK).success(reviews);
}

// 특정 식당 모든 미션 조회 핸들러
export const handleListRestaurantMissions = async(req, res, next) => {
    /*
    #swagger.ignore = false
    #swagger.tags = ['restaurant-controller']
    #swagger.summary = "식당의 미션 목록 조회 API";
    #swagger.description = '식당의 미션 목록 조회 API입니다.'
    #swagger.parameters['restaurantId'] = {
        $ref: "#/components/parameters/RestaurantIdParam"
    }
    #swagger.parameters['cursor'] = {
        $ref: "#/components/parameters/CursorParam"
    }
    #swagger.responses[200] = {
        description: "식당의 미션 목록 조회 성공 응답",
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
                                            name: { type: "string" },
                                            introduction: { type: "string" },
                                            points: { type: "number", example: 4.5 },
                                            status: { type: "number" },
                                        }
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
                    "존재하지 않는 식당": {
                        $ref: "#/components/examples/RestaurantNotFoundErrorExample"
                    },
                    "서버 내부 오류": {
                        $ref: "#/components/examples/ServerErrorExample"
                    } 
                }
            }
        }
    };
    */
    const missions = await listRestaurantMissions(
        parseInt(req.params.restaurantId),
        typeof req.query.cursor === "string"? parseInt(req.query.cursor) : 0
    );
    res.status(StatusCodes.OK).success(missions);
}
