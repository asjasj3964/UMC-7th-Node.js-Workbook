import { ServerError } from "../errors.js"
import { prisma } from "../db.config.js";

export const registImages = async(registReviewId, uploadedFiles) => {
    try{
        const data = uploadedFiles.map((uploadedFile) => ({
            reviewId: registReviewId,
            imageUrl: uploadedFile
        }))
        const created = await prisma.image.createMany({
            data: data
        })
    }
    catch(err) {
        throw new ServerError(`서버 내부 오류: ${err.stack}`);
    }
}

export const getImage = async(imageId) => {
    try{
        const image = await prisma.image.findFirst({
            where: {
                id: imageId,
            }
        }) 
        if (image == null) {
            return null;
        }
        return image;
    }
    catch(err){
        throw new ServerError(`서버 내부 오류: ${err.stack}`);
    }
}