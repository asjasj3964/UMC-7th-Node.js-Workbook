import { FoodKindsType } from "../types/foodkind.types.ts";
import { BodyToRestaurantType, RestaurantType } from "../types/restaurant.types.ts";

// restaurant 요청 DTO
export const bodyToRestaurant = (body: BodyToRestaurantType) => {
    return {
        regionId: body.regionId,
        name: body.name,
        introduction: body.introduction,
        foodKinds: body.foodKinds,
        startTime: body.startTime,
        endTime: body.endTime,
    };
};

// restaurant 응답 DTO
export const responseFromRestaurant = ({restaurant, foodKinds} : {
    restaurant: RestaurantType,
    foodKinds: FoodKindsType
}) => {
    //console.log(restaurant);
    return {
        id: restaurant!.id,
        ceo: restaurant!.ceo.name,
        region: restaurant!.region.address,
        name: restaurant!.name,
        introduction: restaurant!.introduction,
        startTime: restaurant!.startTime,
        endTime: restaurant!.endTime,    
        foodKinds: foodKinds.map(foodKind => foodKind.foodKind.kind)
    }
}