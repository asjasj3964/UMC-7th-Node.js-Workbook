import { StatusCodes } from "http-status-codes";
import { bodyToReview } from "../dtos/review.dto.js";
import { reviewRegist } from "../services/review.service.js"

// 리뷰 등록 핸들러
export const handleReviewRegist = async(req, res, next) => {
    console.log("리뷰 등록");
    console.log("body: ", req.body);
    const review = await reviewRegist(bodyToReview(req.body));
    res.status(StatusCodes.OK).json(review)
}
 