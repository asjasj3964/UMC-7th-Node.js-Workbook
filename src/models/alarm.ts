import { Alarm as PrismaAlarm } from "@prisma/client";

export class AlarmModel implements PrismaAlarm {
    id: bigint;
    memberId: bigint;
    isConfirmed: number;
    createdAt: Date;
    updatedAt: Date;
    status: number;
    constructor(data: PrismaAlarm) {
        this.id = data.id;
        this.memberId = data.memberId;
        this.isConfirmed = data.isConfirmed;
        this.createdAt = data.createdAt;
        this.updatedAt = data.updatedAt;
        this.status = data.status;
    }
}