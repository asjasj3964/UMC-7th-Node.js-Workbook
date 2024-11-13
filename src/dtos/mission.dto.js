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

// mission 응답 DTO
export const responseFromMission = ({mission, restaurant}) => {
    return {
        restaurant: restaurant[0].restaurant_name,
        name: mission[0].name,
        introduction: mission[0].introduction,
        deadline: mission[0].deadline,
        points: mission[0].points,
        status: mission[0].status
    }
}