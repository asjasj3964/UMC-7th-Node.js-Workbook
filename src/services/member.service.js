import { responseFromMember } from '../dtos/member.dto.js';
import { addMember, getMember, getMemberFavoriteFoodKindByMemberId, setFavoriteFoodKind } from '../repositories/member.repository.js'
import { responseFromReviews } from '../dtos/review.dto.js';
import { getAllMemberReviews, getAllMemberMissions } from '../repositories/member.repository.js';
import { responseFromMissions, responseFromMission } from '../dtos/mission.dto.js';
import { updateMissionCompleted } from '../repositories/member.repository.js';
import { DuplicateError, CannotHandleError, NotExistError } from '../errors.js';
import { getMission } from '../repositories/mission.repository.js';

// 회원 추가 및 선호 음식 매핑, 유효하지 않은 데이터 에러 처리
export const memberSignUp = async(data) => {
    const joinMemberId = await addMember({ // 해당 데이터로 회원 생성 후 회원의 ID 반환
        name: data.name,
        nickname: data.nickname,
        gender: data.gender,
        birth: data.birth,
        location: data.location,
        email: data.email,
        phoneNumber: data.phoneNumber,
    });
    if (joinMemberId === null){ // 등록하려는 회원의 ID가 null일 경우 에러 처리
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
    const reviews = await getAllMemberReviews(memberId, cursor);
    if (reviews === null){
        throw new NotExistError("존재하지 않는 회원", { memberId: memberId });
    }
    return responseFromReviews(reviews);
} 

export const listMemberMissions = async(memberId, cursor) => {
    const missions = await getAllMemberMissions(memberId, cursor);
    if (missions === null){
        throw new NotExistError("존재하지 않는 회원", { memberId: memberId });
    }
    return responseFromMissions(missions);
}

export const missionUpdateCompleted = async(memberId, missionId) => {
    const mission = await updateMissionCompleted(memberId, missionId);
    if (mission === null){
        const cannotCompletedMission = await getMission(missionId);
        throw new CannotHandleError("완료할 수 없는 미션", cannotCompletedMission); // 유효하지 않은 데이터 에러 처리
    }
    if (mission === -1){
        throw new NotExistError("존재하지 않는 미션", { memberId: memberId, missionId: missionId }); // 유효하지 않은 데이터 에러 처리
    }
    return responseFromMission(mission);
}