// review 요청 DTO
export const bodyToReview = (body) => {
    return {
        member: body.member,
        restaurant: body.restaurant,
        rating: body.rating,
        content: body.content
    };
};

// review 응답 DTO
export const responseFromReview = ({ review, restaurant, reviewWriter }) => {
    return {
        member: reviewWriter[0].member_name,
        restaurant: restaurant[0].restaurant_name,
        rating: review[0].rating,
        content: review[0].content
    };
};