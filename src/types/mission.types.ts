import { Decimal } from "@prisma/client/runtime/library";
import { Datetime } from "aws-sdk/clients/costoptimizationhub.js";

export type BodyToMissionType = {
    restaurantId: bigint,
    name: string,
    introduction: string,
    deadline: Date,
    points: number,
}

export type BodyToGetMissionType = {
    missionId: bigint
}

export type MissionType = {
    id: string;
    restaurant: {
        id: string;
        ceoId: string;
        regionId: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        status: number;
        introduction: string;
        startTime: string;
        endTime: string;
        totalRating: Decimal;
    };
    name:string,
    introduction:string,
    deadline:Date,
    points: number,
    status: number
} | null;

export type MissionsType = {
    id: string;
    points: number;
    restaurant: {
        id: string;
        ceoId: string;
        regionId: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        status: number;
        introduction: string;
        startTime: string;
        endTime: string;
        totalRating: Decimal;
    };
    name: string;
    status: number;
    introduction: string;
    deadline: Date;
}[]
