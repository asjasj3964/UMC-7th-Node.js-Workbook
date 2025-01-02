// // memberMission 요청 DTO
// export const bodyToMemberMission = (data) => { 
//     return {
//         memberId: data.user.id,
//         missionId: data.body.missionId
//     };
// };

import { BodyToMemberMission, MemberMissionsType, MemberMissionType } from "../types/member-mission.types.ts";

// memberMission 응답 DTO
export const responseFromMemberMission = (data: MemberMissionType) => {
    return {
        id: data?.id,
        member: data?.member.name,
        restaurant: data?.mission.restaurant.name,
        name: data?.mission.name,
        introduction: data?.mission.introduction,
        deadline: data?.mission.deadline,
        points: data?.mission.points,
        status: data?.status
    }
}

// memberMission 요청 DTO
export const bodyToMemberMission = (body: BodyToMemberMission) => {
    return {
        missionId: body.missionId
    };
}

// 특정 회원의 memberMission 목록 응답 DTO
export const responseFromMemberMissions = (memberMissions: MemberMissionsType[]) => {
    return {
        data: memberMissions.map(memberMission => ({
            id: memberMission.id,
            member: memberMission.member.name,
            restaurant: memberMission.mission.restaurant.name,
            name: memberMission.mission.name,
            introduction: memberMission.mission.introduction,
            points: memberMission.mission.points,
            status: memberMission.status,
            deadline: memberMission.mission.deadline,
        })),
        pagination: {
            cursor: memberMissions.length ? memberMissions[memberMissions.length - 1].id : null 
            // 다음 페이지를 요청할 때 필요한 위치 표시, 배열이 비어있을 경우 null 처리
        }
    }
}