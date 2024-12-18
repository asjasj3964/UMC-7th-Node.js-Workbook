import { responseFromMember, ResponseFromUpdatedMember } from '../dtos/member.dto.js';
import { addMember, getMember, updateMember } from '../repositories/member.repository.js'
import { DuplicateError, CannotHandleError, NotExistError } from '../errors.js';
import { getFavoriteFoodKindByMemberId, setFavoriteFoodKind } from '../repositories/favortie-foodkind.repository.js';
import { getFoodKind } from '../repositories/foodkind.repository.js';

// 회원 추가 및 선호 음식 매핑, 존재하지 않는 데이터 에러 처리
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
    const favoriteFoodKinds = await getFavoriteFoodKindByMemberId(joinMemberId); // member-favoriteFoodKind ID로 회원의 선호 음식 목록 조회
    return responseFromMember({ member, favoriteFoodKinds }); // DTO(최종 응답 형식)으로 변환하여 클라이언트에 반환
}

export const memberUpdate = async(memberId, data) => {
    const member = await getMember(memberId);
    if (member === null){
        throw new NotExistError("존재하지 않는 회원", { memberId: memberId });
    }
    await updateMember(memberId, data);
    const updatedMember = await getMember(memberId);
    return ResponseFromUpdatedMember(updatedMember);
}