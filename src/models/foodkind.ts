import { FoodKind as PrismaFoodKind } from "@prisma/client";

export class FoodKindModel implements PrismaFoodKind {
    id: bigint;
    kind: string;
    createdAt: Date;
    updatedAt: Date;
    status: number;
    constructor(data: PrismaFoodKind) {
        this.id = data.id;
        this.kind = data.kind;
        this.createdAt = data.createdAt;
        this.updatedAt = data.updatedAt;
        this.status = data.status;
    }
}