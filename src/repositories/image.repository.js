import { ServerError } from "../errors.js"
import { prisma } from "../db.config.js";

export const registImages = async(registReviewId, uploadedFiles) => {
    try{
        const data = uploadedFiles.map((uploadedFile) => ({
            reviewId: registReviewId,
            imageUrl: uploadedFile.location
        }))
        const created = await prisma.image.createMany({
            data: data
        })
    }
    catch(err) {
        throw new ServerError(`서버 내부 오류: ${err.stack}`);
    }
}