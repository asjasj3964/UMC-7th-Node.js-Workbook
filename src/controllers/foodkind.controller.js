import { bodyToFoodkind } from "../dtos/foodkind.dto.js";
import { foodKindRegist } from "../services/foodkind.service.js";
 
export const handlerFoodKindRegist = async(req, res, next) => {
    console.log("음식 종류 등록");
    console.log("body: ", req.body);
    if (!req.user) {
        throw new NotExistError("로그인 또는 회원가입을 해주세요.", req.body);
    }
    const foodkind = await foodKindRegist(bodyToFoodkind(req.body));
    res.status(StatusCodes.OK).success(foodkind); // 성공 공통 응답 전달
}