import { addRestaurant, getRestaurant, getRestaurantFoodKindByRestaurantId, setRestaurantFoodKind, getAllRestaurantReviews, getAllRestaurantMissions } from "../repositories/restaurant.repository.ts";
import { responseFromReviews } from '../dtos/review.dto.ts';
import { responseFromMissions } from '../dtos/mission.dto.ts';
import { responseFromRestaurant } from '../dtos/restaurant.dto.ts';
import { DuplicateError, NotExistError } from "../errors.ts";
import { getRegion } from "../repositories/region.repository.ts";
import { getMember } from "../repositories/member.repository.ts";
import { getFoodKind } from "../repositories/foodkind.repository.ts";
import { BodyToRestaurantType } from "../types/restaurant.types.ts";

export const restaurantRegist = async(memberId: bigint, data: BodyToRestaurantType) => {
    // 해당 CEO가 등록되어있지 않을 경우 에러 처리
    const ceo = await getMember(memberId);
    if (ceo === null){
        throw new NotExistError("존재하지 않는 CEO", data); // 동일한 식당을 등록하는 것을 방지
    }
    // 해당 위치가 존재하지 않을 경우 에러 처리
    const region = await getRegion(data.regionId);
    if (region === null){
        throw new NotExistError("존재하지 않는 위치", data);
    }
    // 등록하려는 음식 종류가 존재하지 않을 경우 에러 처리
    for (const foodKind of data.foodKinds){
        const confirmFoodKind = await getFoodKind(foodKind)
        if (confirmFoodKind === null){ 
            throw new NotExistError("존재하지 않는 음식 종류", data); 
        }
    }
    const registRestaurantId = await addRestaurant({
        ceo: memberId,
        region: data.regionId,
        name: data.name,
        introduction: data.introduction,
        startTime: data.startTime,
        endTime: data.endTime
    })
    // 중복된 식당(동일한 위치, 이름의 식당)일 경우 에러 처리
    if (registRestaurantId === null){
        throw new DuplicateError("중복된 식당", data); // 동일한 식당을 등록하는 것을 방지
    }
    for (const foodKind of data.foodKinds){
        await setRestaurantFoodKind(registRestaurantId, foodKind); // 해당 식당을 포함하는 음식 종류들과 매핑
    }
    const restaurant = await getRestaurant(registRestaurantId); 
    const foodKinds = await getRestaurantFoodKindByRestaurantId(registRestaurantId);
    return responseFromRestaurant({restaurant, foodKinds});
}

export const listRestaurantReviews = async(restaurantId: bigint, cursor: number) => {
    // 해당 식당이 존재하지 않을 경우 에러 처리
    const restaurant = await getRestaurant(restaurantId);
    if (restaurant === null){
        throw new NotExistError("존재하지 않는 식당", {restaurantId: restaurantId}); 
    }
    const reviews = await getAllRestaurantReviews(restaurantId, cursor);
    return responseFromReviews(reviews);
}

export const listRestaurantMissions = async(restaurantId: bigint, cursor: number) => {
    // 해당 식당이 존재하지 않을 경우 에러 처리
    const restaurant = await getRestaurant(restaurantId);
    if (restaurant === null){
        throw new NotExistError("존재하지 않는 식당", {restaurantId: restaurantId}); 
    }
    const missions = await getAllRestaurantMissions(restaurantId, cursor);
    return responseFromMissions(missions);
}