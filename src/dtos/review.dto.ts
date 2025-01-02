import { BodyToImageType } from "../types/image.types.ts";
import { BodyToReviewType, ReviewsType, ReviewType } from "../types/review.types.ts";

// review 요청 DTO
export const bodyToReview = (body: BodyToReviewType) => {
    return {
        restaurantId: body.restaurantId,
        rating: body.rating,
        content: body.content
    };
};

// review 목록 응답 DTO
export const responseFromReviews = (reviews: ReviewsType) => {
    return {
        data: reviews.map (review =>({
            id: review.id,
            restaurant: review.restaurant.name,
            writer: review.member.name,
            content: review.content,
            rating: review.rating,
            status: review.status,
            createdAt: review.createdAt,
        })),
        pagination: {
            cursor: reviews.length ? reviews[reviews.length - 1].id: null,
        },
    };
};

// review 응답 DTO
export const responseFromReview = ({ review, uploadedFiles } : {
    review: ReviewType,
    uploadedFiles: string[]
}) => {
    console.log('uploadedFiles:', uploadedFiles);
    return {
        id: review!.id,
        writer: review!.member.name,
        restaurant: review!.restaurant.name,
        rating: review!.rating,
        content: review!.content,
        createdAt: review!.createdAt,
        status: review!.status,
        images: uploadedFiles.map((uploadedFile) => uploadedFile)
    }
}

export const bodyToReviewImages = (body: BodyToImageType) => {
    return {
        images: body.images
    }
}