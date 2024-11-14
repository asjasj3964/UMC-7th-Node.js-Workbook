import { addRestaurant, getRestaurant, getrestaurantCeoByCeoId, getrestaurantRegionByRestaurantId } from "../repositories/restaurant.repository.js";
import { responseFromReviews } from '../dtos/review.dto.js';
import { getAllRestaurantReviews, getAllRestaurantMissions } from '../repositories/restaurant.repository.js';
import { responseFromMissions } from '../dtos/mission.dto.js';
import { responseFromRestaurant } from '../dtos/restaurant.dto.js';
import { DuplicateError, NotExistError } from "../errors.js";

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
        throw new DuplicateError("중복된 식당", data); // 동일한 식당을 등록하는 것을 방지
    }
    const restaurant = await getRestaurant(registRestaurantId); 
    return responseFromRestaurant(restaurant);
    // const region = await getrestaurantRegionByRestaurantId(registRestaurantId); 
    // const restaurantCeo = await getrestaurantCeoByCeoId(data.ceo);
    // return responseFromRestaurant({ restaurant, region, restaurantCeo }); 
}

export const listRestaurantReviews = async(restaurantId, cursor) => {
    const reviews = await getAllRestaurantReviews(restaurantId, cursor);
    if (reviews === null){
        throw new NotExistError("존재하지 않는 식당", {restaurantId: restaurantId});
    }
    return responseFromReviews(reviews);
}

export const listRestaurantMissions = async(restaurantId, cursor) => {
    const missions = await getAllRestaurantMissions(restaurantId, cursor);
    if (missions === null){
        throw new NotExistError("존재하지 않는 식당", {restaurantId: restaurantId});
    }
    return responseFromMissions(missions);
}