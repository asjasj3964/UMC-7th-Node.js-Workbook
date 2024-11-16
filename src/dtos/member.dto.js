// member 요청 DTO
export const bodyToMember = (body) => { 
    //const birth = new Date(body.birth); // 생년월일 데이터를 Date 객체로 변환 (DB에 문자열로 정의해 주석 처리)
    return {
        name: body.name,
        nickname: body.nickname,
        gender: body.gender,
        birth: body.birth,
        location: body.location,
        email: body.email,
        phoneNumber: body.phoneNumber || "", // phoneNumber가 없으면 빈 문자열 전달
        favoriteFoodKinds: body.favoriteFoodKinds
    };
};

// member 응답 DTO
export const responseFromMember = ({member, favoriteFoodKinds}) => { 
    return {
        name: member.name,
        nickname: member.nickname,
        gender: member.gender,
        birth: member.birth,
        location: member.locationAddress,
        email: member.email,
        phoneNumber: member.phoneNumber || "", 
        favoriteFoodKinds: favoriteFoodKinds.map(foodKind => foodKind.foodKind.kind)
    } // 필요한 정보만 추출해서 전송
}