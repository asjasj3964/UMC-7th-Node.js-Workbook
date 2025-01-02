export type BodyToFoodkindType = {
    favoriteFoodKinds: bigint[],
}

export type FoodKindsType = {
    foodKind: {
        kind: string;
        id: bigint;
        createdAt: Date;
        updatedAt: Date;
        status: number;
    };
    id: bigint;
    foodKindId: bigint;
    restaurantId: bigint;
}[]