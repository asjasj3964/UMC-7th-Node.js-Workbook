import { Image as PrismaImage } from "@prisma/client";

export class ImageModel implements PrismaImage {
    id: bigint;
    restaurantId: bigint | null;
    reviewId: bigint | null;
    inquiryId: bigint | null;
    imageUrl: string;
    createdAt: Date;
    updatedAt: Date;
    status: number;
    constructor(data: PrismaImage) {
        this.id = data.id;
        this.restaurantId = data.restaurantId;
        this.reviewId = data.reviewId;
        this.inquiryId = data.inquiryId;
        this.imageUrl = data.imageUrl;
        this.createdAt = data.createdAt;
        this.updatedAt = data.updatedAt;
        this.status = data.status;
    }
}