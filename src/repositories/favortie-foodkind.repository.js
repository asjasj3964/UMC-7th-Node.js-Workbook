import { prisma } from "../db.config.js";
import { ServerError } from "../errors.js";

// 음식 - 선호 음식 종류 매핑
export const setFavoriteFoodKind = async(memberId, favoriteFoodKindId) => {
    try{
        await prisma.memberFavoriteFoodKind.create({
            data:{ // 새 레코드의 필드와 값을 지정한다. 
                memberId: memberId,
                foodKindId: favoriteFoodKindId
            },
        });
    }
    catch(err){
        throw new ServerError(`서버 내부 오류: ${err.stack}`);
    }
};

export const deleteFavoriteFoodKind = async(memberId) => {
    try{
        await prisma.memberFavoriteFoodKind.deleteMany({
            where: {
                memberId: memberId
            }
        })
    }
    catch(err){
        throw new ServerError(`서버 내부 오류: ${err.stack}`);
    }
}

// 회원 - 선호 음식 종류 반환
export const getFavoriteFoodKindByMemberId = async (memberId) => {
    try{
        const favoriteFoodKinds = await prisma.memberFavoriteFoodKind.findMany({ // 여러 레코드 조회, 조건에 맞는 모든 레코드를 배열 형태로 반환
            select: { // 반환할 필드 명시
                id: true,
                memberId: true,
                foodKindId: true,
                foodKind: true, // 참조하는 foodKind 테이블
            },
            where: { memberId: memberId },
            orderBy: {foodKindId: "asc"}, // foodKindId 기준 오름차순 정렬
        });
        return favoriteFoodKinds;
    }
    catch(err){
        throw new ServerError(`서버 내부 오류: ${err.stack}`);
    }
}