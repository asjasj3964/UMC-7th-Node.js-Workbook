import { addReview, getReview, getReviewRestaurantByReviewId, getReviewWriterByWriterId } from '../repositories/review.repository.js';
import { responseFromRestaurant } from '../dtos/restaurant.dto.js';
import { responseFromReview } from '../dtos/review.dto.js';
import { NotExistError } from '../errors.js';

export const reviewRegist = async(data) => {
    const registReviewId = await addReview({
        member: data.member,
        restaurant: data.restaurant,
        rating: data.rating,
        content: data.content
    })
    if (registReviewId === null){
        throw new NotExistError("존재하지 않은 식당"); 
    }
    const review = await getReview(registReviewId);
    // const restaurant = await getReviewRestaurantByReviewId(registReviewId);
    // const reviewWriter = await getReviewWriterByWriterId(data.member);
    // return responseFromReview({ review, restaurant, reviewWriter});
    return responseFromReview(review);
}