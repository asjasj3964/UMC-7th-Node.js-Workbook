import dotenv from "dotenv";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { prisma } from "./db.config.js";
import { Strategy as KakaoStrategy } from "passport-kakao";
import { Strategy as NaverStrategy } from "passport-naver-v2";
dotenv.config();
export const googleStrategy = new GoogleStrategy(
    {
        clientID: process.env.PASSPORT_GOOGLE_CLIENT_ID,
        clientSecret: process.env.PASSPORT_GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:3001/oauth2/callback/google",
        scope: ["email", "profile"],
        state: true,
    },
    (accessToken, refreshToken, profile, cb) => {
        return googleVerify(profile)
        .then((member) => cb(null, member))
        .catch((err) => cb(err));
    }
);

const googleVerify = async(profile) => {
    const email = profile.emails?.[0]?.value; // 프로필 정보에 이메일이 포함되어 있는지 확인
    console.log("email: ", email);
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
            name: profile.displayName,
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
        callbackURL: "http://localhost:3001/auth/kakao/callback",
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
    console.log("email: ", email);
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
            name: profile.displayName,
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
        callbackURL: "http://localhost:3001/oauth2/callback/naver",
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
            name: profile.displayName,
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