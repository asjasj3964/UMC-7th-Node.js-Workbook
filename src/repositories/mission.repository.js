import { prisma } from "../db.config.js";
import { ServerError } from "../errors.js";

// 미션 데이터 삽입 (미션 등록) & 미션 ID 반환 
export const addMission = async(data) => {
    try{
        const currentDateTime = new Date().toISOString(); // 현재 날짜 및 시간 (YYYY-MM-DDTHH:mm:ss.sssZ 형식)
        if (currentDateTime > data.deadline){ // 설정한 마감기한이 현재 날짜 및 시간보다 이전일 경우
            return -2;
        }
        // 등록하려는 식당 ID, 미션 이름, 미션 내용, 미션 마감기한과 모두 일치하는 중복 미션이 존재하는지 확인
        const mission = await prisma.mission.findFirst({
            where: {
                restaurantId: data.restaurant, 
                name: data.name, 
                introduction: data.introduction,
                deadline: data.deadline,
            }
        });        
        // 중복 미션이 있을 경우
        if (mission != null) {
            return -1;
        }
        const created = await prisma.mission.create({ // 미션 생성
            data: { // 생성할 데이터 객체
                ...data, // 매개변수로 전달 받은 data 객체의 모든 속성을 복사한다.
                restaurant: {
                    connect: { id: data.restaurant } // restaurant 테이블과 관계 연결
                }
            }
        });
        console.log(created);
        return created.id; // 생성된 미션 ID 반환
    }
    catch(err){
        throw new ServerError(`서버 내부 오류: ${err.stack}`);
    }
}

// 미션 ID로 미션 조회
export const getMission = async(missionId) => {
    try{
        const mission = await prisma.mission.findFirst({ 
            select:{
                id:true,
                name:true,
                introduction:true,
                deadline:true,
                points: true,
                status: true,
                restaurant: true,
            },
            where: {id: missionId}
        });
        // 해당 미션이 존재하지 않을 경우
        if (mission == null){
            return null;
        }
        const formattedMission = {
            ...mission,
            id: mission.id.toString(),
            restaurant: {
                ...mission.restaurant,
                id: mission.restaurant.id.toString(),
                ceoId: mission.restaurant.ceoId.toString(),
                regionId: mission.restaurant.regionId.toString(),
            },
            points: mission.points.toString(),
        };
        return formattedMission
    }
    catch(err){
        throw new ServerError(`서버 내부 오류: ${err.stack}`);
    }
}

// 미션 - 회원 매핑
export const setMemberMission = async(missionId, memberId) => {
    try{
        // 회원 ID로 조회했을 때 해당 회원이 존재하는지 확인
        await prisma.memberMission.create({
            data:{ // 새 레코드의 필드와 값을 지정한다. 
                memberId: memberId,
                missionId: missionId
            },
        });
    }
    catch(err){
        throw new ServerError(`서버 내부 오류: ${err.stack}`);
    }
};
