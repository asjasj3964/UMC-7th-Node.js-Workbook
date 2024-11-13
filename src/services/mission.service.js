import { responseFromMission } from "../dtos/mission.dto.js";
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
        throw new Error("중복된 미션 또는 존재하지 않은 식당"); 
    }
    const mission = await getMission(registMissionId);
    const restaurant = await getRestaurantByMissionId(registMissionId);
    return responseFromMission({ mission, restaurant });
}

export const missionUpdateStatus = async(missionId) => {
    const mission = await updateMissionStatus(missionId);
    if (mission === null){
        throw new Error("도전할 수 없거나 존재하지 않은 미션"); 
    }
    const restaurant = await getRestaurantByMissionId(missionId);
    return responseFromMission({ mission, restaurant });
}
 