// restaurant DTO
export const bodyToRestaurant = (body) => {
    return {
        ceoId: body.ceoId,
        region: body.region,
        name: body.name,
        introduction: body.introduction,
        startTime: body.startTime,
        endTime: body.endTime,
    };
};