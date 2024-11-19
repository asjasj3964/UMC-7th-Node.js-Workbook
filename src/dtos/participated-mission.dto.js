// bodyToMemberMission 요청 DTO
export const bodyToMemberMission = (body) => { 
    return {
        memberId: body.memberId,
        missionId: body.missionId
    };
};

// memberMission 응답 DTO
export const responseFromMemberMission = (data) => {
    return {
        id: data.id,
        member: data.member.name,
        restaurant: data.mission.restaurant.name,
        name: data.mission.name,
        introduction: data.mission.introduction,
        deadline: data.mission.deadline,
        points: data.mission.points,
        status: data.status
    }
}