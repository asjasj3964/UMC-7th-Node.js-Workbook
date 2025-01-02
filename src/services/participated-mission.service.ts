import { getMember } from '../repositories/member.repository.ts'
import { updateMemberMissionCompleted, registMemberMission, getMemberMission, getAllMemberMissions } from '../repositories/participated-mission.repository.ts';
import { DuplicateError, CannotHandleError, NotExistError } from '../errors.ts';
import { getMission } from '../repositories/mission.repository.ts';
import { responseFromMemberMission, responseFromMemberMissions } from '../dtos/participated-mission.dto.ts';
import { BodyToGetMissionType } from '../types/mission.types.ts';
import { BodyToMemberMission } from '../types/member-mission.types.ts';

export const memberMissionRegist = async(memberId: bigint, data: BodyToMemberMission) => {
    // 해당 회원이 존재하지 않을 경우 에러 처리
    const confirmMember = await getMember(memberId);
    if (confirmMember === null){
        throw new NotExistError("존재하지 않는 회원", { memberId: memberId });
    }
    // 해당 미션이 존재하지 않을 경우 에러 처리
    const confirmMission = await getMission(data.missionId);
    if (confirmMission === null){
        throw new NotExistError("존재하지 않는 미션", data);
    }
    // 마감기한이 현재 날짜 및 시간보다 이전일 경우 에러 처리
    const currentDateTime = new Date().toISOString(); // 현재 날짜 및 시간 (YYYY-MM-DDTHH:mm:ss.sssZ 형식)
    if (currentDateTime > confirmMission.deadline.toISOString()){ 
        throw new CannotHandleError("이미 종료된 미션", confirmMission); 
    }
    // 회원이 이미 할당 받은 미션일 경우 에러 처리
    const registMemberMissionId = await registMemberMission(memberId, data);
    if (registMemberMissionId == null){
        throw new DuplicateError("이미 참여한 미션", data);
    }
    const memberMission = await getMemberMission(registMemberMissionId);
    return responseFromMemberMission(memberMission);
}

export const listMemberMissions = async(memberId: bigint, cursor: number) => {
    // 해당 회원이 존재하지 않을 경우 에러 처리
    const member = await getMember(memberId);
    if (member === null){
        throw new NotExistError("존재하지 않는 회원", { memberId: memberId });
    }
    const missions = await getAllMemberMissions(memberId, cursor);
    return responseFromMemberMissions(missions);
}

export const memberMissionUpdateCompleted = async(memberId: bigint, participatedMissionId: bigint) => {
    // 회원이 참여하지 않은 미션일 경우 에러 처리
    const confirmMemberMission = await getMemberMission(participatedMissionId);
    if (confirmMemberMission == null || confirmMemberMission.member.id != memberId.toString()){
        throw new NotExistError("회원이 참여하지 않은 미션", {participatedMissionId: participatedMissionId});
    }
    // 이미 완료한 미션일 경우 에러 처리
    if (confirmMemberMission.status != 0){
        throw new CannotHandleError("이미 완료된 미션", responseFromMemberMission(confirmMemberMission));
    }
    // 마감기한이 현재 날짜 및 시간보다 이전일 경우 에러 처리
    const currentDateTime = new Date().toISOString(); // 현재 날짜 및 시간 (YYYY-MM-DDTHH:mm:ss.sssZ 형식)
    console.log("deadline " + confirmMemberMission.mission.deadline);
    if (currentDateTime > confirmMemberMission.mission.deadline.toISOString()){ 
        throw new CannotHandleError("이미 종료된 미션", { deadline: confirmMemberMission.mission.deadline }); 
    }
    await updateMemberMissionCompleted(participatedMissionId);
    const updatedMemberMission = await getMemberMission(participatedMissionId);
    return responseFromMemberMission(updatedMemberMission);
}