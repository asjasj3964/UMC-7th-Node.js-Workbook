import { responseFromRestaurant } from './restaurant.dto.js';
import { addRestaurant, getRestaurant, getrestaurantCeoByCeoId, getrestaurantRegionByRestaurantId } from "../repositories/restaurant.repository.js";

export const restaurantRegist = async(data) => {
    const registRestaurantId = await addRestaurant({
        ceoId: data.ceoId,
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
    const region = await getrestaurantRegionByRestaurantId(registRestaurantId); 
    const restaurantCeo = await getrestaurantCeoByCeoId(data.ceoId);
    return responseFromRestaurant({ restaurant, region, restaurantCeo }); 
}