import { addRestaurant, getRestaurant, getrestaurantCeoByCeoId, getrestaurantRegionByRestaurantId } from "../repositories/restaurant.repository.js";
import { responseFromReviews } from '../dtos/review.dto.js';
import { getAllRestaurantReviews, getAllRestaurantMissions } from '../repositories/restaurant.repository.js';
import { responseFromMissions } from '../dtos/mission.dto.js';
import { responseFromRestaurant } from '../dtos/restaurant.dto.js';

export const restaurantRegist = async(data) => {
    const registRestaurantId = await addRestaurant({
        ceo: data.ceo,
        region: data.region,
        name: data.name,
        introduction: data.introduction,
        startTime: data.startTime,
        endTime: data.endTime
    })
    if (registRestaurantId === null){
        throw new Error("중복된 식당"); // 동일한 식당을 등록하는 것을 방지
    }
    const restaurant = await getRestaurant(registRestaurantId); 
    return responseFromRestaurant(restaurant);
    // const region = await getrestaurantRegionByRestaurantId(registRestaurantId); 
    // const restaurantCeo = await getrestaurantCeoByCeoId(data.ceo);
    // return responseFromRestaurant({ restaurant, region, restaurantCeo }); 
}

export const listRestaurantReviews = async(restaurantId, cursor) => {
    const reviews = await getAllRestaurantReviews(restaurantId, cursor);
    return responseFromReviews(reviews);
}

export const listRestaurantMissions = async(restaurantId, cursor) => {
    const missions = await getAllRestaurantMissions(restaurantId, cursor);
    return responseFromMissions(missions);
}