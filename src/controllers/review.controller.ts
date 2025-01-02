import { StatusCodes } from "http-status-codes";
import { bodyToReview, bodyToReviewImages } from "../dtos/review.dto.ts";
import { reviewRegist, listReviews, reivewImageDelete, reviewImageMove } from "../services/review.service.ts"
import { NotExistError } from "../errors.ts";
import { Response, Request, NextFunction } from 'express';

// 리뷰 등록 핸들러
export const handleReviewRegist = async(req: Request, res: Response, next: NextFunction) => {
    /*
    #swagger.tags = ['review-controller']
    #swagger.summary = '리뷰 등록 API';
    #swagger.description = '리뷰 등록 API입니다.'
    #swagger.parameters['directory'] = {
        $ref: "#/components/parameters/directoryParam"
    }
    #swagger.requestBody = {
        required: true,
        content: {
            "multipart/form-data": {
                schema: {
                    type: "object",
                    required: ['restaurantId', 'rating', 'content'],
                    properties: {
                        restaurantId: { type: "number", description: "식당 ID" },
                        rating: { type: "number", example: 3.5, description: "별점" },
                        content: { type: "string", description: "리뷰 내용" },
                        images: {
                            type: "array",
                            items: {
                                type: "string", format: "binary"
                            },
                            description: "파일 업로드"
                        }
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
                                status: { type: "number" },
                                images: { type: "array", items: { type: "string" } }
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
    console.log("req.files:", req.files);
    const uploadedFiles = req.files!.map((file) => (file.destination));
    console.log("files", uploadedFiles);
    if (!req.user) {
        throw new NotExistError("로그인 또는 회원가입을 해주세요.", req.body);
    }
    const memberId = req.user.id;
    const review = await reviewRegist(memberId, bodyToReview(req.body), uploadedFiles);
    res.status(StatusCodes.OK).success(review)
}
 
export const handlerReivewImageDelete = async(req: Request, res: Response, next: NextFunction) => {
    /*
    #swagger.tags = ['review-controller']
    #swagger.summary = '리뷰 사진 삭제 API';
    #swagger.description = '리뷰 사진 삭제 API입니다.'
    #swagger.parameters['reviewId'] = {
        $ref: "#/components/parameters/ReviewIdParam"
    }
    #swagger.requestBody = {
        required: true,
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        images: {
                            type: "array",
                            items: {
                                type: "number"
                            },
                            description: "파일 업로드"
                        }
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
                                status: { type: "number" },
                                images: { type: "array", items: { type: "string" } }
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
                    "존재하지 않는 리뷰": {
                        $ref: "#/components/examples/ReviewNotFoundErrorExample"
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
    console.log(req.params.reviewId);
    const reviewImages = await reivewImageDelete(BigInt(req.params.reviewId), bodyToReviewImages(req.body));
    res.status(StatusCodes.OK).success(reviewImages);
}

export const handlerChangeDirectory = async(req: Request, res: Response, next: NextFunction) => {
    /*
    #swagger.tags = ['review-controller']
    #swagger.summary = '리뷰 사진 이동 API';
    #swagger.description = '리뷰 사진 이동 API입니다.'
    #swagger.parameters['reviewId'] = {
        $ref: "#/components/parameters/ReviewIdParam"
    }
    #swagger.parameters['directory'] = {
        $ref: "#/components/parameters/directoryParam"
    }
    #swagger.requestBody = {
        required: true,
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        images: {
                            type: "array",
                            items: {
                                type: "number"
                            },
                            description: "이동할 사진"
                        }
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
                                status: { type: "number" },
                                images: { type: "array", items: { type: "string" } }
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
                    "존재하지 않는 리뷰": {
                        $ref: "#/components/examples/ReviewNotFoundErrorExample"
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
    const directory = req.query.directory as string;
    const reviewImagesToMove = await reviewImageMove(BigInt(req.params.reviewId), bodyToReviewImages(req.body), directory);
    res.status(StatusCodes.OK).success(reviewImagesToMove);
}

// 나의 모든 리뷰 조회
export const handleListReviews = async(req: Request, res: Response, next: NextFunction) => {
    /*
    #swagger.ignore = false
    #swagger.tags = ['review-controller']
    #swagger.summary = "회원의 리뷰 목록 조회 API";
    #swagger.description = '회원의 리뷰 목록 조회 API입니다.'
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
    if (!req.user) {
        throw new NotExistError("로그인 또는 회원가입을 해주세요.", req.body);
    }
    const memberId = req.user.id;
    const reviews = await listReviews(
        //parseInt(req.params.memberId),
        memberId,
        typeof req.query.cursor === "string"? parseInt(req.query.cursor) : 0
        // cursor(Query Parameter)가 문자열이라면 parseInt로 정수로 변환, 그렇지 않으면 기본값 0
    )
    res.status(StatusCodes.OK).success(reviews);
}