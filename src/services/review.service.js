import { addReview, deleteReivewImage, getReview, getReviewImages, moveReivewImage } from '../repositories/review.repository.js';
import { responseFromReview, responseFromReviews } from '../dtos/review.dto.js';
import { NotExistError } from '../errors.js';
import { getRestaurant } from '../repositories/restaurant.repository.js';
import { getMember, getAllReviews } from '../repositories/member.repository.js';
import { getImage, registImages } from '../repositories/image.repository.js';

export const reviewRegist = async(memberId, data, uploadedFiles) => {
    // 리뷰를 추가하려는 식당이 존재하는지 검증
    const restaurant = await getRestaurant(data.restaurantId);
    if (restaurant === null){ // 해당 식당이 존재하지 않다면
        throw new NotExistError("존재하지 않는 식당", data); 
    }
    // 해당 회원이 존재하지 않을 경우 에러 처리
    const member = await getMember(memberId);
    if (member === null){
        throw new NotExistError("존재하지 않는 회원", {memberId: memberId})
    }
    const registReviewId = await addReview({
        member: memberId,
        restaurant: data.restaurantId,
        rating: data.rating,
        content: data.content
    })
    await registImages(registReviewId, uploadedFiles);
    const review = await getReview(registReviewId);
    return responseFromReview({ review, uploadedFiles });
}

export const reivewImageDelete = async(reviewId, data) => {
    console.log(reviewId);
    const review = await getReview(reviewId);
    if (review === null) {
        throw new NotExistError("존재하지 않는 리뷰", { reviewId: reviewId });
    }  
    for (const imageToDelete of data.images){
        const image = await getImage(imageToDelete)
        if (image === null){ 
            throw new NotExistError("존재하지 않는 이미지", { imageToDelete: imageToDelete });
        }
        await deleteReivewImage(imageToDelete);
    } 
    const reviewImages = await getReviewImages(reviewId);
    const uploadedFiles = reviewImages.map((reviewImage) => reviewImage.imageUrl);
    return responseFromReview({ review, uploadedFiles });
}

export const reviewImageMove = async(reviewId, data, directory) => {
    const review = await getReview(reviewId);
    if (review === null) {
        throw new NotExistError("존재하지 않는 리뷰", { reviewId: reviewId });
    }
    for (const imageToMove of data.images){
        const image = await getImage(imageToMove)
        if (image === null){ 
            throw new NotExistError("존재하지 않는 이미지", { imageToMove: imageToMove });
        }
        await moveReivewImage(imageToMove, directory);
    } 
    const reviewImages = await getReviewImages(reviewId);
    const uploadedFiles = reviewImages.map((reviewImage) => reviewImage.imageUrl);
    return responseFromReview({ review, uploadedFiles });
}

// 레파지토리 호출 및 DTO로 변환
export const listReviews = async(memberId, cursor) => {
    // 해당 회원이 존재하지 않을 경우 에러 처리
    const member = await getMember(memberId);
    if (member === null){
        throw new NotExistError("존재하지 않는 회원", { memberId: memberId });
    }
    const reviews = await getAllReviews(memberId, cursor);
    return responseFromReviews(reviews);
} 