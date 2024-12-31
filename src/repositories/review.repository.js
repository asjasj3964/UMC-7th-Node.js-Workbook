import { prisma } from "../db.config.js";
import { ServerError } from "../errors.js";
import { deleteImageFromS3 } from "../middleware/image.deleter.js";
import { imageMover } from "../middleware/image.mover.js";

// 리뷰 데이터 삽입 (리뷰 등록) & 리뷰 ID 반환
export const addReview = async(data) => {
    try{
        const created = await prisma.review.create({
            data: {
                ...data,
                member: {
                    connect: { // member 테이블과 관계 연결
                        id: data.member
                    }
                },
                restaurant:{
                    connect: { // restaurant 테이블과 관계 연결
                        id: data.restaurant
                    }
                }
            }
        });
        return created.id;
    }
    catch(err){
        throw new ServerError(`서버 내부 오류: ${err.stack}`);
    }
}

export const deleteReivewImage = async(imageId) => {
    try{
        const reviewImageUrl = await prisma.image.findFirst({
            where: {
                id: imageId,
            }
        })
        deleteImageFromS3(reviewImageUrl.imageUrl);
        await prisma.image.delete({
            where: {
                id: imageId,
            }
        })
    }
    catch(err){
        throw new ServerError(`서버 내부 오류: ${err.stack}`);
    }
}

export const moveReivewImage = async(imageId, directory) => {
    try{
        const reviewImageUrl = await prisma.image.findFirst({
            where: {
                id: imageId,
            }
        })
        imageMover(reviewImageUrl.imageUrl, directory);
    }
    catch(err){
        throw new ServerError(`서버 내부 오류: ${err.stack}`);
    }
}

// 리뷰 ID로 리뷰 조회
export const getReview = async(reviewId) => {
    try{
        const review = await prisma.review.findFirst({
            select: {
                id: true,
                member: true,
                restaurant: true,
                rating: true,
                content: true,
                createdAt: true,
                status: true
            },
            where: {
                id: reviewId
            }
        });
        // 해당 리뷰가 존재하지 않을 경우
        if (review == null){
            return null;
        }
        const formattedReview = {
            ...review,
            id: review.id.toString(),
            member: {
                id: review.member.id.toString(),
                name: review.member.name,
            },
            restaurant: {
                id: review.restaurant.id.toString(),
                name: review.restaurant.name,
            },
        }
        return formattedReview;
    }
    catch(err){
        throw new ServerError(`서버 내부 오류: ${err.stack}`);
    }
}

export const getReviewImages = async(reviewId) => {
    try{
        const reviewImages = await prisma.image.findMany({
            where: {
                reviewId: reviewId,
            }
        })
        return reviewImages;
    }
    catch(err){
        throw new ServerError(`서버 내부 오류: ${err.stack}`);
    }
}