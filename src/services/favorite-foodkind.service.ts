import { responseFromFavoriteFoodKind } from "../dtos/favorite-foodkind.dto.ts";
import { NotExistError } from "../errors.ts";
import { deleteFavoriteFoodKind, getFavoriteFoodKindByMemberId, setFavoriteFoodKind } from "../repositories/favortie-foodkind.repository.ts";
import { getFoodKind } from "../repositories/foodkind.repository.ts";
import { getMember } from "../repositories/member.repository.ts";
import { BodyToFoodkindType } from "../types/foodkind.types.ts";

export const favoriteFoodKindUpdate = async(memberId: bigint, data: BodyToFoodkindType) => {
    const member = await getMember(memberId);
    if (member === null){
        throw new NotExistError("존재하지 않는 회원", {memberId: memberId}); 
    }
    for (const foodKindId of data.favoriteFoodKinds){
        const foodKind = await getFoodKind(foodKindId)
        if (foodKind === null){ 
            throw new NotExistError("존재하지 않는 음식 종류", data); 
        }   
    }
    console.log("회원 및 음식 종류 유효 검사 완료");
    await deleteFavoriteFoodKind(memberId);
    console.log("회원의 음식 종류 초기화 완료");
    for (const foodKindId of data.favoriteFoodKinds){
        await setFavoriteFoodKind(memberId, foodKindId); // favoriteFoodKinds 배열의 각 음식 종류를 회원 ID와 연결해 저장
    }
    console.log("회원 - 음식 종류 매핑 완료");
    const favoriteFoodKinds = await getFavoriteFoodKindByMemberId(memberId);
    return responseFromFavoriteFoodKind(favoriteFoodKinds);
}