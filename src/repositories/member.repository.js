import { prisma, pool } from "../db.config.js";

// 회원 데이터 삽입 (회원 등록) & 회원 ID 반환
export const addMember = async(data) => {
    // const conn = await pool.getConnection();
    // try{
    //     // 해당 이메일(중복된 이메일)의 사용자가 있는지 확인
    //     const [confirm] = await pool.query(
    //         `SELECT EXISTS(SELECT 1 FROM member WHERE email = ?) as isExistEmail;`, 
    //         data.email
    //     );
    //     if (confirm[0].isExistEmail) {
    //         return null;
    //     }
    //     // 중복된 이메일이 아닐 경우, 회원 정보 member 테이블에 삽입
    //     const [result] = await pool.query(
    //         `INSERT INTO member (member_name, nickname, gender, birth, location_address, email, phone_number) VALUES (?, ?, ?, ?, ?, ?, ?);`,
    //         [
    //             data.name,
    //             data.nickname,
    //             data.gender,
    //             data.birth,
    //             data.location,
    //             data.email,
    //             data.phoneNumber, 
    //         ]
    //     );
    //     return result.insertId; // 생성된 회원의 ID 반환
    //     // insertId - DB에 새로운 레코드 삽입
    //     // 새 레코드가 삽입될 때 해당 레코드의 자동 증가 ID 값을 반환한다.
    // } catch(err) { // 오류 처리
    //     throw new Error(`
    //         🚫 오류 발생 🚫 
    //         요청 파라미터 확인 바람 (${err})
    //     `);
    // } finally {
    //     conn.release(); // DB 연결 해지
    // }

    const member = await prisma.member.findFirst({where: {email: data.email}}); // 해당 이메일로 등록된 회원(중복 회원)이 존재하는지 확인
    if (member){ // 해당 이메일로 등록된 회원이 있을 경우
        return null;
    }
    const created = await prisma.member.create({data: data}); // 회원 생성
    return created.id; // 생성된 회원 ID 반환
};

// 회원 정보 조회
export const getMember = async (memberId) => {
    // const conn = await pool.getConnection();
    // try{
    //     const [member] = await pool.query(
    //         `SELECT * FROM member WHERE id = ?;`,
    //         memberId
    //     )
    //     console.log(member);
    //     if (member.length == 0){
    //         return null;
    //     }
    //     return member;
    // }catch (err){
    //     throw new Error(`
    //         🚫 오류 발생 🚫 
    //         요청 파라미터 확인 바람 (${err})
    //     `);
    // }finally{
    //     conn.release();
    // }

    const member = await prisma.member.findFirstOrThrow({ where: {id: memberId}});
    // prisma에서 member 테이블에 접근하여 해당 memberId와 일치하는, 첫 번째 레코드를 조회한다. 
    // 해당 레코드가 없을 시 예외를 던진다(에러 발생).
    return member;
};

// 음식 - 선호_음식_종류 매핑
export const setFavoriteFoodKind = async(memberId, favoriteFoodKindId) => {
    // const conn = await pool.getConnection();
    // try{
    //     await pool.query(
    //             `INSERT INTO member_food_kind (food_kind_id, member_id) VALUES (?, ?);`,
    //             [favoriteFoodKindId, memberId]
    //     );
    //     return;
    // } catch(err){
    //     throw new Error(`
    //         🚫 오류 발생 🚫 
    //         요청 파라미터 확인 바람 (${err})
    //     `);
    // } finally{
    //     conn.release();
    // }

    await prisma.memberFavoriteFoodKind.create({
        data:{ // 새 레코드의 필드와 값을 지정한다. 
            memberId: memberId,
            foodKindId: favoriteFoodKindId
        },
    });
};

// 회원 - 선호_음식_종류 반환
export const getMemberFavoriteFoodKindByMemberId = async (memberId) => {
    // const conn = await pool.getConnection();
    // try{
    //     const [favoriteFoodKinds] = await pool.query(`
    //         SELECT mfk.id, mfk.food_kind_id, mfk.member_id, fk.kind
    //         FROM member_food_kind mfk JOIN food_kind fk ON mfk.food_kind_id = fk.id
    //         WHERE mfk.member_id = ?
    //         ORDER BY mfk.food_kind_id ASC`,
    //         memberId
    //     );
    //     return favoriteFoodKinds;
    // }catch(err){
    //     throw new Error(`
    //         🚫 오류 발생 🚫 
    //         요청 파라미터 확인 바람 (${err})
    //     `);
    // }finally{
    //     conn.release();
    // }

    const favoriteFoodKinds = await prisma.memberFavoriteFoodKind.findMany({ // 여러 레코드 조회, 조건에 맞는 모든 레코드를 배열 형태로 반환
        select: { // 반환할 필드 명시
            id: true,
            memberId: true,
            foodKindId: true,
            foodKind: true, // 참조하는 foodKind 테이블
        },
        where: { memberId: memberId },
        orderBy: {foodKindId: "asc"}, // foodKindId 기준 오름차순 정렬
    });
    return favoriteFoodKinds;
}

