declare module 'passport-kakao' {
    import { Strategy as PassportStrategy } from 'passport';

    export interface Profile {
        provider: string;
        id: string;
        displayName: string;
        _json: {
            id: number;
            connected_at: string;
            properties: {
                nickname: string;
                profile_image?: string;
                thumbnail_image?: string;
            };
            kakao_account: {
                email?: string;
                age_range?: string;
                birthday?: string;
                gender?: string;
            };
        };
    }

    export interface StrategyOption {
        clientID: string;
        clientSecret?: string;
        callbackURL: string;
        scope?: string[]; 
        state?: boolean;  
    }

    export type VerifyFunction = (
        accessToken: string,
        refreshToken: string,
        profile: Profile,
        done: (error: any, user?: any) => void
    ) => void;

    export class Strategy extends PassportStrategy {
        constructor(options: StrategyOption, verify: VerifyFunction);
    }
}
