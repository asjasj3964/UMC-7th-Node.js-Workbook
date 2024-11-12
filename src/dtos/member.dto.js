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
        // name: member[0].member_name,
        // nickname: member[0].nickname,
        // gender: member[0].gender,
        // birth: member[0].birth,
        // location: member[0].location_address,
        // email: member[0].email,
        // phoneNumber: member[0].phone_number || "", // phoneNumber가 없으면 빈 문자열 전달
        // favoriteFoodKinds: favoriteFoodKinds.map(foodKind => foodKind.kind)
        // // map(...) 메서드: 배열의 각 요소에 대해 특정 작업을 수행하고 그 결과로 새로운 배열을 생성한다.
        // // foodKind 객체에서 kind 속성 값을 추출한다.
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