// export const getAllRestaurantReviews = async (restaurantId) => {
//     const reviews = await prisma.review.findMany({
//         select: {
//             id: true,
//             //memberId: true,
//             //restauranId: true,
//             member: true,
//             restaurant: true,
//             rating: true,
//             content: true,
//             status: true
//         },
//         where: { restaurantId: restaurantId, id: { gt: 5 }},
//         orderBy: { id: "asc"},
//         take: 5,
//     })
//     return reviews;
// }

// 특정 회원의 모든 리뷰 조회
export const getAllMemberReviews = async(memberId, cursor) => {
    const reviews = await prisma.review.findMany({
        select: {
            id: true,
            member: true, // 참조하는 member 테이블
            restaurant: true, // 참조하는 restaurantn 테이블
            rating: true,
            content: true,
            status: true
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
            id: review.member.id.toString(),
            name: review.member.name,
            nickname: review.member.nickname,
            birth: review.member.birth,
            gender: review.member.gender,
            location: review.member.location,
            phoneNumber: review.member.phoneNumber
        },
        restaurant: { // 참조하는 restaurant 테이블에서 추출할 속성
            id: review.restaurant.id.toString(),
            name: review.restaurant.name
        },
    }));
    
    return formattedReviews;
}


// 특정 회원의 모든 미션 조회
export const getAllMemberMissions = async(memberId, cursor) => {
    const memberMissions = await prisma.memberMission.findMany({
        select: {
            id: true,
            member: true,
            mission: true,
        },
        where: { 
            memberId: memberId, 
            mission: {
                status: 1 // mission 객체의 status가 1(진행 중)인 미션들만 조회온다.
            },
            id: {gt: cursor}
        },
        orderBy: {id: "asc"},
        take: 5
    })

    const formattedMemberMissions = memberMissions.map(memberMission => ({
        ...memberMission,
        id: memberMission.id.toString(),
        member: {
            id: memberMission.member.id.toString(),
            nickname: memberMission.member.nickname,
        },
        mission: {
            id: memberMission.mission.id.toString(),
            restaurantId: memberMission.mission.restaurantId.toString(),
            name: memberMission.mission.name,
            introduction: memberMission.mission.introduction,
            points: memberMission.mission.points.toString(),
            deadline: memberMission.mission.deadline,
            status: memberMission.mission.status,
            
        },
    }));
    
    return formattedMemberMissions;
}

// 특정 회원의 특정 미션의 상태 업데이트(진행 중 -> 진행 완료)
export const updateMissionCompleted = async(memberId, missionId) => {
    // 특정 회원에 주어진 특정 미션이 존재하는지 확인
    const confirmMemberMission = await prisma.memberMission.findFirst({
        where: {
            missionId: missionId,
            memberId: memberId
        }
    })

    // 해당 미션의 상태를 확인하기 위해 status 선택
    const missionStatus = await prisma.mission.findFirst({
        select: {
            status: true
        },
        where: {
            id: missionId
        }
    })

    // 해당 미션이 존재하지 않거나 미션의 상태가 1(진행 중)이 아닐 경우 에러 처리
    if (confirmMemberMission == null || missionStatus.status != 1){
        return null;
    }
    
    const memberMission = await prisma.memberMission.update({
        where: {
            // update 메서드는 지정한 Unique key를 사용하여 레코드를 찾기 때문에 
            // memberId, missionId로 이루어진 복합 고유 키인 memberId_missionId_unique을 만들어주었다. 
            memberId_missionId_unique: {
                memberId: memberId,
                missionId: missionId
            } 
        },
        data: { // 수정할 내용 정의
            mission:{
                update:{ // mission의 특정 속성 업데이트
                    status: 2 // 진행 완료로 업데이트
                }
        }},
        select: { // 반환할 특정 속성 지정
            id: true,
            member: true,
            mission: true,
        }
    })

    const formattedMemberMissions = {
        ...memberMission,
        id: memberMission.id.toString(),
        member: {
            id: memberMission.member.id.toString(),
            nickname: memberMission.member.nickname,
        },
        mission: {
            id: memberMission.mission.id.toString(),
            restaurantId: memberMission.mission.restaurantId.toString(),
            name: memberMission.mission.name,
            introduction: memberMission.mission.introduction,
            points: memberMission.mission.points.toString(),
            deadline: memberMission.mission.deadline,
            status: memberMission.mission.status,
        },
    };

    return formattedMemberMissions;
}