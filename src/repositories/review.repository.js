import { prisma, pool } from "../db.config.js";

// 리뷰 데이터 삽입 (리뷰 등록) & 리뷰 ID 반환
export const addReview = async(data) => {
    // const conn = await pool.getConnection();
    // try{
    //     // 리뷰를 추가하려는 식당이 존재하는지 검증
    //     const [confirm] = await pool.query(
    //         `SELECT EXISTS(SELECT 1 FROM restaurant WHERE id = ?)as isExistRestaurant;`,
    //         data.restaurant
    //     );
    //     if (!confirm[0].isExistRestaurant){
    //         return null;
    //     }
    //     const [result] = await pool.query(
    //         `INSERT INTO review (member_id, restaurant_id, rating, content) VALUES (?, ?, ?, ?);`,
    //         [
    //             data.member,
    //             data.restaurant, 
    //             data.rating,
    //             data.content
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

    // 리뷰를 추가하려는 식당이 존재하는지 검증
    const restaurant = await prisma.restaurant.findFirst( {
        where: {
            id: data.restaurant // 등록할 식당의 ID를 가진 가게가 있는지 확인
        }
    })
    if (restaurant == null){ // 해당 식당이 존재하지 않다면
        return null;
    } 
    const created = await prisma.review.create({
        data: {
            ...data,
            member: {
                connect: { // member 테이블과 관계 연결
                    id: data.member
                }
            },
            restaurant:{
                connect: { // restaurant 테이블과 관계 연결
                    id: data.restaurant
                }
            }
        }
    });
    return created.id;
}

// 리뷰 ID로 리뷰 조회
export const getReview = async(reviewId) => {
    // const conn = await pool.getConnection();
    // try{
    //     const[review] = await pool.query(
    //         `SELECT * FROM review WHERE id = ?`,
    //         reviewId
    //     )
    //     console.log(review);
    //     if (review.length == 0){
    //         return null;
    //     }
    //     return review;
    // }catch (err){
    //     throw new Error(`
    //         🚫 오류 발생 🚫 
    //         요청 파라미터 확인 바람 (${err})
    //     `);
    // }finally{
    //     conn.release();
    // }
    
    const review = await prisma.review.findFirstOrThrow({
        select: {
            id: true,
            member: true,
            restaurant: true,
            rating: true,
            content: true,
            createdAt: true,
            status: true
        },
        where: {
            id: reviewId
        }
    });
    const formattedReview = {
        ...review,
        id: review.id.toString(),
        member: {
            id: review.member.id.toString(),
            name: review.member.name,
        },
        restaurant: {
            id: review.restaurant.id.toString(),
            name: review.restaurant.name,
        },
    }
    return formattedReview;
}

// 리뷰 ID로 리뷰 등록한 식당의 이름 알아낸기
export const getReviewRestaurantByReviewId = async(reviewId) => {
    const conn = await pool.getConnection();
    try{
        const [review] = await pool.query(`
            SELECT re.id, re.restaurant_id, rest.restaurant_name
            FROM review as re JOIN restaurant rest ON re.restaurant_id = rest.id
            WHERE re.id = ?`,
            reviewId
        );
        return review;
    }catch(err){
        throw new Error(`
            🚫 오류 발생 🚫 
            요청 파라미터 확인 바람 (${err})
        `);
    }finally{
        conn.release();
    }
}

// 리뷰 작성자 ID로 작성자의 이름 알아내기
export const getReviewWriterByWriterId = async(reviewWriterId) => {
    const conn = await pool.getConnection();
    try{
        const [reviewWriter] = await pool.query(`
            SELECT re.id, re.member_id, mem.member_name
            FROM review as re JOIN member mem ON re.member_id = mem.id
            WHERE re.member_id = ?`,
            reviewWriterId
        );
        return reviewWriter;
    }catch(err){
        throw new Error(`
            🚫 오류 발생 🚫 
            요청 파라미터 확인 바람 (${err})
        `);
    }finally{
        conn.release();
    }
}