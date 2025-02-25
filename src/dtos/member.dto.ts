import { Member, MemberFavoriteFoodKind, FoodKind } from "@prisma/client";
import { BodyToMemberType, BodyToUpdateMemberType, MemberFavoriteFoodKindType, MemberType } from "../types/member.types.ts";

// member 요청 DTO
export const bodyToMember = (body: BodyToMemberType) => { 
    const birth = new Date(body.birth);
    return {
        name: body.name,
        nickname: body.nickname,
        gender: body.gender,
        birth: birth,
        location: body.location,
        email: body.email,
        phoneNumber: body.phoneNumber || "", // phoneNumber가 없으면 빈 문자열 전달
        favoriteFoodKinds: body.favoriteFoodKinds
    };
};

// member 응답 DTO
// export const responseFromMember = ({member, favoriteFoodKinds}) => { 
//     return {
//         id: member.id,
//         name: member.name,
//         nickname: member.nickname,
//         gender: member.gender,
//         birth: member.birth,
//         location: member.location,
//         email: member.email,
//         phoneNumber: member.phoneNumber || "", 
//         favoriteFoodKinds: favoriteFoodKinds.map(foodKind => foodKind.foodKind.kind)
//     } // 필요한 정보만 추출해서 전송
// }
export const responseFromMember = ({
    member, favoriteFoodKinds
}: {
    member: MemberType;
    favoriteFoodKinds: MemberFavoriteFoodKindType[];
}) => {
    const memberFoodKinds = favoriteFoodKinds.map(
        (favoriteFoodKind) => favoriteFoodKind.foodKind.kind
    );
    return {
        id: member.id,
        name: member.name,
        nickname: member.nickname,
        gender: member.gender,
        birth: member.birth,
        location: member.location,
        email: member.email,
        favoriteFoodKinds: memberFoodKinds
    }
}

export const bodyToUpdateMember = (body: BodyToUpdateMemberType) => { 
    const birth = new Date(body.birth);
    return {
        name: body.name,
        nickname: body.nickname,
        gender: body.gender,
        birth: birth,
        location: body.location,
        phoneNumber: body.phoneNumber || "", // phoneNumber가 없으면 빈 문자열 전달
    };
};

export const ResponseFromUpdatedMember = (body: MemberType) => { 
    const birth = new Date(body.birth);
    return {
        name: body.name,
        nickname: body.nickname,
        gender: body.gender,
        birth: birth,
        email: body.email,
        location: body.location,
        phoneNumber: body.phoneNumber || "", // phoneNumber가 없으면 빈 문자열 전달
    };
};