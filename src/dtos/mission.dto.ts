import { BodyToMissionType, MissionsType, MissionType } from "../types/mission.types.ts";

// mission 요청 DTO
export const bodyToMission = (body: BodyToMissionType) => { 
    return {
        //member: body.member,
        restaurantId: body.restaurantId,
        name: body.name,
        introduction: body.introduction,
        deadline: body.deadline,
        points: body.points,
    };
};

// mission 응답 DTO
export const responseFromMission = (mission: MissionType) => {
    return {
        id: mission!.id,
        restaurant: mission!.restaurant.name,
        name: mission!.name,
        introduction: mission!.introduction,
        deadline: mission!.deadline,
        points: mission!.points,
        status: mission!.status
    }
}

// mission 목록 응답 DTO
export const responseFromMissions = (missions: MissionsType) => {
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