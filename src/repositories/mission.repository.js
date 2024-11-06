import { pool } from "../db.config.js";

export const addMission = async(data) => {
    const conn = await pool.getConnection();
    try{
        const [confirm1] = await pool.query(
            `SELECT EXISTS(SELECT 1 FROM mission WHERE restaurant_id = ? and mission_name = ? and introduction = ?) as isExistMission;`,
            [data.restaurant, data.name, data.introduction]
        );
        // if (confirm1[0].isExistMission){
        //     return null;
        // }
        const [confirm2] = await pool.query(
            `SELECT EXISTS(SELECT 1 FROM restaurant WHERE id = ?) as isExistRestaurant;`,
            data.restaurant
        );
        if (confirm1[0].isExistMission || (!confirm2[0].isExistRestaurant)){
            return null;
        }
        const [result] = await pool.query(
            `INSERT INTO mission (restaurant_id, mission_name, introduction, deadline, points) VALUES (?, ?, ?, ?, ?);`,
            [data.restaurant, data.name, data.introduction, data.deadline, data.points]
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

export const getRestaurantByMissionId = async(missionId) => {
    const conn = await pool.getConnection();
    try{
        const [restaurant] = await pool.query(`
            SELECT mi.id, mi.restaurant_id, rest.restaurant_name
            FROM mission mi JOIN restaurant rest ON mi.restaurant_id = rest.id
            WHERE mi.id = ?`,
            missionId
        );
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

export const updateMissionStatus = async(missionId, data) => {
    console.log(`missionId: ${missionId} data.status: ${data.status}`);
    const conn = await pool.getConnection();
    try{
        const [confirm1] = await pool.query(
            `SELECT EXISTS(SELECT 1 FROM mission WHERE id = ?) as isExistMission;`,
            missionId
        );
        const [confirm2] = await pool.query(
            `SELECT status FROM mission WHERE id = ?`,
            missionId
        );
        if((!confirm1[0].isExistMission) || (confirm2[0].status != 0)){
            return null;
        }
        await pool.query(`
            UPDATE mission SET status = ? WHERE id = ?;`,
            [data.status, missionId]
        );
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
 