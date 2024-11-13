import { pool, prisma } from "../db.config.js"

// 식당 데이터 삽입 (식당 등록) & 식당 ID 반환 
export const addRestaurant = async(data) => {
    // const conn = await pool.getConnection();
    // try{
    //     // 해당 위치의 식당(중복된 식당)의 사용자가 있는지 확인
    //     const [confirm] = await pool.query(
    //         `SELECT EXISTS(SELECT 1 FROM restaurant WHERE region_id = ? and restaurant_name = ?) as isExistRestaurant`, 
    //         [data.region, data.name] 
    //     );
    //     if (confirm[0].isExistRestaurant) {
    //         return null;
    //     }
    //     const [result] = await pool.query(
    //         `INSERT INTO restaurant (ceo_id, region_id, restaurant_name, introduction, start_time, end_time) VALUES (?, ?, ?, ?, ?, ?);`,
    //         [
    //             data.ceo,
    //             data.region,
    //             data.name,
    //             data.introduction,
    //             data.startTime,
    //             data.endTime,
    //         ]
    //     );
    //     return result.insertId;
    // }catch(err){
    //     throw new Error(`
    //         🚫 오류 발생 🚫 
    //         요청 파라미터 확인 바람 (${err})
    //     `);
    // }finally{
    //     conn.release();
    // }

    const restaurant = await prisma.restaurant.findFirst({where: {name: data.name, regionId: data.regionId}});
    if (restaurant){
        return null;
    }
    const created = await prisma.restaurant.create({
        data: {
            ...data,
            region: {
                connect: { id: data.region } // region 연결
            },
            ceo: {
                connect: { id: data.ceo }
            }, 
        }
    });
    return created.id;
}

// 식당 ID로 식당 조회
export const getRestaurant = async(restaurantId) => {
    // const conn = await pool.getConnection();
    // try{
    //     const [restaurant] = await pool.query(
    //         `SELECT * FROM restaurant WHERE id = ?`,
    //         restaurantId
    //     )
    //     console.log(restaurant);
    //     if (restaurant.length == 0){
    //         return null;
    //     }
    //     return restaurant;
    // }catch (err){
    //     throw new Error(`
    //         🚫 오류 발생 🚫 
    //         요청 파라미터 확인 바람 (${err})
    //     `);
    // }finally{
    //     conn.release();
    // }
    const restaurant = await prisma.restaurant.findFirstOrThrow({ 
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
        const formattedRestaurant = {
            ...restaurant,
            id: restaurant.id.toString(),
            region: {
                id: restaurant.region.id.toString(),
                address: restaurant.region.address,
            },
            ceo: {
                id: restaurant.ceo.id.toString(),
                name: restaurant.ceo.name.toString()
            }
        };
    return formattedRestaurant;
}

// 식당 - 지역 반환
export const getrestaurantRegionByRestaurantId = async (restaurantId) => {
    const conn = await pool.getConnection();
    try{
        const [region] = await pool.query(`
            SELECT rest.id, rest.region_id, re.address
            FROM restaurant rest JOIN region re ON rest.region_id = re.id
            WHERE rest.id = ?`,
            restaurantId
        );
        return region;
    }catch(err){
        throw new Error(`
            🚫 오류 발생 🚫 
            요청 파라미터 확인 바람 (${err})
        `);
    }finally{
        conn.release();
    }
}

// CEO ID로 식당의 CEO의 이름 알아내기
export const getrestaurantCeoByCeoId = async (restaurantCeoId) => {
    const conn = await pool.getConnection();
    try{
        const [restaurantCeo] = await pool.query(`
            SELECT rest.id, rest.ceo_id, mem.member_name
            FROM restaurant rest JOIN member mem ON rest.ceo_id = mem.id
            WHERE rest.ceo_id = ?`,
            restaurantCeoId
        );
        return restaurantCeo;
    }catch(err){
        throw new Error(`
            🚫 오류 발생 🚫 
            요청 파라미터 확인 바람 (${err})
        `);
    }finally{
        conn.release();
    }
}

// 특정 식당의 모든 리뷰 조회
export const getAllRestaurantReviews = async (restaurantId, cursor) => {
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
            id: review.member.id.toString(),
            name: review.member.name,
            nickname: review.member.nickname,
            birth: review.member.birth,
            gender: review.member.gender,
            location: review.member.location,
            phoneNumber: review.member.phoneNumber
        },
        restaurant: {
            id: review.restaurant.id.toString(),
            name: review.restaurant.name
        },
    }));

    return formattedReviews;
}

// 특정 식당의 모든 미션 조회
export const getAllRestaurantMissions = async(restaurantId, cursor) => {
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
        points: mission.points.toString(),
        restaurant: {
            id: mission.restaurant.id.toString(),
            name: mission.restaurant.name
        },
    }));

    return formattedMissions;
}