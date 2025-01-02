// import { StatusCodes } from "http-status-codes";
// import { bodyToFoodkind } from "../dtos/foodkind.dto.ts";
// import { NotExistError } from "../errors.ts";
// import { foodKindRegist } from "../services/foodkind.service.ts";
// import { Response, Request, NextFunction } from 'express';

// export const handlerFoodKindRegist = async(req: Request, res: Response, next: NextFunction) => {
//     console.log("음식 종류 등록");
//     console.log("body: ", req.body);
//     if (!req.user) {
//         throw new NotExistError("로그인 또는 회원가입을 해주세요.", req.body);
//     }
//     const foodkind = await foodKindRegist(bodyToFoodkind(req.body));
//     res.status(StatusCodes.OK).success(foodkind); // 성공 공통 응답 전달
// }