import { MemberMission as PrismaMemberMisson } from "@prisma/client";

export class MemberMissionModel implements PrismaMemberMisson {
    id: bigint;
    memberId: bigint;
    missionId: bigint;
    createdAt: Date;
    updatedAt: Date;
    status: number;
    constructor(data: PrismaMemberMisson) {
        this.id = data.id;
        this.memberId = data.memberId;
        this.missionId = data.missionId;
        this.createdAt = data.createdAt;
        this.updatedAt = data.updatedAt;
        this.status = data.status;
    }
}