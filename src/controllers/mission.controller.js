import { StatusCodes } from "http-status-codes";
import { bodyToMission } from "../dtos/mission.dto.js";
import { missionRegist, missionUpdateStatus } from "../services/mission.service.js";

// 미션 등록 핸들러
export const handlerMissionRegist = async(req, res, next) => {
    console.log("리뷰 등록");
    console.log("body: ", req.body);
    const mission = await missionRegist(bodyToMission(req.body));
    res.status(StatusCodes.OK).json({ result: mission });
}

// 미션 상태 업데이트 핸들러
export const handlerMissionUpdateStatus = async(req, res, next) => {
    console.log("미션 업데이트");
    const missionId = req.params.id;
    const updateMission = await missionUpdateStatus(missionId);
    res.status(StatusCodes.OK).json({ result: updateMission });
}
 