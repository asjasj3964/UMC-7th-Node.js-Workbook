import { Member as PrismaMember } from "@prisma/client";

export interface MemberModel {//implements PrismaMember {
    id: bigint;
    name: string;
    email: string;
    location: string;
    phoneNumber: string;
    nickname: string;
    gender: number;
    birth: Date;
    points: bigint;
    createdAt: Date;
    updatedAt: Date;
    status: number;
    inactiveAt: Date | null;
    // constructor(data: PrismaMember) {
    //     this.id = data.id;
    //     this.name = data.name;
    //     this.email = data.email;
    //     this.location = data.location;
    //     this.phoneNumber = data.phoneNumber;
    //     this.nickname = data.nickname;
    //     this.gender = data.gender;
    //     this.birth = data.birth;
    //     this.points = data.points;
    //     this.createdAt = data.createdAt;
    //     this.updatedAt = data.updatedAt;
    //     this.status = data.status;
    //     this.inactiveAt = data.inactiveAt;
    // }
}