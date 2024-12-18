import { prisma } from "../db.config.js";
import { ServerError } from "../errors.js";

// 특정 음식 종류 조회
export const getFoodKind = async(foodKindId) => {
    try{
        // 음식 종류 ID로 조회했을 때 해당 음식 종류가 존재하는지 확인
        const foodkind = await prisma.foodKind.findFirst({where: {id: foodKindId}}); 
        if (foodkind == null){ // 해당 음식 종류가 없다면
            return null;
        }
        return foodkind;
    }
    catch(err){
        throw new ServerError(`서버 내부 오류: ${err.stack}`);
    }
};