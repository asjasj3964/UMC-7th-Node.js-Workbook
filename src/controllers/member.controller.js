import { StatusCodes } from "http-status-codes";
import { bodyToMember } from "../dtos/member.dto.js";
import { memberSignUp } from "../services/member.service.js"
import { listMemberReviews, listMemberMissions } from "../services/member.service.js";
import { memberMissionUpdateCompleted } from "../services/member.service.js";
import { memberMissionUpdateOngoing } from "../services/member.service.js";

// 회원 등록 핸들러
export const handleMemberSignUp = async(req, res, next) => {
    console.log("회원가입 요청");
    console.log("body: ", req.body); // 값이 잘 들어오는지 테스트
    const member = await memberSignUp(bodyToMember(req.body)); // 요청 데이터를 DTO로 변환 (member 객체 생성)
    res.status(StatusCodes.OK).success(member); // 성공 공통 응답 전달
    // HTTP 응답 반환, JSON 형식의 member 객체를 클라이언트에 전달
}   

// 특정 회원 모든 리뷰 조회
export const handleListMemberReviews = async(req, res, next) => {
    const reviews = await listMemberReviews(
        parseInt(req.params.memberId),
        typeof req.query.cursor === "string"? parseInt(req.query.cursor) : 0
        // cursor(Query Parameter)가 문자열이라면 parseInt로 정수로 변환, 그렇지 않으면 기본값 0
    )
    res.status(StatusCodes.OK).success(reviews);
}

// 특정 회원 모든 미션 조회
export const handleListMemberMission = async(req, res, next) => {
    const missions = await listMemberMissions(
        parseInt(req.params.memberId),
        typeof req.query.cursor === "string"? parseInt(req.query.cursor) : 0
    )
    res.status(StatusCodes.OK).success(missions);
}

// 특정 회원의 특정 미션 상태 업데이트(진행 X -> 진행 중) 핸들러
export const handleMissionUpdateOngoing = async(req, res, next) => {
    const updateMission = await memberMissionUpdateOngoing(
        parseInt(req.params.memberId), 
        parseInt(req.params.missionId) 
        // URL 경로에서 memberId, missionId(Path Parameter)를 가져온다.
    )
    res.status(StatusCodes.OK).success(updateMission);
}

// 특정 회원의 특정 미션 상태 업데이트(진행 중 -> 진행 완료) 핸들러
export const handleMissionUpdateCompleted = async(req, res, next) => {
    const missions = await memberMissionUpdateCompleted(
        parseInt(req.params.memberId),
        parseInt(req.params.missionId),
    )
    res.status(StatusCodes.OK).success(missions);
}