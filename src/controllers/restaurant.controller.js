import { StatusCodes } from "http-status-codes";
import { bodyToRestaurant } from "../dtos/restaurant.dto.js";
import { restaurantRegist } from "../services/restaurant.service.js"

// 식당 등록 핸들러
export const handlerRestaurantRegist = async(req, res, next) => {
    console.log("식당 등록");
    console.log("body: ", req.body);
    const restaurant = await restaurantRegist(bodyToRestaurant(req.body));
    res.status(StatusCodes.OK).json({ result: restaurant });
}