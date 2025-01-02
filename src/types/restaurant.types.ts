import { Decimal } from "@prisma/client/runtime/library";

export type BodyToRestaurantType = {
    regionId: bigint,
    name: string,
    introduction: string,
    foodKinds: bigint[],
    startTime: string,
    endTime: string,
}

export type RestaurantType = {
    id: string;
    region: {
        id: string;
        address: string;
        createdAt: Date;
        updatedAt: Date;
        status: number;
    };
    ceo: {
        id: string;
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
        points: bigint;
        inactiveAt: Date | null;
    };
    name: string,
    introduction: string, 
    startTime: string,
    endTime: string,
    totalRating: Decimal;
} | null