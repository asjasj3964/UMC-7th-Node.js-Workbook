// src/services/member.dto.js
export const responseFromRestaurant = ({ restaurant, region, restaurantCeo }) => {
    return {
        ceoId: restaurantCeo[0].member_name,
        region: region[0].address,
        name: restaurant[0].restaurant_name,
        introduction: restaurant[0].introduction,
        startTime: restaurant[0].start_time,
        endTime: restaurant[0].end_time,
    } // 필요한 정보만
}
