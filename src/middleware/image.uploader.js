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

// 확장자 검사 목록
const allowedExtensions = [".png", ".jpg", ".jpeg", ".bmp", ".gif"];
export const imageUploader = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.AWS_S3_BUCKET_NAME,
        contentType: multerS3.AUTO_CONTENT_TYPE, // Content-type (자동으로 찾도록 설정)
        key: (req, file, callback) => {
            // 파일명
            const uploadDirectory = req.query.directory ?? ""; // 디렉토리 path 설정을 위함
            const extension = path.extname(file.originalname); // 파일 이름을 얻는다.
            const uuid = uuidv4(); // UUID 생성
            // extension 확인을 위한 코드 (확장자 검사용)
            if (!allowedExtensions.includes(extension)) {
                return callback(new BaseError(status.WRONG_EXTENSION));
            }
            callback(null, `${uploadDirectory}/${uuid}_${file.originalname}`);
        },
        acl: "public-read-write", // 파일 엑세스 권한
    }),
    // 이미지 용량 제한 (5MB)
    limits: {fileSize: 5 * 1024 * 1024},
});