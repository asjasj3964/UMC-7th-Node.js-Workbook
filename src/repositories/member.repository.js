import { prisma } from "../db.config.js";
import { ServerError } from "../errors.js";

// 회원 데이터 삽입 (회원 등록) & 회원 ID 반환
export const addMember = async(data) => {
    try{
        // 해당 이메일로 등록된 회원(중복 회원)이 존재하는지 확인
        const member = await prisma.member.findFirst({where: {email: data.email}}); 
        if (member){ // 해당 이메일로 등록된 회원이 있을 경우
            return null;
        }
        const created = await prisma.member.create({data: data}); // 회원 생성
        return created.id; // 생성된 회원 ID 반환
    }
    catch(err){
        throw new ServerError(`서버 내부 오류: ${err.stack}`);
    }
};

// 특정 회원 정보 조회
export const getMember = async (memberId) => {
    try{
        const member = await prisma.member.findFirst({ where: {id: memberId}});
        // prisma에서 member 테이블에 접근하여 해당 memberId와 일치하는, 첫 번째 레코드를 조회한다. 
        // 해당 레코드가 없을 시 예외를 던진다(에러 발생).
        if (member == null){ // 미션과 매핑할 회원이 없다면
            return null;
        }
        const formattedMember = {
            ...member,
            id: member.id.toString(),
            points: member.points.toString(),
        };
        return formattedMember;
    }
    catch(err){
        throw new ServerError(`서버 내부 오류: ${err.stack}`);
    }
};

// 특정 회원의 모든 리뷰 조회
export const getAllReviews = async(memberId, cursor) => {
    try{
        const reviews = await prisma.review.findMany({
            select: {
                id: true,
                member: true, // 참조하는 member 테이블
                restaurant: true, // 참조하는 restaurantn 테이블
                rating: true,
                content: true,
                status: true,
                createdAt: true,
            },
            where: { memberId: memberId, id: { gt: cursor }},
            // 리뷰의 ID가 cursor보다 큰 레코드만 가져온다. 
            // gt: "greater than", 값이 cursor보다 큰 데이터를 필터링한다. (페이징 구현)
            orderBy: { id: "asc"}, // ID 기준 오름차순 정렬
            take: 5, // 5개의 레코드만 조회
        })

        // review 객체의 형변환 (BigInt 처리를 위함)
        const formattedReviews = reviews.map(review => ({ // reviews(DB에서 추출한 리뷰 데이터) 배열을 map() 메서드로 각 review 객체 변환
            ...review, // review 객체의 모든 속성 복사
            id: review.id.toString(),
            // DB의 id 필드가 BigInt 타입으로 정의되어 있는데
            // javaScript에선 BigInt 타입은 JSON으로 변환할 수 없어
            // BigInt 타입의 id를 문자열로 변환해주었다. 
            member: { // 참조하는 member 테이블에서 추출할 속성
                ...review.member,
                id: review.member.id.toString(),
            },
            restaurant: { // 참조하는 restaurant 테이블에서 추출할 속성
                ...review.restaurant,
                id: review.restaurant.id.toString(),
                ceoId: review.restaurant.ceoId.toString(),
                regionId: review.restaurant.regionId.toString()
            },
        }));
        
        return formattedReviews;
    }
    catch(err){
        throw new ServerError(`서버 내부 오류: ${err.stack}`);
    }
}

export const updateMember = async(memberId, data) => {
    try{
        const memberUpdated = await prisma.member.update({
            where: {
                id: memberId
            },
            data: {
                name: data.name,
                nickname: data.nickname,
                gender: data.gender,
                birth: data.birth,
                location: data.location,
                phoneNumber: data.phoneNumber
            }
        });
        return memberUpdated;
    }
    catch(err){
        throw new ServerError(`서버 내부 오류: ${err.stack}`);
    }
}