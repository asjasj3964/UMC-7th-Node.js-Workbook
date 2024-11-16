// mission 요청 DTO
export const bodyToMission = (body) => { 
    return {
        member: body.member,
        restaurant: body.restaurant,
        name: body.name,
        introduction: body.introduction,
        deadline: body.deadline,
        points: body.points,
        status: body.status
    };
};

// 특정 회원의 memberMission 목록 응답 DTO
export const responseFromMemberMissions = (memberMissions) => {
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

// mission 응답 DTO
export const responseFromMission = ({mission, member}) => {
    console.log(member.name);
    return {
        id: mission.id,
        member: member.name,
        restaurant: mission.restaurant.name,
        name: mission.name,
        introduction: mission.introduction,
        deadline: mission.deadline,
        points: mission.points,
        status: mission.status
    }
}

// mission 목록 응답 DTO
export const responseFromMissions = (missions) => {
    return {
        data: missions.map(mission => ({
            id: mission.id,
            restaurant: mission.restaurant.name,
            name: mission.name,
            introduction: mission.introduction,
            points: mission.points,
            status: mission.status,
            deadline: mission.deadline
        })),
        pagination: {
            cursor: missions.length ? missions[missions.length - 1].id : null 
            // 다음 페이지를 요청할 때 필요한 위치 표시, 배열이 비어있을 경우 null 처리
        }
    }
}

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