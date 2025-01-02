import { MemberFavoriteFoodKind as PrismaMemberFoodKind } from "@prisma/client";

export class MemberFoodKindModel implements PrismaMemberFoodKind {
    id: bigint;
    memberId: bigint;
    foodKindId: bigint;
    createdAt: Date;
    updatedAt: Date;
    status: number;
    constructor(data: PrismaMemberFoodKind) {
        this.id = data.id;
        this.memberId = data.memberId;
        this.foodKindId = data.foodKindId;
        this.createdAt = data.createdAt;
        this.updatedAt = data.updatedAt;
        this.status = data.status;
    }
}