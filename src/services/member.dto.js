// src/services/member.dto.js
export const responseFromMember = ({member, favoriteFoodKinds}) => {
    return {
        name: member[0].member_name,
        nickname: member[0].nickname,
        gender: member[0].gender,
        birth: member[0].birth,
        location: member[0].location_address,
        email: member[0].email,
        phoneNumber: member[0].phone_number || "", // phoneNumber가 없으면 빈 문자열 전달
        favoriteFoodKinds: favoriteFoodKinds.map(foodKind => foodKind.kind)
        // map(...) 메서드: 배열의 각 요소에 대해 특정 작업을 수행하고 그 결과로 새로운 배열을 생성한다.
        // foodKind 객체에서 kind 속성 값을 추출한다.
    } // 필요한 정보만
}
