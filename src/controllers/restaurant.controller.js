import { StatusCodes } from "http-status-codes";
import { bodyToRestaurant } from "../dtos/restaurant.dto.js";
import { restaurantRegist } from "../services/restaurant.service.js"
import { listRestaurantReviews, listRestaurantMissions } from "../services/restaurant.service.js";

// 식당 등록 핸들러
export const handleRestaurantRegist = async(req, res, next) => {
    console.log("식당 등록");
    console.log("body: ", req.body);
    const restaurant = await restaurantRegist(bodyToRestaurant(req.body));
    // res.status(StatusCodes.OK).json({ result: restaurant });
    res.status(StatusCodes.OK).json(restaurant);

}

// 특정 식당 모든 리뷰 조회 핸들러
export const handleListRestaurantReviews = async(req, res, next) => {
    const reviews = await listRestaurantReviews(
        parseInt(req.params.restaurantId), // URL 경로에서 restaurantId(Path Parameter)를 가져온다.
        typeof req.query.cursor === "string"? parseInt(req.query.cursor) : 0
        // cursor(Query Parameter)가 문자열이라면 parseInt로 정수로 변환, 그렇지 않으면 기본값 0
    ); 
    res.status(StatusCodes.OK).json(reviews);
}

// 특정 식당 모든 미션 조회 핸들러
export const handleListRestaurantMissions = async(req, res, next) => {
    const missions = await listRestaurantMissions(
        parseInt(req.params.restaurantId),
        typeof req.query.cursor === "string"? parseInt(req.query.cursor) : 0
    );
    res.status(StatusCodes.OK).json(missions);
}
