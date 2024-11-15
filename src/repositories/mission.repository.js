import { pool, prisma } from "../db.config.js";
import { ServerError } from "../errors.js";
// 미션 데이터 삽입 (미션 등록) & 미션 ID 반환 
export const addMission = async(data) => {
    // const conn = await pool.getConnection();
    // try{
    //     const [confirm1] = await pool.query(
    //         `SELECT EXISTS(SELECT 1 FROM mission WHERE restaurant_id = ? and mission_name = ? and introduction = ?) as isExistMission;`,
    //         [data.restaurant, data.name, data.introduction]
    //     );
    //     // if (confirm1[0].isExistMission){
    //     //     return null;
    //     // }
    //     const [confirm2] = await pool.query(
    //         `SELECT EXISTS(SELECT 1 FROM restaurant WHERE id = ?) as isExistRestaurant;`,
    //         data.restaurant
    //     );
    //     if (confirm1[0].isExistMission || (!confirm2[0].isExistRestaurant)){
    //         return null;
    //     }
    //     const [result] = await pool.query(
    //         `INSERT INTO mission (restaurant_id, mission_name, introduction, deadline, points) VALUES (?, ?, ?, ?, ?);`,
    //         [data.restaurant, data.name, data.introduction, data.deadline, data.points]
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
    try{
        // 등록하려는 식당 ID, 미션 이름, 미션 내용과 모두 일치하는 중복 미션이 존재하는지 확인
        const mission = await prisma.mission.findFirst({
            where: {
                restaurantId: data.restaurant, 
                name: data.name, 
                introduction: data.introduction
            }
        });
        // 등록하려는 식당이 존재하는지 확인
        const restaurant = await prisma.restaurant.findFirst({
            where: {
                id: data.restaurant
            }
        });
        // 등록할 식당이 존재하지 않을 경우
        if (restaurant == null){  
            return null;
        }
        // 중복 미션이 있을 경우
        if (mission != null) {
            return -1;
        }
        const created = await prisma.mission.create({ // 미션 생성
            data: { // 생성할 데이터 객체
                ...data, // 매개변수로 전달 받은 data 객체의 모든 속성을 복사한다.
                restaurant: {
                    connect: { id: data.restaurant } // restaurant 테이블과 관계 연결
                }
            }
        });
        return created.id; // 생성된 미션 ID 반환
    }
    catch(err){
        throw new ServerError(`서버 내부 오류: ${err.stack}`);
    }
}

// 미션 ID로 미션 조회
export const getMission = async(missionId) => {
    // const conn = await pool.getConnection();
    // try{
    //     const[mission] = await pool.query(
    //         `SELECT * FROM mission WHERE id = ?`,
    //         missionId
    //     );
    //     console.log(mission);
    //     if (mission.length == 0){
    //         return null;
    //     }
    //     return mission;
    // }catch (err){
    //     throw new Error(`
    //         🚫 오류 발생 🚫 
    //         요청 파라미터 확인 바람 (${err})
    //     `);
    // }finally{
    //     conn.release();
    // }
    try{
        const mission = await prisma.mission.findFirstOrThrow({ 
            select: {
                id: true,
                restaurant: true,
                name: true,
                introduction: true,
                deadline: true,
                points: true,
                status: true
            },
            where: { id: missionId }});

        const formattedMission = {
            ...mission,
            id: mission.id.toString(),
            points: mission.points.toString(),
            restaurant: {
                id: mission.restaurant.id.toString(),
                name: mission.restaurant.name,
            },
        };
        console.log(formattedMission);
        return formattedMission;
    }
    catch(err){
        throw new ServerError(`서버 내부 오류: ${err.stack}`);
    }
}

// 미션 ID로 식당 조회
export const getRestaurantByMissionId = async(missionId) => {
    // const conn = await pool.getConnection();
    // try{
    //     const [restaurant] = await pool.query(`
    //         SELECT mi.id, mi.restaurant_id, rest.restaurant_name
    //         FROM mission mi JOIN restaurant rest ON mi.restaurant_id = rest.id
    //         WHERE mi.id = ?`,
    //         missionId
    //     );
    //     return restaurant;
    // }catch(err){
    //     throw new Error(`
    //         🚫 오류 발생 🚫 
    //         요청 파라미터 확인 바람 (${err})
    //     `);
    // }finally{
    //     conn.release();
    // }
}

// 특정 미션 상태 업데이트(진행 X -> 진행 중)
export const updateMissionStatus = async(missionId) => {
    // const conn = await pool.getConnection();
    // try{
    //     const [confirm1] = await pool.query(
    //         `SELECT EXISTS(SELECT 1 FROM mission WHERE id = ?) as isExistMission;`,
    //         missionId
    //     );
    //     const [confirm2] = await pool.query(
    //         `SELECT status FROM mission WHERE id = ?`,
    //         missionId
    //     );
    //     if((!confirm1[0].isExistMission) || (confirm2[0].status != 0)){
    //         return null;
    //     }
    //     await pool.query(`
    //         UPDATE mission SET status = 1 WHERE id = ?;`,
    //         missionId
    //     );
    //     const [mission] = await pool.query(`
    //         SELECT * FROM mission WHERE id = ?;`,
    //         missionId
    //     )
    //     return mission;
    // }catch(err){
    //     throw new Error(`
    //         🚫 오류 발생 🚫 
    //         요청 파라미터 확인 바람 (${err})
    //     `);
    // }finally{
    //     conn.release();
    // }
    try{
        // 업데이트할 미션이 존재하는지 확인
        const mission = await prisma.mission.findFirst({
            where: {
                id: missionId
            }
        });
        // 해당 미션의 상태를 확인하기 위해 status 선택
        const missionStatus = await prisma.mission.findFirst({
            select: {
                status: true
            },
            where: {
                id: missionId
            }
        });
        // 해당 미션이 존재하지 않을 경우
        if (mission == null){
            return -1;
        }
        // 상태가 진행 X가 아닐 경우
        if (missionStatus.status != 0){
            return null;
        }
        const missionUpdated = await prisma.mission.update({
            where: {
                id: missionId
            },
            data: {
                status: 1 // status 값을 1(진행 중)로 변경
            },
            select: {
                id: true, 
                restaurant: true,
                name: true,  
                introduction: true, 
                deadline: true, 
                points: true,
                status: true,
            }
        });
        const formattedMission = {
            ...missionUpdated,
            id: missionUpdated.id.toString(),
            points: missionUpdated.points.toString(),
            restaurant: {
                id: missionUpdated.restaurant.id.toString(),
                name: missionUpdated.restaurant.name
            },
        };

        return formattedMission;
    }
    catch(err){
        throw new ServerError(`서버 내부 오류: ${err.stack}`);
    }
}