// src/index.js
// const express = require('express') // CommonJS
import express from 'express'; // ES Module
import dotenv from 'dotenv';
import cors from 'cors';
import { handleMemberSignUp, handleListMemberReviews, handleListMemberMission } from "./controllers/member.controller.js";
import { handleMemberMissionRegist } from './controllers/participated-mission.controller.js';
import { handleRestaurantRegist, handleListRestaurantReviews, handleListRestaurantMissions } from './controllers/restaurant.controller.js';
import { handleReviewRegist } from './controllers/review.controller.js';
import { handleMissionRegist } from './controllers/mission.controller.js';
import { handleMissionUpdateCompleted } from './controllers/participated-mission.controller.js';
import swaggerAutogen from 'swagger-autogen';
import swaggerUiExpress from "swagger-ui-express"

dotenv.config(); // .env 파일에서 환경변수를 읽고 process.enc. 객체로 접근

const app = express();
// const port = 3000 // 서버 실행 포트를 3000번으로 지정
const port = process.env.PORT;

app.use(
  "/docs",
  swaggerUiExpress.serve,
  swaggerUiExpress.setup({}, {
    swaggerOptions: {
      url: "/openapi.json",
    },
  })
);

app.get("/openapi.json", async(req, res, next) => {
  // #swagger.ignore = true
  const options = {
    openapi: "3.0.0",
    disableLogs: true,
    writeOutputFile: false,
  };
  const outputFile = "/dev/null"; // 파일 출력은 사용하지 않는다. 
  const routes = ["./src/index.js"];
  const doc = {
    info: {
      title: "UMC 7th",
      description: "UMC 7th Node.js 테스트 프로젝트"
    },
    host: "localhost:3001",
  };
  const result = await swaggerAutogen(options)(outputFile, routes, doc);
  res.json(result ? result.data : null);
});

// 공통 응답을 사용할 수 있는 헬퍼 함수 등록
app.use((req, res, next) => {
  // 성공 응답 헬퍼 함수
  res.success = (success) => {
    return res.json({
      resultType: "SUCCESS",
      error: null,
      success
    });
  };
  // 에러 응답 헬퍼 함수
  res.error = ({ errorCode = "unknown", reason = null, data = null}) => {
    return res.json({
      resultType: "FAIL",
      error: { errorCode, reason, data },
      success: null,
    });
  };
  next(); // 이후 다른 Controller, 미들웨어 등에서 res.jon, res.error 함수를 사용할 수 있게 한다. 
})


app.use(cors()); // cors 방식 허용
app.use(express.static("public")) // 정적 파일 접근
app.use(express.json()); // request의 본문을 JSON으로 해석할 수 있도록 한다. (JSON 형태로 요청 body를 파싱하기 위함)
app.use(express.urlencoded({ extended: false })); // 단순 객체 문자열 형태로 본문 데이터 해석

const myLogger = (req, res, next) => {
  console.log("LOGGED"); // 다음 미들웨어나 라우트 핸들러로 제어를 넘긴다. 
  next(); // next()가 없을 경우 요청이 정지된다. (다음 미들웨어로 넘어가지 않는다)
}

app.use(myLogger); // myLogger 미들웨어가 실행되도록 등록한다.

// // GET 요청 처리 라우트 설정
// app.get('/', (req, res) => {
//   console.log("/");
//   res.send('Hello World! UMC Wenty') // 메시지를 클라이언트에 응답
// })

// app.get('/hello', (req, res) => {
//   console.log("Hello ");
//   res.send('안녕이란 말 Hello Hello ~');
// })

app.post("/members", handleMemberSignUp); // 해당 URL로 POST 요청을 보내면 핸들러 함수가 실행된다. 
// curl.exe -X POST "http://localhost:3001/members" -H "Content-Type: application/json" -d '{\"name\":\"안성진\",\"nickname\":\"웬티\",\"gender\":2,\"birth\": \"2000-04-24\",\"location\": \"위치\",\"email\": \"이메일4\",\"phoneNumber\": \"010-0000-0000\", \"favoriteFoodKinds\": [1, 5, 6] }'

// app.post("/members", (req, res) => {
//   console.log("라우트 도달");
//   console.log("body:", req.body);
//   res.send("라우트 도달 테스트");
// });

app.post("/restaurants", handleRestaurantRegist);
// curl.exe -X POST "http://localhost:3001/restaurants" -H "Content-Type: application/json" -d '{\"ceo\": 1,\"region\": 2,\"name\": \"종로닭한마리\",\"introduction\": \"닭볶음탕 전문문\",\"startTime\": \"09:00:00\",\"endTime\": \"18:00:00\"}'

app.post("/reviews", handleReviewRegist);
// curl.exe -X POST "http://localhost:3001/reviews" -H "Content-Type: application/json" -d '{\"member\": 1, \"restaurant\":11, \"rating\": 3.0, \"content\": \"사장님이 친절해요\"}'

app.post("/missions", handleMissionRegist);
// curl.exe -X POST "http://localhost:3001/missions" -H "Content-Type: application/json" -d '{\"restaurant\": 1, \"name\":\"미션 이름\", \"introduction\": \"미션 소개\", \"deadline\": \"2025-01-01 12:00:00\", \"points\": 10000, \"status\": 0}'

app.post("/participated-missions", handleMemberMissionRegist);
// curl.exe -X POST "http://localhost:3001/participated-missions" -H "Content-Type: application/json" -d '{\"memberId\": 1, \"missionId\": 3}' 

app.get("/restaurants/:restaurantId/reviews", handleListRestaurantReviews);
// curl.exe -X GET "http://localhost:3001/restaurants/1/reviews?cursor=5" 

app.get("/members/:memberId/reviews", handleListMemberReviews);
// curl.exe -X GET "http://localhost:3001/members/1/reviews?cursor=5" 

app.get("/restaurants/:restaurantId/missions", handleListRestaurantMissions);
// curl.exe -X GET "http://localhost:3001/restaurants/1/missions?cursor=5" 

app.get("/members/:memberId/participated-missions", handleListMemberMission);
// curl.exe -X GET "http://localhost:3001/members/1/participated-missions?cursor=5"

app.patch("/participated-missions/:participatedMissionId", handleMissionUpdateCompleted);
// curl.exe -X PATCH "http://localhost:3001/members/1/participated-missions/1"

// 전역 오류를 처리하기 위한 미들웨어
app.use((err, req, res, next) => {
  if (res.headersSent){ // 응답 헤더가 이미 클라이언트로 전송되었는지 확인
    return next(err); // 추가적인 응답을 보낼 수 없으므로 에러를 다음 미들웨어로 전달
  }
  res.status(err.statusCode || 500).error({
    errorCode: err.errorCode || "unknown",
    reason: err.reason || err.message || null,
    data: err.data || null,
  });
});

// 서버 실행
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
 