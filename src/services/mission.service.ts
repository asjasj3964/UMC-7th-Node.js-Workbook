import { addMission, getMission } from "../repositories/mission.repository.ts";
import { responseFromMission } from "../dtos/mission.dto.ts";
import { NotExistError, CannotHandleError, DuplicateError } from "../errors.ts";
import { getRestaurant } from "../repositories/restaurant.repository.ts";
import { BodyToMissionType } from "../types/mission.types.ts";

export const missionRegist = async(data: BodyToMissionType) => {
    // 해당 식당이 존재하지 않을 경우 에러 처리
    const confirmRestaurant = await getRestaurant(data.restaurantId);
    if (confirmRestaurant === null){
        throw new NotExistError("존재하지 않는 식당", data); 
    }
    const registMissionId = await addMission({
        restaurant: data.restaurantId,
        name: data.name,
        introduction: data.introduction,
        deadline: data.deadline,
        points: data.points
    })
    // 미션의 마감기한을 과거로 설정하였을 경우 에러 처리
    if (registMissionId === -2){
        throw new CannotHandleError("마감기한을 과거로 설정하였음", data); 
    }
    // 중복된 미션(동일한 식당, 미션명, 미션 설명, 마감기한)일 경우 에러 처리
    if (registMissionId === -1){
        throw new DuplicateError("중복된 미션", data); 
    }
    const mission = await getMission(registMissionId);
    return responseFromMission(mission);
}