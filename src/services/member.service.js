import { responseFromMember } from '../dtos/member.dto.js';
import { addMember, getMember, getMemberFavoriteFoodKindByMemberId, getMemberMission, setFavoriteFoodKind } from '../repositories/member.repository.js'
import { responseFromReviews } from '../dtos/review.dto.js';
import { getAllMemberReviews, getAllMemberMissions } from '../repositories/member.repository.js';
import { responseFromMemberMissions } from '../dtos/mission.dto.js';
import { updateMemberMissionCompleted } from '../repositories/member.repository.js';
import { DuplicateError, CannotHandleError, NotExistError } from '../errors.js';
import { getMission } from '../repositories/mission.repository.js';
import { getFoodKind } from '../repositories/foodkind.repository.js';
import { registMemberMission } from '../repositories/member.repository.js';
import { responseFromMemberMission } from '../dtos/member.dto.js';

// 회원 추가 및 선호 음식 매핑, 유효하지 않은 데이터 에러 처리
export const memberSignUp = async(data) => {
    // 등록하려는 음식 종류가 존재하지 않을 경우 에러 처리
    for (const foodKindId of data.favoriteFoodKinds){
        const foodKind = await getFoodKind(foodKindId)
        if (foodKind === null){ 
            throw new NotExistError("존재하지 않는 음식 종류", data); 
        }
    }
    const joinMemberId = await addMember({ // 해당 데이터로 회원 생성 후 회원의 ID 반환
        name: data.name,
        nickname: data.nickname,
        gender: data.gender,
        birth: data.birth,
        location: data.location,
        email: data.email,
        phoneNumber: data.phoneNumber,
    });
    // 등록하려는 회원의 ID가 null일 경우 에러 처리
    if (joinMemberId === null){ 
        throw new DuplicateError("중복된 이메일", data); // 동일한 이메일로 여러 계정을 만드는 것을 방지
    }
    for (const favoriteFoodKind of data.favoriteFoodKinds){
        await setFavoriteFoodKind(joinMemberId, favoriteFoodKind); // favoriteFoodKinds 배열의 각 음식 종류를 회원 ID와 연결해 저장
    }
    const member = await getMember(joinMemberId); // ID로 회원의 기본 정보 조회
    const favoriteFoodKinds = await getMemberFavoriteFoodKindByMemberId(joinMemberId); // member-favoriteFoodKind ID로 회원의 선호 음식 목록 조회
    return responseFromMember({ member, favoriteFoodKinds }); // DTO(최종 응답 형식)으로 변환하여 클라이언트에 반환
}

// 레파지토리 호출 및 DTO로 변환
export const listMemberReviews = async(memberId, cursor) => {
    // 해당 회원이 존재하지 않을 경우 에러 처리
    const member = await getMember(memberId);
    if (member === null){
        throw new NotExistError("존재하지 않는 회원", { memberId: memberId });
    }
    const reviews = await getAllMemberReviews(memberId, cursor);
    return responseFromReviews(reviews);
} 

export const listMemberMissions = async(memberId, cursor) => {
    // 해당 회원이 존재하지 않을 경우 에러 처리
    const member = await getMember(memberId);
    if (member === null){
        throw new NotExistError("존재하지 않는 회원", { memberId: memberId });
    }
    const missions = await getAllMemberMissions(memberId, cursor);
    return responseFromMemberMissions(missions);
}

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
        throw new DuplicateError("이미 도전 중인 미션", data);
    }
    const memberMission = await getMemberMission(registMemberMissionId);
    return responseFromMemberMission(memberMission);
}

export const memberMissionUpdateCompleted = async(memberId, missionId) => {
    // 해당 회원이 존재하지 않을 경우 에러 처리
    const confirmMember = await getMember(memberId);
    if (confirmMember === null){
        throw new NotExistError("존재하지 않는 회원", {memberId: memberId});
    }
    // 해당 미션이 존재하지 않을 경우 에러 처리
    const confirmMission = await getMission(missionId);
    if (confirmMission === null){
        throw new NotExistError("존재하지 않는 미션", {missionId: missionId});
    }
    // 마감기한이 현재 날짜 및 시간보다 이전일 경우 에러 처리
    const currentDateTime = new Date().toISOString(); // 현재 날짜 및 시간 (YYYY-MM-DDTHH:mm:ss.sssZ 형식)
    if (currentDateTime > confirmMission.deadline){ 
        throw new CannotHandleError("이미 종료된 미션", confirmMission); 
    }
    const memberMission = await updateMemberMissionCompleted(memberId, missionId);
    // 해당 회원에게 등록되어 있는 미션이 아닐 경우 에러 처리
    if (memberMission === null){
        throw new NotExistError("회원에게 할당되지 않은 미션", {memberId: memberId, missionId: missionId});
    }
    // 진행 중(status: 0)인 미션이 아닐 경우 에러 처리
    if (memberMission === -1){
        throw new CannotHandleError("완료할 수 없는 미션", {memberId: memberId, missionId: missionId});
    }
    const updatedMemberMission = await getMemberMission(memberMission.id);
    return responseFromMemberMission(updatedMemberMission);
}