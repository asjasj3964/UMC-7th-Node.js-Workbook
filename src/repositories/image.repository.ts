import { ServerError } from "../errors.ts"
import { prisma } from "../db.config.ts";

export const registImages = async(registReviewId: bigint, uploadedFiles: string[]) => {
    try{
        const data = uploadedFiles?.map((uploadedFile) => ({
            reviewId: registReviewId,
            imageUrl: uploadedFile
        }))
        const created = await prisma.image.createMany({
            data: data
        })
    }
    catch(err) {
        throw new ServerError(`서버 내부 오류: ${err}`);
    }
}

export const getImage = async(imageId: bigint) => {
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
        throw new ServerError(`서버 내부 오류: ${err}`);
    }
}