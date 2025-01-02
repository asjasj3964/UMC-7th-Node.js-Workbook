import { FoodKindRestaurant as PrismaFoodKindRestaurant } from "@prisma/client";

export class FoodKindRestaurantModel implements PrismaFoodKindRestaurant {
    id: bigint;
    foodKindId: bigint;
    restaurantId: bigint;
    createdAt: Date;
    updatedAt: Date;
    status: number;
    constructor(data: PrismaFoodKindRestaurant) {
        this.id = data.id;
        this.foodKindId = data.foodKindId;
        this.restaurantId = data.restaurantId;
        this.createdAt = data.createdAt;
        this.updatedAt = data.updatedAt;
        this.status = data.status;
    }
}