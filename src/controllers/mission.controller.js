import { StatusCodes } from "http-status-codes";
import { bodyToMission, bodyToMissionUpdate } from "../dtos/mission.dto.js";
import { missionRegist, missionUpdateStatus } from "../services/mission.service.js";

// 미션 등록 핸들러
export const handlerMissionRegist = async(req, res, next) => {
    console.log("리뷰 등록");
    console.log("body: ", req.body);
    const mission = await missionRegist(bodyToMission(req.body));
    res.status(StatusCodes.OK).json({ result: mission });
}

export const handlerMissionUpdateStatus = async(req, res, next) => {
    console.log("미션 업데이트");
    console.log("body: ", req.body);
    const missionId = req.params.id;
    //console.log(`id: ${req.params.id}`);
    const updateMission = await missionUpdateStatus(missionId, bodyToMissionUpdate(req.body))
    res.status(StatusCodes.OK).json({ result: updateMission });
}
 