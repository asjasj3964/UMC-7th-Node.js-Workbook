namespace NodeJS {
    interface ProcessEnv extends NodeJS.ProcessEnv {
        PORT: string;
        DATABASE_URL: string;
        EXPRESS_SESSION_SECRET: string;
        PASSPORT_GOOGLE_CLIENT_ID: string;
        PASSPORT_GOOGLE_CLIENT_SECRET: string;
        PASSPORT_KAKAO_CLIENT_ID: string;
        KAKAO_REDIRECT_URI: string;
        GOOGLE_REDIRECT_URI: string;
        PASSPORT_KAKAO_CLIENT_ID: string;
        KAKAO_REDIRECT_URI: string;
        PASSPORT_NAVER_CLIENT_ID: string;
        PASSPORT_NAVER_CLIENT_SECRET: string;
        NAVER_REDIRECT_URI: string;
        AWS_REGION: string;
        AWS_ACCESS_KEY_ID: string;
        AWS_SECRET_ACCESS_KEY: string;
        AWS_S3_BUCKET_NAME: string;
    }
}