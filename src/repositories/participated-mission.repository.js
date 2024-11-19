import { prisma } from "../db.config.js";
import { ServerError } from "../errors.js";

// 특정 회원의 도전 중 또는 완료된 미션 조회
export const getMemberMission = async(memberMissionId) => {
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
        throw new ServerError(`서버 내부 오류: ${err.stack}`);
    }
}

// 미션을 도전 중인 미션으로 등록하기
export const registMemberMission = async(data) => {
    try{
        // 이미 해당 회원에게 등록되어 있는 미션인지 확인한다. 
        const memberMission = await prisma.memberMission.findFirst({where: {memberId: data.memberId, missionId: data.missionId}}); 
        if (memberMission){ // 이미 회원에게 할당된 미션일 경우
            return null;
        }
        const created = await prisma.memberMission.create({
            data: data
        });
        console.log(created);
        return created.id; // 생성된 미션 ID 반환
    }
    catch(err){
        throw new ServerError(`서버 내부 오류: ${err.stack}`);
    }
}

// 특정 회원의 특정 미션의 상태 업데이트(진행 중 -> 진행 완료)
export const updateMemberMissionCompleted = async(participatedMissionId) => {
    try{
        const memberMissionUpdated = await prisma.memberMission.update({
            where: {
                id: participatedMissionId
            },
            data: {
                status: 1 // status 값을 1(완료)로 변경
            },
        });
        return memberMissionUpdated;
    }
    catch(err){
        throw new ServerError(`서버 내부 오류: ${err.stack}`);
    }
}