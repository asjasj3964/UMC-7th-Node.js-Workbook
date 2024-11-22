import { StatusCodes } from "http-status-codes";
import { bodyToReview } from "../dtos/review.dto.js";
import { reviewRegist } from "../services/review.service.js"

// 리뷰 등록 핸들러
export const handleReviewRegist = async(req, res, next) => {
    /*
    #swagger.tags = ['review-controller']
    #swagger.summary = '리뷰 등록 API';
    #swagger.description = '리뷰 등록 API입니다.'
    #swagger.requestBody = {
        required: true,
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        memberId: { type: "number" },
                        restaurantId: { type: "number" },
                        rating: { type: "number", example: 3.5 },
                        content: { type: "string" }
                    }
                }
            }
        }
    };
    #swagger.responses[200] = {
        description: "리뷰 등록 성공 응답",
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
                                member: { type: "string" },
                                restaurant: { type: "string" },
                                rating: { type: "number", example: 3.5 },
                                content: { type: "string" },
                                createdAt: { type: "string", format: "date-time", example: "2024-11-18T14:23:45.123456Z" },
                                status: { type: "number" }
                            }
                        }    
                    }
                }
            }
        }
    };
    #swagger.responses[500] = {
        description: "리뷰 등록 실패 응답",
        content: {
            "application/json": {
                schema: {
                    $ref: "#/components/responses/NotFoundErrorResponse"
                },
                examples: {
                    "존재하지 않는 식당": {
                        $ref: "#/components/examples/RestaurantNotFoundErrorExample"
                    }, 
                    "존재하지 않는 회원": {
                        $ref: "#/components/examples/MemberNotFoundErrorExample"
                    }, 
                    "서버 내부 오류": {
                        $ref: "#/components/examples/ServerErrorExample"
                    } 
                }
            }
        }
    };
    */
    console.log("리뷰 등록");
    console.log("body: ", req.body);
    const review = await reviewRegist(bodyToReview(req.body));
    res.status(StatusCodes.OK).success(review)
}
 