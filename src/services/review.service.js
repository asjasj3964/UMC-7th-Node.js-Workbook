import { addReview, getReview } from '../repositories/review.repository.js';
import { responseFromReview } from '../dtos/review.dto.js';
import { NotExistError } from '../errors.js';
import { getRestaurant } from '../repositories/restaurant.repository.js';
import { getMember } from '../repositories/member.repository.js';

export const reviewRegist = async(data) => {
    // 리뷰를 추가하려는 식당이 존재하는지 검증
    const restaurant = await getRestaurant(data.restaurant);
    if (restaurant === null){ // 해당 식당이 존재하지 않다면
        throw new NotExistError("존재하지 않은 식당", data); 
    }
    // 해당 회원이 존재하지 않을 경우 에러 처리
    const member = await getMember(data.member);
    if (member === null){
        throw new NotExistError("존재하지 않는 회원", data)
    }
    const registReviewId = await addReview({
        member: data.member,
        restaurant: data.restaurant,
        rating: data.rating,
        content: data.content
    })
    const review = await getReview(registReviewId);
    return responseFromReview(review);
}