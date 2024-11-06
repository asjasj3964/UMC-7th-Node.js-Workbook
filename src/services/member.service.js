// src/services/member.service.js
import { responseFromMember } from './member.dto.js';
import { addMember, getMember, getMemberFavoriteFoodKindByMemberId, setFavoriteFoodKind } from '../repositories/member.repository.js'

export const memberSignUp = async(data) => {
    const joinMemberId = await addMember({ // 생성된 회원의 ID 반환
        name: data.name,
        nickname: data.nickname,
        gender: data.gender,
        birth: data.birth,
        location: data.location,
        email: data.email,
        phoneNumber: data.phoneNumber,
    });
    if (joinMemberId === null){
        throw new Error("중복된 이메일"); // 동일한 이메일로 여러 계정을 만드는 것을 방지
    }
    for (const favoriteFoodKind of data.favoriteFoodKinds){
        await setFavoriteFoodKind(joinMemberId, favoriteFoodKind); // favoriteFoodKinds 배열의 각 음식 종류를 회원 ID와 연결해 저장
    }
    const member = await getMember(joinMemberId); // ID로 회원의 기본 정보 조회
    const favoriteFoodKinds = await getMemberFavoriteFoodKindByMemberId(joinMemberId); // member-favoriteFoodKind ID로 회원의 선호 음식 목록 조회
    return responseFromMember({ member, favoriteFoodKinds }); // DTO(최종 응답 형식)으로 변환하여 클라이언트에 반환
}