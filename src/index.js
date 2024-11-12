// src/index.js
// const express = require('express') // CommonJS
import express from 'express'; // ES Module
import dotenv from 'dotenv';
import cors from 'cors';
import { handleMemberSignUp, handleListMemberReviews, handleListMemberMission } from "./controllers/member.controller.js";
import { handleRestaurantRegist, handleListRestaurantReviews, handleListRestaurantMissions } from './controllers/restaurant.controller.js';
import { handleReviewRegist } from './controllers/review.controller.js';
import { handleMissionRegist, handleMissionUpdateStatus } from './controllers/mission.controller.js';
import { handleMissionUpdateCompleted } from './controllers/member.controller.js';
dotenv.config(); // .env 파일에서 환경변수를 읽고 process.enc. 객체로 접근

const app = express();
// const port = 3000 // 서버 실행 포트를 3000번으로 지정
const port = process.env.PORT;

app.use(cors()); // cors 방식 허용
app.use(express.static("public")) // 정적 파일 접근
app.use(express.json()); // request의 본문을 JSON으로 해석할 수 있도록 한다. (JSON 형태로 요청 body를 파싱하기 위함)
app.use(express.urlencoded({ extended: false })); // 단순 객체 문자열 형태로 본문 데이터 해석

// GET 요청 처리 라우트 설정
app.get('/', (req, res) => {
  res.send('Hello World! UMC Wenty') // 메시지를 클라이언트에 응답
})

app.post("/members", handleMemberSignUp); // 해당 URL로 POST 요청을 보내면 핸들러 함수가 실행된다. 
// curl.exe -X POST "http://localhost:3001/members" -H "Content-Type: application/json" -d '{\"name\":\"안성진\",\"nickname\":\"웬티\",\"gender\":2,\"birth\": \"2000-04-24\",\"location\": \"위치\",\"email\": \"이메일4\",\"phoneNumber\": \"010-0000-0000\", \"favoriteFoodKinds\": [1, 5, 6] }'


// app.post("/members", (req, res) => {
//   console.log("라우트 도달");
//   console.log("body:", req.body);
//   res.send("라우트 도달 테스트");
// });

app.post("/restaurants", handleRestaurantRegist);
// curl.exe -X POST "http://localhost:3001/restaurants" -H "Content-Type: application/json" -d '{\"ceo\": 3,\"region\": 7,\"name\": \"경동삼겹살\",\"introduction\": \"삼겹살 전문\",\"startTime\": \"09:00:00\",\"endTime\": \"18:00:00\"}'

app.post("/reviews", handleReviewRegist);
// curl.exe -X POST "http://localhost:3001/reviews" -H "Content-Type: application/json" -d '{\"member\": 1, \"restaurant\":11, \"rating\": 3.0, \"content\": \"사장님이 친절해요\"}'

app.post("/missions", handleMissionRegist);
// curl.exe -X POST "http://localhost:3001/missions" -H "Content-Type: application/json" -d '{\"restaurant\": 1, \"name\":\"미션 이름\", \"introduction\": \"미션 소개\", \"deadline\": \"2025-01-01 12:00:00\", \"points\": 10000, \"status\": 0}'

app.patch("/missions/:id", handleMissionUpdateStatus);
// curl.exe -X PATCH "http://localhost:3001/missions/1" 

app.get("/restaurants/:restaurantId/reviews", handleListRestaurantReviews);
// curl.exe -X GET "http://localhost:3001/restaurants/1/reviews?cursor=5" 

app.get("/members/:memberId/reviews", handleListMemberReviews);
// curl.exe -X GET "http://localhost:3001/members/1/reviews?cursor=5" 

app.get("/restaurants/:restaurantId/missions", handleListRestaurantMissions);
// curl.exe -X GET "http://localhost:3001/restaurants/1/missions?cursor=5" 

app.get("/members/:memberId/ongoing-missions", handleListMemberMission);
// curl.exe -X GET "http://localhost:3001/members/1/ongoing-missions?cursor=5"

app.patch("/members/:memberId/ongoing-missions/:missionId", handleMissionUpdateCompleted);
// curl.exe -X PATCH "http://localhost:3001/members/1/ongoing-missions/1"

// 서버 실행
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
 