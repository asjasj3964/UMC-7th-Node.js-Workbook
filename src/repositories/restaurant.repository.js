import { prisma } from "../db.config.js"
import { ServerError } from "../errors.js";

// 식당 데이터 삽입 (식당 등록) & 식당 ID 반환 
export const addRestaurant = async(data) => {
    try{
        // 등록하고자 하는 식당의 이름과 위치가 같은 중복 식당이 존재하는지 확인
        const restaurant = await prisma.restaurant.findFirst({
            where: {
                name: data.name, 
                regionId: data.region
            }
        });
        if (restaurant){ // 중복 식당일 경우
            return null;
        }
        const created = await prisma.restaurant.create({
            data: {
                ...data,
                region: {
                    connect: { id: data.region } // region 테이블 관계 연결
                },
                ceo: {
                    connect: { id: data.ceo }  // ceo(member) 테이블 관계 연결
                }, 
            }
        });
        return created.id;
    }
    catch(err){
        throw new ServerError(`서버 내부 오류: ${err.stack}`);
    }
}

// 식당 ID로 식당 조회
export const getRestaurant = async(restaurantId) => {
    try{
        const restaurant = await prisma.restaurant.findFirst({ 
            select: {
                id: true,
                ceo: true,
                region: true,
                name: true,
                introduction: true, 
                startTime: true,
                endTime: true,
                totalRating: true,
            },
            where: { id: restaurantId }
        });
        // 해당 식당이 존재하지 않을 경우
        if (restaurant == null){
            return null;
        }
        const formattedRestaurant = {
            ...restaurant,
            id: restaurant.id.toString(),
            region: {
                ...restaurant.region,
                id: restaurant.region.id.toString(),
            },
            ceo: {
                ...restaurant.ceo,
                id: restaurant.ceo.id.toString(),
            }
        };
        return formattedRestaurant;
    }
    catch(err){
        throw new ServerError(`서버 내부 오류: ${err.stack}`);
    }
}

export const setRestaurantFoodKind = async(restaurantId, foodKindId) => {
    try{
        await prisma.foodKindRestaurant.create({
            data: {
                restaurantId: restaurantId,
                foodKindId, foodKindId,
            }
        });
    }
    catch(err){
        throw new ServerError(`서버 내부 오류: ${err.stack}`);
    }
}

export const getRestaurantFoodKindByRestaurantId = async(restaurantId) => {
    try{
        const foodkinds = await prisma.foodKindRestaurant.findMany({ // 여러 레코드 조회, 조건에 맞는 모든 레코드를 배열 형태로 반환
            select: { // 반환할 필드 명시
                id: true,
                restaurantId: true,
                foodKindId: true,
                foodKind: true, // 참조하는 foodKind 테이블
            },
            where: { restaurantId: restaurantId },
            orderBy: {foodKindId: "asc"}, // foodKindId 기준 오름차순 정렬
        });
        return foodkinds;
    }
    catch(err){
        throw new ServerError(`서버 내부 오류: ${err.stack}`);
    }
} 

// 특정 식당의 모든 리뷰 조회
export const getAllRestaurantReviews = async (restaurantId, cursor) => {
    try{
        const reviews = await prisma.review.findMany({ // Prisma ORM을 사용하여 review 테이블에서 여러 개의 레코드를 조회한다. 
            select: {
                id: true,
                member: true,
                restaurant: true,
                rating: true,
                createdAt: true,
                content: true,
                status: true
            },
            where: { restaurantId: restaurantId, id: { gt: cursor }},
            orderBy: { id: "asc"},
            take: 5,
        })
        const formattedReviews = reviews.map(review => ({
            ...review,
            id: review.id.toString(),
            member: {
                ...review.member,
                id: review.member.id.toString(),
            },
            restaurant: {
                ...review.restaurant,
                id: review.restaurant.id.toString(),
                ceoId: review.restaurant.ceoId.toString(),
                regionId: review.restaurant.regionId.toString(),
            },
        }));

        return formattedReviews;
    }
    catch(err){
        throw new ServerError(`서버 내부 오류: ${err.stack}`);
    }
}

// 특정 식당의 모든 미션 조회
export const getAllRestaurantMissions = async(restaurantId, cursor) => {
    try{
        const missions = await prisma.mission.findMany({
            select: {
                id: true,
                restaurant: true,
                points: true,
                name: true,
                introduction: true,
                status: true
            },
            where: { restaurantId: restaurantId, id: { gt: cursor }},
            orderBy: { id: "asc" },
            take: 5
        })
        const formattedMissions = missions.map(mission => ({
            ...mission,
            id: mission.id.toString(),
            points: mission.points,
            restaurant: {
                ...mission.restaurant,
                id: mission.restaurant.id.toString(),
                ceoId: mission.restaurant.ceoId.toString(),
                regionId: mission.restaurant.regionId.toString(),
            },
        }));

        return formattedMissions;
    }
    catch(err){
        throw new ServerError(`서버 내부 오류: ${err.stack}`);
    }
}