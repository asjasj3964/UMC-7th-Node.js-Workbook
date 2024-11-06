export const bodyToMember = (body) => { // member DTO
    //const birth = new Date(body.birth); // 생년월일 데이터를 Date 객체로 변환
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