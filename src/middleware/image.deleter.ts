import { DeleteObjectCommand, S3Client } from '@aws-sdk/client-s3';

const s3 = new S3Client({ // AWS SDK의 S3 객체 생성
    region: process.env.AWS_REGION, // 위치한 AWS 리전
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID, // AWS 계정의 엑세스 키 
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, // AWS 계정의 시크릿 액세스 키
    }
});
 
export const deleteImageFromS3 = async(imageUrl: string) => {
    const bucketName = process.env.AWS_S3_BUCKET_NAME;
    const region = process.env.AWS_REGION;
    const key = imageUrl?.replace(`https://${bucketName}.s3.${region}.amazonaws.com/`, ''); // 이미지 URL에서 S3 key 추출
    const decodedKey =  decodeURIComponent(key); // key를 디코딩한다. 
    
    const deleteParams = {
        Bucket: bucketName,
        Key: decodedKey,
    };
    const deleteCommand = new DeleteObjectCommand(deleteParams);
    await s3.send(deleteCommand);
}