import { addReview, getReview } from '../repositories/review.repository.js';
import { responseFromReview, responseFromReviews } from '../dtos/review.dto.js';
import { NotExistError } from '../errors.js';
import { getRestaurant } from '../repositories/restaurant.repository.js';
import { getMember, getAllReviews } from '../repositories/member.repository.js';

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
    const review = await getReview(registReviewId);
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