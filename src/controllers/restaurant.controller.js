import { StatusCodes } from "http-status-codes";
import { bodyToRestaurant } from "../dtos/restaurant.dto.js";
import { restaurantRegist } from "../services/restaurant.service.js"
import { listRestaurantReviews, listRestaurantMissions } from "../services/restaurant.service.js";

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
                        "ceoId": { type: "number" },
                        "regionId": { type: "number" },
                        "name": { type: "string" },
                        "introduction": { type: "string" },
                        "foodKinds": { type: "array", items: { type: "number" } },
                        "startTime": { type: "string" },
                        "endTime": { type: "string" }
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
                                "ceo": { type: "string" },
                                "region": { type: "string" },
                                "name": { type: "string" },
                                "introduction": { type: "string" },
                                "foodKinds": { type: "array", items: { type: "string" } },
                                "startTime": { type: "string" },
                                "endTime": { type: "string" }
                            }
                        }  
                    }
                }
            }
        }
    };
    #swagger.responses[400] = {
        description: "식당 등록 실패 응답",
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
    console.log("식당 등록");
    console.log("body: ", req.body);
    const restaurant = await restaurantRegist(bodyToRestaurant(req.body));
    res.status(StatusCodes.OK).success(restaurant);
}

// 특정 식당 모든 리뷰 조회 핸들러
export const handleListRestaurantReviews = async(req, res, next) => {
    /*
    #swagger.ignore = false
    #swagger.tags = ['restaurant-controller']
    #swagger.summary = "식당의 리뷰 목록 조회 API";
    #swagger.description = '식당의 리뷰 목록 조회 API입니다.'
    #swagger.responses[200] = {
        description: "식당의 리뷰 목록 조회 성공 응답",
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
        description: "식당의 리뷰 목록 조회 실패 응답",
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
                                            "id": { type: "string", example: "1" },
                                            "restaurant": { type: "string" },
                                            "name": { type: "string" },
                                            "introduction": { type: "string" },
                                            "points": { type: "string", example: "100" },
                                            "status": { type: "number" }
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
        description: "식당의 미션 목록 조회 실패 응답",
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
    const missions = await listRestaurantMissions(
        parseInt(req.params.restaurantId),
        typeof req.query.cursor === "string"? parseInt(req.query.cursor) : 0
    );
    res.status(StatusCodes.OK).success(missions);
}
