import { responseFromMission } from "./mission.dto.js";
import { addMission, getMission, getRestaurantByMissionId, updateMissionStatus } from "../repositories/mission.repository.js";

export const missionRegist = async(data) => {
    const registMissionId = await addMission({
        restaurant: data.restaurant,
        name: data.name,
        introduction: data.introduction,
        deadline: data.deadline,
        points: data.points
    })
    if (registMissionId === null){
        throw new Error("중복된 미션 또는 존재하지 않은 식당"); // 동일한 식당을 등록하는 것을 방지
    }
    const mission = await getMission(registMissionId);
    const restaurant = await getRestaurantByMissionId(registMissionId);
    return responseFromMission({ mission, restaurant });
}

export const missionUpdateStatus = async(missionId, data) => {
    console.log(`data: ${data.status} missionId: ${missionId}`);
    const mission = await updateMissionStatus(missionId, data);
    if (mission === null){
        throw new Error("도전할 수 없거나 존재하지 않은 미션"); 
    }
    console.log(`mission: ${mission}`);
    const restaurant = await getRestaurantByMissionId(missionId);
    console.log(`restaurant: ${restaurant}`);
    return responseFromMission({ mission, restaurant });
}
 