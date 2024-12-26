export const bodyToFoodkind = (body) => {
    return {
        name: body.foodkindName,
    }
}

export const responseFromFoodkind = (data) => {
    return {
        id: data.id,
        name: data.name,

    }
}