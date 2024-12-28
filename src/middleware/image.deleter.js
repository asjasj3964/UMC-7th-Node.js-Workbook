import AWS from "aws-sdk";
import multer from "multer";
import multerS3 from "multer-s3";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const s3 = new AWS.S3({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_KEY,
});
 
export const deleteImageFromS3 = async(imageUrl) => {
    const bucketName = process.env.AWS_S3_BUCKET_NAME;
    const key = imageUrl.split(`${bucketName}/`)[1];

    await s3.deleteObject({
        Bucket: bucketName,
        Key: key,
    })
    .promise();
}