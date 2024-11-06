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
 