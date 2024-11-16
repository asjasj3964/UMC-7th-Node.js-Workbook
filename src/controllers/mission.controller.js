import { StatusCodes } from "http-status-codes";
import { bodyToMission } from "../dtos/mission.dto.js";
import { missionRegist } from "../services/mission.service.js";

// 미션 등록 핸들러
export const handleMissionRegist = async(req, res, next) => {
    console.log("미션 등록");
    console.log("body: ", req.body);
    const mission = await missionRegist(bodyToMission(req.body));
    res.status(StatusCodes.OK).success(mission);
}