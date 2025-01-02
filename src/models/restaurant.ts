import { Restaurant as PrismaRestaurant } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

export class RestaurantModel implements PrismaRestaurant {
    id: bigint;
    ceoId: bigint;
    regionId: bigint;
    name: string;
    introduction: string;
    startTime: string;
    endTime: string;
    totalRating: Decimal;
    createdAt: Date;
    updatedAt: Date;
    status: number;
    constructor(data: PrismaRestaurant) {
        this.id = data.id;
        this.ceoId = data.ceoId;
        this.regionId = data.regionId;
        this.name = data.name;
        this.introduction = data.introduction;
        this.startTime = data.startTime;
        this.endTime = data.endTime;
        this.totalRating = data.totalRating;
        this.createdAt = data.createdAt;
        this.updatedAt = data.updatedAt;
        this.status = data.status;
    }
}