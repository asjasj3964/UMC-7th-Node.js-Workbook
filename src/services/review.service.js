import { responseFromReview } from '../dtos/review.dto.js';
import { addReview, getReview, getReviewRestaurantByReviewId, getReviewWriterByWriterId } from '../repositories/review.repository.js';

export const reviewRegist = async(data) => {
    const registReviewId = await addReview({
        member: data.member,
        restaurant: data.restaurant,
        rating: data.rating,
        content: data.content
    })
    if (registReviewId === null){
        throw new Error("존재하지 않은 식당"); 
    }
    const review = await getReview(registReviewId);
    const restaurant = await getReviewRestaurantByReviewId(registReviewId);
    const reviewWriter = await getReviewWriterByWriterId(data.member);
    return responseFromReview({ review, restaurant, reviewWriter});
}