import { pool } from "../db.config.js";

export const addReview = async(data) => {
    const conn = await pool.getConnection();
    try{
        // 리뷰를 추가하려는 가게가 존재하는지 검증
        const [confirm] = await pool.query(
            `SELECT EXISTS(SELECT 1 FROM restaurant WHERE id = ?)as isExistRestaurant;`,
            data.restaurant
        );
        if (!confirm[0].isExistRestaurant){
            return null;
        }
        const [result] = await pool.query(
            `INSERT INTO review (member_id, restaurant_id, rating, content) VALUES (?, ?, ?, ?);`,
            [
                data.member,
                data.restaurant, 
                data.rating,
                data.content
            ]
        );
        return result.insertId;
    }catch(err){
        throw new Error(`
            🚫 오류 발생 🚫 
            요청 파라미터 확인 바람 (${err})
        `);
    }finally{
        conn.release();
    }
}

export const getReview = async(reviewId) => {
    const conn = await pool.getConnection();
    try{
        const[review] = await pool.query(
            `SELECT * FROM review WHERE id = ?`,
            reviewId
        )
        console.log(review);
        if (review.length == 0){
            return null;
        }
        return review;
    }catch (err){
        throw new Error(`
            🚫 오류 발생 🚫 
            요청 파라미터 확인 바람 (${err})
        `);
    }finally{
        conn.release();
    }
}

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