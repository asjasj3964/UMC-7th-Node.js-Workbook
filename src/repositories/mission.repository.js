import { pool } from "../db.config.js";

// 미션 데이터 삽입 (미션 등록) & 미션 ID 반환 
export const addMission = async(data) => {
    const conn = await pool.getConnection();
    try{
        // 등록하려는 식당 ID, 미션 이름, 미션 내용과 모두 일치하는 중복 미션이 존재하는지 확인
        const [confirm1] = await pool.query(
            `SELECT EXISTS(SELECT 1 FROM mission WHERE restaurant_id = ? and mission_name = ? and introduction = ?) as isExistMission;`,
            [data.restaurant, data.name, data.introduction]
        );
        // 등록하려는 식당이 존재하는지 확인
        const [confirm2] = await pool.query(
            `SELECT EXISTS(SELECT 1 FROM restaurant WHERE id = ?) as isExistRestaurant;`,
            data.restaurant
        );
        // 중복 미션이 있거나 식당이 존재하지 않을 시
        if (confirm1[0].isExistMission || (!confirm2[0].isExistRestaurant)){
            return null;
        }
        // 미션 생성
        const [result] = await pool.query( 
            `INSERT INTO mission (restaurant_id, mission_name, introduction, deadline, points) VALUES (?, ?, ?, ?, ?);`,
            [data.restaurant, data.name, data.introduction, data.deadline, data.points]
        ); // 미션 데이터 삽입
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

// 미션 ID로 미션 조회
export const getMission = async(missionId) => {
    const conn = await pool.getConnection();
    try{
        const[mission] = await pool.query(
            `SELECT * FROM mission WHERE id = ?`,
            missionId
        );
        console.log(mission);
        if (mission.length == 0){
            return null;
        }
        return mission;
    }catch (err){
        throw new Error(`
            🚫 오류 발생 🚫 
            요청 파라미터 확인 바람 (${err})
        `);
    }finally{
        conn.release();
    }
}

// 미션 ID로 식당 조회
export const getRestaurantByMissionId = async(missionId) => {
    const conn = await pool.getConnection();
    try{
        const [restaurant] = await pool.query(`
            SELECT mi.id, mi.restaurant_id, rest.restaurant_name
            FROM mission mi JOIN restaurant rest ON mi.restaurant_id = rest.id
            WHERE mi.id = ?`,
            missionId
        ); // mission 테이블과 restaurant 테이블을 join해 해당 회원의 식당 정보를 조회한다. 
        return restaurant;
    }catch(err){
        throw new Error(`
            🚫 오류 발생 🚫 
            요청 파라미터 확인 바람 (${err})
        `);
    }finally{
        conn.release();
    }
}

// 특정 미션 상태 업데이트(진행 X -> 진행 중)
export const updateMissionStatus = async(missionId) => {
    const conn = await pool.getConnection();
    try{
        // 업데이트할 미션이 존재하는지 미션 ID로 조회하여 확인
        const [confirm1] = await pool.query(
            `SELECT EXISTS(SELECT 1 FROM mission WHERE id = ?) as isExistMission;`,
            missionId
        );
        // 해당 미션의 상태를 확인하기 위해 status 선택
        const [confirm2] = await pool.query(
            `SELECT status FROM mission WHERE id = ?`,
            missionId
        );
        // 해당 미션이 존재하지 않거나 상태가 진행 X가 아닐 경우
        if((!confirm1[0].isExistMission) || (confirm2[0].status != 0)){
            return null;
        }
        // 해당 미션의 status 값을 1(진행 중)로 변경
        await pool.query(`
            UPDATE mission SET status = 1 WHERE id = ?;`,
            missionId
        );
        // 미션 ID로 조회해서 해당 미션 정보를 모두 조회한다.
        const [mission] = await pool.query(`
            SELECT * FROM mission WHERE id = ?;`,
            missionId
        )
        return mission;
    }catch(err){
        throw new Error(`
            🚫 오류 발생 🚫 
            요청 파라미터 확인 바람 (${err})
        `);
    }finally{
        conn.release();
    }
}
 