import { pool } from "../db.config.js"

// 식당 데이터 삽입 (식당 등록) & 식당 ID 반환
export const addRestaurant = async(data) => {
    const conn = await pool.getConnection();
    try{
        // 해당 위치의 식당(중복된 식당)의 사용자가 있는지 확인
        const [confirm] = await pool.query(
            `SELECT EXISTS(SELECT 1 FROM restaurant WHERE region_id = ? and restaurant_name = ?) as isExistRestaurant`, 
            [data.region, data.name] 
        );
        if (confirm[0].isExistRestaurant) { // 중복된 식당일 경우
            return null;
        }
        // 식당 생성
        const [result] = await pool.query(
            `INSERT INTO restaurant (ceo_id, region_id, restaurant_name, introduction, start_time, end_time) VALUES (?, ?, ?, ?, ?, ?);`,
            [
                data.ceoId,
                data.region,
                data.name,
                data.introduction,
                data.startTime,
                data.endTime,
            ]
        ); // 식당 데이터 삽입
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

// 식당 ID로 식당 조회
export const getRestaurant = async(restaurantId) => {
    const conn = await pool.getConnection();
    try{
        const [restaurant] = await pool.query(
            `SELECT * FROM restaurant WHERE id = ?`,
            restaurantId
        )
        console.log(restaurant);
        if (restaurant.length == 0){
            return null;
        }
        return restaurant;
    }catch (err){
        throw new Error(`
            🚫 오류 발생 🚫 
            요청 파라미터 확인 바람 (${err})
        `);
    }finally{
        conn.release();
    }
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
        ); // restaurant 테이블과 region 테이블을 join해 해당 식당의 위치 정보를 조회한다. 
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

// 식당 ceo 반환
export const getrestaurantCeoByCeoId = async (restaurantCeoId) => {
    const conn = await pool.getConnection();
    try{
        const [restaurantCeo] = await pool.query(`
            SELECT rest.id, rest.ceo_id, mem.member_name
            FROM restaurant rest JOIN member mem ON rest.ceo_id = mem.id
            WHERE rest.ceo_id = ?`,
            restaurantCeoId
        ); // restaurant 테이블과 member 테이블을 join해 해당 식당의 CEO(회원) 정보를 조회한다.
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