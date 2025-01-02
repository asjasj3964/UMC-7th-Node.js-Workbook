import { BodyToFoodkindType } from "../types/foodkind.types.ts"
import { MemberFoodKindType } from "../types/member-foodkind.types.ts"

export const bodyToFavoriteFoodKind = (body: BodyToFoodkindType) => {
    return {
        favoriteFoodKinds: body.favoriteFoodKinds
    }
}

export const responseFromFavoriteFoodKind = (foodKinds: MemberFoodKindType) => {
    return {
        favoriteFoodKinds: foodKinds.map(foodKind => foodKind.foodKind.kind)
    }
}