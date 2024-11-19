import { getMember } from '../repositories/member.repository.js'
import { updateMemberMissionCompleted } from '../repositories/participated-mission.repository.js';
import { DuplicateError, CannotHandleError, NotExistError } from '../errors.js';
import { getMission } from '../repositories/mission.repository.js';
import { getFoodKind } from '../repositories/foodkind.repository.js';
import { registMemberMission } from '../repositories/participated-mission.repository.js';
import { responseFromMemberMission } from '../dtos/participated-mission.dto.js';
import { getMemberMission } from '../repositories/participated-mission.repository.js';

export const memberMissionRegist = async(data) => {
    // 해당 회원이 존재하지 않을 경우 에러 처리
    const confirmMember = await getMember(data.memberId);
    if (confirmMember === null){
        throw new NotExistError("존재하지 않는 회원", data);
    }
    // 해당 미션이 존재하지 않을 경우 에러 처리
    const confirmMission = await getMission(data.missionId);
    if (confirmMission === null){
        throw new NotExistError("존재하지 않는 미션", data);
    }
    // 마감기한이 현재 날짜 및 시간보다 이전일 경우 에러 처리
    const currentDateTime = new Date().toISOString(); // 현재 날짜 및 시간 (YYYY-MM-DDTHH:mm:ss.sssZ 형식)
    if (currentDateTime > confirmMission.deadline){ 
        throw new CannotHandleError("이미 종료된 미션", confirmMission); 
    }
    // 회원이 이미 할당 받은 미션일 경우 에러 처리
    const registMemberMissionId = await registMemberMission(data);
    if (registMemberMissionId == null){
        throw new DuplicateError("이미 참여한 미션", data);
    }
    const memberMission = await getMemberMission(registMemberMissionId);
    return responseFromMemberMission(memberMission);
}

export const memberMissionUpdateCompleted = async(participatedMissionId) => {
    // 해당 미션이 존재하지 않을 경우 에러 처리
    const confirmMemberMission = await getMemberMission(participatedMissionId);
    if (confirmMemberMission == null){
        throw new NotExistError("존재하지 않는 미션", {participatedMissionId: participatedMissionId});
    }
    if (confirmMemberMission.status != 0){
        throw new CannotHandleError("이미 완료된 미션", responseFromMemberMission(confirmMemberMission));
    }
    // 마감기한이 현재 날짜 및 시간보다 이전일 경우 에러 처리
    const currentDateTime = new Date().toISOString(); // 현재 날짜 및 시간 (YYYY-MM-DDTHH:mm:ss.sssZ 형식)
    console.log("deadline " + confirmMemberMission.mission.deadline);
    if (currentDateTime > confirmMemberMission.mission.deadline){ 
        throw new CannotHandleError("이미 종료된 미션", confirmMission); 
    }
    const memberMission = await updateMemberMissionCompleted(participatedMissionId);
    // 해당 회원에게 등록되어 있는 미션이 아닐 경우 에러 처리

    const updatedMemberMission = await getMemberMission(memberMission.id);
    return responseFromMemberMission(updatedMemberMission);
}