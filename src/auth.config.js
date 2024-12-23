import dotenv from "dotenv";
import { Strategy as GoogleStrategy } from "passport-google-oauth20"; //  Google 로그인 Strategy 클래스 이용
import { prisma } from "./db.config.js";
import { Strategy as KakaoStrategy } from "passport-kakao";
import { Strategy as NaverStrategy } from "passport-naver-v2";
dotenv.config();
export const googleStrategy = new GoogleStrategy(
    // 옵션 객체
    {
        clientID: process.env.PASSPORT_GOOGLE_CLIENT_ID,
        clientSecret: process.env.PASSPORT_GOOGLE_CLIENT_SECRET, // .env에서 환경변수로 가져온다.
        callbackURL: process.env.GOOGLE_REDIRECT_URI, // Google OAuth 2.0 인증 후 리디렉션될 URL
        scope: ["email", "profile"], // 인증 과정에서 요청할 사용자 정보의 범위: 이메일, 프로필 정보
        state: true, // CSRF 공격(Cross-Site Request Forgery, 사용자가 의도하지 않은 요청을 서버에 보내게 만드는 공격)을 방지하기 위함
    },
    // 검증 함수
    (accessToken, refreshToken, profile, cb) => {
        return googleVerify(profile) // Google의 사용자 프로필 정보를 받아 DB에서 해당 사용자를 확인하거나 (없으면) 생성한다.
        .then((member) => cb(null, member)) // 성공 시 사용자 정보를 Passport 세션으로 전달한다.
        .catch((err) => cb(err)); // 실패 시 에러를 전달한다. 
    }
);

// Google 프로필 정보 검증
const googleVerify = async(profile) => {
    const email = profile.emails?.[0]?.value; // 프로필 정보에 이메일이 포함되어 있는지 확인
    console.log("email: ", email);
    console.log(profile);
    if (!email){ // 이메일 정보가 없다면 에러 처리
        throw new Error(`profile.email was not found: ${profile}`);
    }
    const member = await prisma.member.findFirst({where: { email }}); // 이메일로 사용자 조회
    if (member !== null){ // 이미 해당 이메일로 등록한 회원이 있다면 해당 회원의 정보 반환
        return { id: member.id.toString(), email: member.email, name: member.name };
    }
    const created = await prisma.member.create({ // 사용자가 존재하지 않을 시 기본값으로 사용자 정보를 자동 생성한다.
        data: {
            email,
            name: profile.displayName || "추후 수정",
            nickname: "추후 수정",
            gender: 1,
            birth: new Date(2000, 4, 24),
            location: "추후 수정",
            phoneNumber: "추후 수정",
        },
    });
    console.log(created);
    return { id: created.id.toString(), email: created.email, name: created.name };
};

export const kakaoStrategy = new KakaoStrategy(
    {
        clientID: process.env.PASSPORT_KAKAO_CLIENT_ID,
        callbackURL: process.env.KAKAO_REDIRECT_URI,
        scope: ["account_email"],
        state: true,
    },
    (accessToken, refreshToken, profile, cb) => {
        return kakaoVerify(profile)
        .then((member) => cb(null, member))
        .catch((err) => cb(err));
    }
);

const kakaoVerify = async(profile) => {
    const email = profile._json.kakao_account.email; // 프로필 정보에 이메일이 포함되어 있는지 확인
    console.log(profile);
    if (!email){
        throw new Error(`profile.email was not found: ${profile}`);
    }
    const member = await prisma.member.findFirst({where: { email }}); // 이메일로 사용자 조회
    if (member !== null){ 
        return { id: member.id.toString(), email: member.email, name: member.name };
    }
    const created = await prisma.member.create({ // 사용자가 존재하지 않을 시 기본값으로 사용자 정보를 자동 생성한다.
        data: {
            email,
            name: profile.displayName || "추후 수정",
            nickname: "추후 수정",
            gender: 0,
            birth: new Date(2000, 4, 24),
            location: "추후 수정",
            phoneNumber: "추후 수정",
        },
    });
    console.log(created);
    return { id: created.id.toString(), email: created.email, name: created.name };
};

export const naverStrategy = new NaverStrategy(
    {
        clientID: process.env.PASSPORT_NAVER_CLIENT_ID,
        clientSecret: process.env.PASSPORT_NAVER_CLIENT_SECRET,
        callbackURL: process.env.NAVER_REDIRECT_URI,
        scope: ["email"],
        state: true,
    },
    (accessToken, refreshToken, profile, cb) => {
        console.log(profile);
        return naverVerify(profile)
        .then((member) => cb(null, member))
        .catch((err) => cb(err));
    }
);

const naverVerify = async(profile) => {
    const email = profile.email;
    console.log("email: ", email);
    if (!email){
        throw new Error(`profile.email was not found: ${profile}`);
    }
    const member = await prisma.member.findFirst({ where: { email }});
    if (member !== null){
        return { id: member.id.toString(), email: member.email, name: member.name };
    }
    const created = await prisma.member.create({
        data: {
            email,
            name: profile.name || "추후 수정",
            nickname: "추후 수정",
            gender: 0,
            birth: new Date(2000, 4, 24),
            location: "추후 수정",
            phoneNumber: "추후 수정",
        },
    });
    console.log(created);
    return { id: created.id.toString(), email: created.email, name: created.name };
}