import { Decimal } from "@prisma/client/runtime/library";

export type MemberMissionType = {
    mission: {
        restaurant: {
            name: string;
            id: bigint;
            introduction: string;
            createdAt: Date;
            updatedAt: Date;
            status: number;
            ceoId: bigint;
            regionId: bigint;
            startTime: string;
            endTime: string;
            totalRating: Decimal;
        };
        id: bigint;
        name: string;
        introduction: string;
        deadline: Date;
        points: number;
    };
    id: string;
    createdAt: Date;
    status: number;
    member: {
        id: string;
        points: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        status: number;
        email: string;
        location: string;
        phoneNumber: string;
        nickname: string;
        gender: number;
        birth: Date;
        inactiveAt: Date | null;
    };
} | null

export type BodyToMemberMission = {
    missionId: bigint
}

export type MemberMissionsType = {
    id: string;
    member: {
        id: string;
        points: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        status: number;
        email: string;
        location: string;
        phoneNumber: string;
        nickname: string;
        gender: number;
        birth: Date;
        inactiveAt: Date | null;
    };
    mission: {
        id: string;
        name: string;
        introduction: string;
        deadline: Date;
        points: number;
        restaurant: {
            name: string;
            id: bigint;
            introduction: string;
            createdAt: Date;
            updatedAt: Date;
            status: number;
            ceoId: bigint;
            regionId: bigint;
            startTime: string;
            endTime: string;
            totalRating: Decimal;
        };
    }
    status: number;
}