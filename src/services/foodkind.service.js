import { responseFromFoodkind } from "../dtos/foodkind.dto.js";
import { DuplicateError } from "../errors.js";
import { getFoodKind } from "../repositories/foodkind.repository.js";


export const foodKindRegist = async(data) => {
    const createFoodkindId = await getFoodKind({
        name: data.name,
    })
    if (createFoodkindId === null) {
        throw new DuplicateError("중복된 음식종류", data); 
    }
    const foodkind = await getFoodKind(createFoodkindId);
    return responseFromFoodkind(foodkind);
}