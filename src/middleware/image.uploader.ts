import AWS from "aws-sdk";
import multer from "multer";
import multerS3 from "multer-s3";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const s3 = new AWS.S3({ // AWS SDK의 S3 객체 생성
    region: process.env.AWS_REGION, // 위치한 AWS 리전
    accessKeyId: process.env.AWS_ACCESS_KEY_ID, // AWS 계정의 엑세스 키 
    secretAccessKey: process.env.AWS_SECRET_KEY, // AWS 계정의 시크릿 액세스 키
});

const allowedExtensions = [".png", ".jpg", ".jpeg", ".bmp", ".gif"]; // 확장자 검사 목록
export const imageUploader = multer({ // 파일 업로드 처리를 위한 미들웨어
    storage: multerS3({ // multerS2 저장소 설정
        s3: s3, // AWS S3 객체 설정
        bucket: process.env.AWS_S3_BUCKET_NAME, // 업로드한 S3 버킷 이름
        contentType: multerS3.AUTO_CONTENT_TYPE, // Content-type, 업로드 파일의 MIME 타입(ex. image/png, image/jpeg)을 자동으로 설정한다.
        key: (req, file, callback) => { // S3 버킷 내에 파일이 저장될 경로 및 파일명을 설정한다.
            // 파일명
            const uploadDirectory = req.query.directory ?? ""; // 디렉토리 path 설정을 위함
            const extension = path.extname(file.originalname); // 파일 이름(확장자)을 추출한다.
            const uuid = uuidv4(); // UUID 생성
            // extension 확인을 위한 코드 (확장자 검사용)
            if (!allowedExtensions.includes(extension)) { // 업로드 파일의 확장자가 허용된 목록에 없을 경우
                return callback(new BaseError(status.WRONG_EXTENSION));
            }
            callback(null, `${uploadDirectory}/${uuid}_${file.originalname}`); // S3 버킷에서 파일이 저장될 key
        },
        acl: "public-read-write", // 파일 엑세스 권한 설정 (읽기, 쓰기 권한)
    }),
    // 이미지 용량 제한 (5MB)
    limits: {fileSize: 5 * 1024 * 1024},
});