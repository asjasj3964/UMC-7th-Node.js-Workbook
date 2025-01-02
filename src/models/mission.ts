import { Prisma, Mission as PrismaMission } from "@prisma/client";

export class MissionModel implements PrismaMission {
    id: bigint;
    restaurantId: bigint;
    name: string;
    introduction: string;
    deadline: Date;
    points: number;
    createdAt: Date;
    updatedAt: Date;
    status: number;
    constructor(data: PrismaMission) {
        this.id = data.id;
        this.restaurantId = data.restaurantId;
        this.name = data.name;
        this.introduction = data.introduction;
        this.deadline = data.deadline;
        this.points = data.points;
        this.createdAt = data.createdAt;
        this.updatedAt = data.updatedAt;
        this.status = data.status;
    }
}