import { prisma } from "../db.config.ts";
import { ServerError } from "../errors.ts";
import { BodyToGetMissionType } from "../types/mission.types.ts";

// 특정 회원의 도전 중 또는 완료된 미션 조회
export const getMemberMission = async(memberMissionId: bigint) => {
    try{
        // 해당 회원과 미션이 매핑되었는지 확인
        const memberMission = await prisma.memberMission.findFirst({
            select: {
                id: true, 
                member: true,
                mission: {
                    select: {
                        id: true,
                        name: true,
                        introduction: true,
                        deadline: true,
                        points: true,
                        restaurant: true,
                    }
                },  
                status: true,
                createdAt: true
            },
            where: {
                id: memberMissionId,
            }
        });
        // 해당 회원과 미션이 매핑되어있지 않은 경우
        if (memberMission == null){
            return null;
        }
        const formattedMemberMission = {
            ...memberMission,
            id: memberMission.id.toString(),
            member: {
                ...memberMission.member,
                id: memberMission.member.id.toString(),
                points: memberMission.member.points.toString()
            },
            mission: {
                ...memberMission.mission,
            }
        };
        console.log(formattedMemberMission);
        return formattedMemberMission;
    }
    catch(err){
        throw new ServerError(`서버 내부 오류: ${err}`);
    }
}

// 미션을 도전 중인 미션으로 등록하기
export const registMemberMission = async(memberId: bigint, data: BodyToGetMissionType) => {
    try{
        // 이미 해당 회원에게 등록되어 있는 미션인지 확인한다. 
        const memberMission = await prisma.memberMission.findFirst({where: {memberId: memberId, missionId: data.missionId}}); 
        if (memberMission){ // 이미 회원에게 할당된 미션일 경우
            return null;
        }
        const created = await prisma.memberMission.create({
            data: { // 생성할 데이터 객체
                ...data, // 매개변수로 전달 받은 data 객체의 모든 속성을 복사한다.
                memberId: memberId
            }
        });
        console.log(created);
        return created.id; // 생성된 미션 ID 반환
    }
    catch(err){
        throw new ServerError(`서버 내부 오류: ${err}`);
    }
}

// 특정 회원의 모든 미션 조회
export const getAllMemberMissions = async(memberId: bigint, cursor: number) => {
    try{
        const memberMissions = await prisma.memberMission.findMany({
            select: {
                id: true,
                member: true,
                mission: {
                    select: {
                        id: true,
                        name: true,
                        introduction: true,
                        points: true, 
                        deadline: true,
                        restaurant: true
                    }
                },
                status: true, 
            },
            where: { 
                memberId: memberId, 
                status: 0, // mission 객체의 status가 0(진행 중)인 미션들만 조회온다.
                id: {gt: cursor}
            },
            orderBy: {id: "asc"},
            take: 5
        })
        console.log(memberMissions);
        const formattedMemberMissions = memberMissions.map(memberMission => ({
            ...memberMission,
            id: memberMission.id.toString(),
            member: {
                ...memberMission.member,
                id: memberMission.member.id.toString(),
                points: memberMission.member.points.toString(),  
            },
            mission: {
                ...memberMission.mission,
                id: memberMission.mission.id.toString(),              
            },
        }));
        return formattedMemberMissions;
    }
    catch(err){
        throw new ServerError(`서버 내부 오류: ${err}`);
    }
}

// 특정 회원의 특정 미션의 상태 업데이트(진행 중 -> 진행 완료)
export const updateMemberMissionCompleted = async(participatedMissionId: bigint) => {
    try{
        const memberMissionUpdated = await prisma.memberMission.update({
            where: {
                id: participatedMissionId
            },
            data: {
                status: 1 // status 값을 1(완료)로 변경
            },
        });
    }
    catch(err){
        throw new ServerError(`서버 내부 오류: ${err}`);
    }
}