import AWS from "aws-sdk";

const s3 = new AWS.S3({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_KEY,
});
 
export const deleteImageFromS3 = async(imageUrl: string) => {
    const bucketName = process.env.AWS_S3_BUCKET_NAME;
    const region = process.env.AWS_REGION;
    const key = imageUrl?.replace(`https://${bucketName}.s3.${region}.amazonaws.com/`, ''); // 이미지 URL에서 S3 key 추출
    const decodedKey =  decodeURIComponent(key); // key를 디코딩한다. 
    await s3.deleteObject({
        Bucket: bucketName!.toString(),
        Key: decodedKey,
    })
    .promise();
}