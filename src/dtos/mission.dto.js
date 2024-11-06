// mission DTO
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

// missionUpdateStatus DTO
export const bodyToMissionUpdate = (body) => {
    return {
        status: body.status
    }
}
 