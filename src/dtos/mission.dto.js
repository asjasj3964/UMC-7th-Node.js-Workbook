// mission 요청 DTO
export const bodyToMission = (body) => { 
    return {
        restaurant: body.restaurant,
        name: body.name,
        introduction: body.introduction,
        deadline: body.deadline,
        points: body.points,
        status: body.status
    };
};

// // missionUpdateStatus DTO
// export const bodyToMissionUpdate = (body) => {
//     return {
//         status: body.status
//     }
// }

// mission 목록 응답 DTO
export const responseFromMissions = (missions) => {
    return {
        data: missions,
        pagination: {
            cursor: missions.length ? missions[missions.length - 1].id : null 
            // 다음 페이지를 요청할 때 필요한 위치 표시, 배열이 비어있을 경우 null 처리
        }
    }
}

// mission 응답 DTO
export const responseFromMission = (mission) => {
    return {
        // restaurant: mission.restaurant_name,
        // name: mission[0].mission_name,
        // introduction: mission[0].introduction,
        // deadline: mission[0].deadline,
        // points: mission[0].points,
        // status: mission[0].status
        data: mission
    }
}