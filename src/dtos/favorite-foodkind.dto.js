export const bodyToFavoriteFoodKind = (body) => {
    return {
        favoriteFoodKinds: body.favoriteFoodKinds
    }
}

export const responseFromFavoriteFoodKind = (foodKinds) => {
    return {
        favoriteFoodKinds: foodKinds.map(foodKind => foodKind.foodKind.kind)
    }
}