import { pool } from "../db.config.js";

// 리뷰 데이터 삽입 (리뷰 등록) & 리뷰 ID 반환
export const addReview = async(data) => {
    const conn = await pool.getConnection();
    try{
        // 리뷰를 추가하려는 가게가 존재하는지 검증
        const [confirm] = await pool.query(
            `SELECT EXISTS(SELECT 1 FROM restaurant WHERE id = ?)as isExistRestaurant;`,
            data.restaurant
        );
        if (!confirm[0].isExistRestaurant){ // 등록하려는 식당이 존재하지 않을 경우
            return null;
        }
        // 리뷰 생성
        const [result] = await pool.query(
            `INSERT INTO review (member_id, restaurant_id, rating, content) VALUES (?, ?, ?, ?);`,
            [
                data.member,
                data.restaurant, 
                data.rating,
                data.content
            ]
        ); // 리뷰 데이터 삽입
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

// 리뷰 ID로 리뷰 조회
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

// 리뷰 ID로 리뷰 등록한 식당의 이름 알아내기
export const getReviewRestaurantByReviewId = async(reviewId) => {
    const conn = await pool.getConnection();
    try{
        const [review] = await pool.query(`
            SELECT re.id, re.restaurant_id, rest.restaurant_name
            FROM review as re JOIN restaurant rest ON re.restaurant_id = rest.id
            WHERE re.id = ?`,
            reviewId
        ); // review 테이블과 restaurant 테이블을 join해 해당 리뷰의 식당 정보를 조회한다.
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
        ); // review 테이블과 member 테이블을 join해 해당 리뷰의 작성자(회원) 정보를 조회한다.
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