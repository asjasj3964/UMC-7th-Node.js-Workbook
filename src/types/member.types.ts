export type MemberType = {
    id: string;
    points: string;
    inactiveAt: string | null;
    name: string;
    email: string;
    location: string;
    phoneNumber: string;
    nickname: string;
    gender: number;
    birth: Date;
    createdAt: Date;
    updatedAt: Date;
    status: number;
}

export type BodyToMemberType = {
    name: string, 
    nickname: string, 
    gender: number, 
    birth: string,
    location: string,
    email: string,
    phoneNumber: string,
    favoriteFoodKinds: bigint[],
}

export type BodyToUpdateMemberType = {
    name: string,
    nickname: string,
    gender: number,
    birth: string,
    location: string,
    phoneNumber: string
}

export type MemberFavoriteFoodKindType = {
    id: bigint;
    memberId: bigint;
    foodKindId: bigint;
    foodKind: {
        id: bigint;
        createdAt: Date;
        updatedAt: Date;
        status: number;
        kind: string;
    };
}