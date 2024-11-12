import { pool, prisma } from "../db.config.js";

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
    const mission = await prisma.mission.findFirst({where: {restaurantId: data.restaurant, name: data.name, introduction: data.introduction}});
    console.log(data);
    const restaurant = await prisma.restaurant.findFirst({where: {id: data.restaurant}})
    if (mission != null || restaurant == null){
        return null;
    }
    const created = await prisma.mission.create({
        data: {
            ...data,
            restaurant: {
                connect: { id: data.restaurant } // restaurant 연결
            }
        }
    });
    console.log(created)
    return created.id;
}

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

export const updateMissionStatus = async(missionId) => {
    // console.log(`missionId: ${missionId} data.status: ${data.status}`);
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
    const mission = await prisma.mission.findFirst({
        where: {
            id: missionId
        }
    })

    const missionStatus = await prisma.mission.findFirst({
        select: {
            status: true
        },
        where: {
            id: missionId
        }
    })

    if (mission == null || missionStatus.status != 0){
        return null;
    }

    const missionUpdated = await prisma.mission.update({
        where: {
            id: missionId
        },
        data: {
            status: 1 // status 값을 1로 변경
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
    })

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