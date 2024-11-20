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
    #swagger.responses[400] = {
        description: "식당 등록 실패 응답",
        content: {
            "application/json": {
                schema: {
                    $ref: "#/components/schemas/ErrorResponse"
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
    #swagger.parameters['restaurantId'] = {
        in: 'path',
        required: true,
        description: "식당의 ID 입력",
        '@schema': {
            type: "integer",
            format: "int64"
        }
    }
    #swagger.parameters['cursor'] = {
        in: 'query',
        description: "페이징 커서 값 입력",
        '@schema': {
            type: "integer",
            format: "int64"
        }
    }
    #swagger.responses[200] = {
        description: "식당의 리뷰 목록 조회 성공 응답",
        content: {
            "application/json": {
                schema: {
                    $ref: "#/components/schemas/ReviewListSuccessResponse"
                }
            }
        }
    }
    #swagger.responses[400] = {
        description: "식당의 리뷰 목록 조회 실패 응답",
        content: {
            "application/json": {
                schema: {
                    $ref: "#/components/schemas/ErrorResponse"
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
    #swagger.parameters['restaurantId'] = {
        in: 'path',
        required: true,
        description: "식당의 ID 입력",
        '@schema': {
            type: "integer",
            format: "int64"
        }
    }
    #swagger.parameters['cursor'] = {
        in: 'query',
        description: "페이징 커서 값 입력",
        '@schema': {
            type: "integer",
            format: "int64"
        }
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
                                    type: "object",
                                    properties: {
                                        cursor: {
                                            type: "string",
                                            nullable: true,
                                            example: "0"
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
                    $ref: "#/components/schemas/ErrorResponse"
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
