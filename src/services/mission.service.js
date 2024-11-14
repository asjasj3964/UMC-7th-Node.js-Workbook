import { addMission, getMission, getRestaurantByMissionId, updateMissionStatus } from "../repositories/mission.repository.js";
import { responseFromMission } from "../dtos/mission.dto.js";
import { NotExistError, CannotHandleError, DuplicateError } from "../errors.js";

export const missionRegist = async(data) => {
    const registMissionId = await addMission({
        restaurant: data.restaurant,
        name: data.name,
        introduction: data.introduction,
        deadline: data.deadline,
        points: data.points
    })

    console.log(registMissionId);
    if (registMissionId === null){
        throw new NotExistError("존재하지 않은 식당", { restaurantId: data.restaurant}); // 동일한 식당을 등록하는 것을 방지
    }
    if (registMissionId === -1){
        throw new DuplicateError("중복된 미션", data); // 동일한 식당을 등록하는 것을 방지
    }
    const mission = await getMission(registMissionId);
    //const restaurant = await getRestaurantByMissionId(registMissionId);
    // return responseFromMission({ mission, restaurant });
    return responseFromMission(mission);
}

export const missionUpdateStatus = async(missionId) => {
    const mission = await updateMissionStatus(missionId);
    if (mission === null){
        const cannotChallengeMission = await getMission(missionId);
        throw new CannotHandleError("도전할 수 없는 미션", cannotChallengeMission); 
    }
    if (mission === -1){
        throw new NotExistError("존재하지 않는 미션", { missionId: missionId }); 
    }
    // const restaurant = await getRestaurantByMissionId(missionId);
    return responseFromMission(mission);
}
 