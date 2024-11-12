import { StatusCodes } from "http-status-codes";
//import { bodyToMission, bodyToMissionUpdate } from "../dtos/mission.dto.js";
import { bodyToMission } from "../dtos/mission.dto.js";
import { missionRegist, missionUpdateStatus } from "../services/mission.service.js";

// 미션 등록 핸들러
export const handleMissionRegist = async(req, res, next) => {
    console.log("미션 등록");
    console.log("body: ", req.body);
    const mission = await missionRegist(bodyToMission(req.body));
    res.status(StatusCodes.OK).json(mission);
}

// 미션 상태 업데이트 핸들러
export const handleMissionUpdateStatus = async(req, res, next) => {
    console.log("미션 업데이트");
    const missionId = req.params.id;
    const updateMission = await missionUpdateStatus(
        parseInt(missionId), 
        //bodyToMissionUpdate(req.body)
    )
    res.status(StatusCodes.OK).json(updateMission);
}
 