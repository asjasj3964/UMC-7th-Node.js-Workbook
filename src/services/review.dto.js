export const responseFromReview = ({ review, restaurant, reviewWriter }) => {
    return {
        member: reviewWriter[0].member_name,
        restaurant: restaurant[0].restaurant_name,
        rating: review[0].rating,
        content: review[0].content
    };
};