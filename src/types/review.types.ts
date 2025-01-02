import { Decimal } from "@prisma/client/runtime/library"

export type BodyToReviewType = {
    restaurantId: bigint,
    rating: Decimal,
    content: string
}

export type ReviewType = {
    id: string;
    member: {
        id: string;
        name: string;
    };
    restaurant: {
        id: string;
        name: string;
    };
    rating: Decimal;
    content: string;
    createdAt: Date;
    status: number;
} | null

export type ReviewsType = {
    id: string;
    member: {
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
    restaurant: {
        id: string;
        ceoId: string;
        regionId: string;
        name: string;
        introduction: string;
        startTime: string;
        endTime: string;
        totalRating: Decimal;
        createdAt: Date;
        updatedAt: Date;
        status: number;
    },
    rating: Decimal,
    createdAt: Date,
    status: number,
    content: string;
}[]