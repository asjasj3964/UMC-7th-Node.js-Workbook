// member 요청 DTO
export const bodyToMember = (body) => { 
    const birth = new Date(body.birth);
    return {
        name: body.name,
        nickname: body.nickname,
        gender: body.gender,
        birth: birth,
        location: body.location,
        email: body.email,
        phoneNumber: body.phoneNumber || "", // phoneNumber가 없으면 빈 문자열 전달
        favoriteFoodKinds: body.favoriteFoodKinds
    };
};

// member 응답 DTO
export const responseFromMember = ({member, favoriteFoodKinds}) => { 
    return {
        name: member.name,
        nickname: member.nickname,
        gender: member.gender,
        birth: member.birth,
        location: member.location,
        email: member.email,
        phoneNumber: member.phoneNumber || "", 
        favoriteFoodKinds: favoriteFoodKinds.map(foodKind => foodKind.foodKind.kind)
    } // 필요한 정보만 추출해서 전송
}

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