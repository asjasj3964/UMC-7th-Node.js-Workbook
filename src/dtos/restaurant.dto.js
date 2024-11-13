// restaurant 요청 DTO
export const bodyToRestaurant = (body) => {
    return {
        ceo: body.ceo,
        region: body.region,
        name: body.name,
        introduction: body.introduction,
        startTime: body.startTime,
        endTime: body.endTime,
    };
};

// restaurant 응답 DTO
// export const responseFromRestaurant = ({ restaurant, region, restaurantCeo }) => {
//     return {
//         ceo: restaurantCeo[0].member_name,
//         region: region[0].address,
//         name: restaurant[0].restaurant_name,
//         introduction: restaurant[0].introduction,
//         startTime: restaurant[0].start_time,
//         endTime: restaurant[0].end_time,
//     } 
// }

// restaurant 응답 DTO
export const responseFromRestaurant = (restaurant) => {
    return {
        data: restaurant
    }
}