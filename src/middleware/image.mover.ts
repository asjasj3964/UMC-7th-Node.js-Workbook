import { CopyObjectCommand, DeleteObjectCommand, S3Client } from '@aws-sdk/client-s3';

const s3 = new S3Client({ // AWS SDK의 S3 객체 생성
    region: process.env.AWS_REGION, // 위치한 AWS 리전
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID, // AWS 계정의 엑세스 키 
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, // AWS 계정의 시크릿 액세스 키
    }
});

// S3에 저장된 이미지를 이동시키는 함수
export const imageMover = async(imageUrl: string, directory: string,) => {
    const bucketName = process.env.AWS_S3_BUCKET_NAME;
    const region = process.env.AWS_REGION;
    const key = imageUrl.replace(`https://${bucketName}.s3.${region}.amazonaws.com/`, ''); // 이미지 URL에서 S3 key 추출
    const copySource = `${bucketName}/${key}`; // S3 복사 작업에서 원본 객체, "버킷_이름/객체_키"의 형식 
    const dir = directory ? `${directory}/` : ''; // 이동할 디렉토리, directory 값이 없을 경우 루트(/)로 처리
    const targetKey = dir + key.replace(/^[^/]+\//, ''); // 이동했을 경우의 key (이동할_파일/${uuid}_${file.originalname})
    const decodedTargetKey = decodeURIComponent(targetKey); // 디코딩한 대상 경로(객체_키) 
    const decodedKey =  decodeURIComponent(key); // 디코딩한 키 (삭제 시 키를 디코드해서 식별) 

    console.log("targetKey: ", targetKey);
    console.log("decodedKey: ", decodedKey);
    const copyParams = {
        Bucket: bucketName, // 대상 버킷
        CopySource: copySource, // 원본 경로 (버킷 이름/객체 키)
        Key: decodedTargetKey, // 대상 경로
    };

    const copyCommand = new CopyObjectCommand(copyParams);
    await s3.send(copyCommand);

    // 원본 객체 삭제
    const deleteParams = {
        Bucket: bucketName,
        Key: decodedKey,
    };

    const deleteCommand = new DeleteObjectCommand(deleteParams);
    await s3.send(deleteCommand);
}