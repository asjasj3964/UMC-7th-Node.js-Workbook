// import { responseFromFoodkind } from "../dtos/foodkind.dto.ts";
// import { DuplicateError } from "../errors.ts";
// import { getFoodKind } from "../repositories/foodkind.repository.ts";

// export const foodKindRegist = async(data) => {
//     const createFoodkindId = await getFoodKind({
//         name: data.name,
//     })
//     if (createFoodkindId === null) {
//         throw new DuplicateError("중복된 음식종류", data); 
//     }
//     const foodkind = await getFoodKind(createFoodkindId);
//     return responseFromFoodkind(foodkind);
// }