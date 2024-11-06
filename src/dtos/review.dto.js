// review DTO
export const bodyToReview = (body) => {
    return {
        member: body.member,
        restaurant: body.restaurant,
        rating: body.rating,
        content: body.content
    };
};