export type MemberFoodKindType = {
    id: bigint;
    memberId: bigint;
    foodKind: {
        id: bigint;
        createdAt: Date;
        updatedAt: Date;
        status: number;
        kind: string;
    };
    foodKindId: bigint;
}[]