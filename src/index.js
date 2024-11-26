// src/index.js
// const express = require('express') // CommonJS
import express from 'express'; // ES Module
import dotenv from 'dotenv';
import cors from 'cors';
import { handleMemberSignUp, handleMemberUpdate } from "./controllers/member.controller.js";
import { handleMemberMissionRegist, handleListMemberMission } from './controllers/participated-mission.controller.js';
import { handleRestaurantRegist, handleListRestaurantReviews, handleListRestaurantMissions } from './controllers/restaurant.controller.js';
import { handleReviewRegist, handleListReviews } from './controllers/review.controller.js';
import { handleMissionRegist } from './controllers/mission.controller.js';
import { handleMissionUpdateCompleted } from './controllers/participated-mission.controller.js';
import swaggerAutogen from 'swagger-autogen';
import swaggerUiExpress from "swagger-ui-express"
import passport from 'passport';
import { googleStrategy, kakaoStrategy, naverStrategy } from './auth.config.js';
import session from 'express-session';
import { PrismaSessionStore } from '@quixo3/prisma-session-store';
import { prisma } from "./db.config.js";
import { handleFavoriteFoodKindUpdate } from './controllers/favortie-foodkind.controller.js';

dotenv.config(); // .env 파일에서 환경변수를 읽고 process.enc. 객체로 접근

passport.use(googleStrategy); // passport 라이브러리에 정의한 로그인 방식 등록
passport.use(kakaoStrategy);
passport.use(naverStrategy);
passport.serializeUser((member, done) => done(null, member)); // 세션에 회원 정보(member) 저장
passport.deserializeUser((member, done) => done(null, member)); // 세션의 정보(member)를 가져와 req.user에 할당

const app = express();
// const port = 3000 // 서버 실행 포트를 3000번으로 지정
const port = process.env.PORT;

app.use(
  "/docs", // Swagger UI가 표시될 경로
  swaggerUiExpress.serve, // Swagger UI의 정적 파일(HTML, CSS, JS)을 제공하는 미들웨어
  swaggerUiExpress.setup({}, { // Swagger UI의 설정 초기화, Swagger 문서를 불러오는 방식 정의
    swaggerOptions: { // Swagger UI의 동작 제어
      url: "/openapi.json", // /openapi.json 경로에서 Swagger 문서를 가져오도록 설정
    },
  })
);

app.get("/openapi.json", async(req, res, next) => { // 클라이언트의 Swagger 문서 요청 시 /openapi.json 경로가 호출된다. 
  // #swagger.ignore = true
  const options = { // Swagger Autogen 옵션 설정
    openapi: "3.0.0", // 생성될 문서의 OpenAPI 버전
    disableLogs: true, // Swagger Autogen 실행 시 불필요한 로그 출력 비활성화
    writeOutputFile: false, // 문서를 파일로 저장하지 않는다.
  };
  const outputFile = "/dev/null"; // 생성된 Swagger 문서를 저장할 파일 경로 지정 (파일 출력은 사용하지 않는다.) 
  const routes = ["./src/index.js"]; // 문서화할 라우트가 정의된 파일 경로를 배열로 지정
  const doc = { // Swagger 문서의 메타데이터와 스키마 정의
    info: { // API의 제목과 설명 설정
      title: "UMC 7th",
      description: "UMC 7th Node.js 테스트 프로젝트"
    },
    host: "localhost:3001", // API가 실행되는 서버의 호스트 정보
    components: { // 공통적으로 사용되는 스키마 정의
      responses: { // 응답 
        NotFoundErrorResponse: { // Not Found 에러 응답 
          type: "object",
          properties: {
            resultType: { type: "string", example: "FAIL" },
            error: { 
              type: "object",
              properties: {
                errorCode: { type: "string", example: "U404" },
                reason: { type: "string" },
                data: { type: "object" }
              } 
            },
            success: { type: "object", nullable: true, example: null }    
          }
        },
        ForbiddenErrorResponse: { // Forbidden 에러 응답 
          type: "object",
          properties: {
            resultType: { type: "string", example: "FAIL" },
            error: { 
              type: "object",
              properties: {
                errorCode: { type: "string", example: "U403" },
                reason: { type: "string" },
                data: { type: "object" }
              } 
            },
            success: { type: "object", nullable: true, example: null }    
          }
        },
        DuplicateErrorResponse: { // 중복 에러 응답 
          type: "object",
          properties: {
            resultType: { type: "string", example: "FAIL" },
            error: { 
              type: "object",
              properties: {
                errorCode: { type: "string", example: "U001" },
                reason: { type: "string" },
                data: { type: "object" }
              } 
            },
            success: { type: "object", nullable: true, example: null }    
          }
        },
        ServerErrorResponse: { // 서버 내부 에러 응답 
          type: "object",
          properties: {
            resultType: { type: "string", example: "FAIL" },
            error: { 
              type: "object",
              properties: {
                errorCode: { type: "string", example: "U500" },
                reason: { type: "string" },
                data: { type: "object" }
              } 
            },
            success: { type: "object", nullable: true, example: null }    
          }
        },
        ReviewListSuccessResponse: { // 리뷰 목록 성공 응답 
          type: "object",
          properties: {
            resultType: { type: "string", example: "SUCCESS" },
            error: { type: "object", nullable: true, example: null },
            success: {
              type: "object",
              properties: {
                data: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      id: { type: "string", example: "1" },
                      restaurant: { type: "string" },
                      writer: { type: "string" },
                      content: { type: "string" },
                      rating: { type: "number", example: 4.5 },
                      status: { type: "number", example: 0 },
                      createdAt: { type: "string", format: "date-time", example: "2024-11-18T14:23:45.123456Z" }
                    }
                  }
                },
                pagination: {
                  type: "object",
                  properties: {
                    cursor: {
                      type: "string",
                      nullable: true,
                      example: "0"
                    }
                  }
                }
              }
            }
          }
        },
        MissionSuccessResponse: { // mission 성공 응답 
          type: "object",
          properties: {
            resultType: { type: "string", example: "SUCCESS" },
            error: { type: "object", nullable: true, example: null },
            success: {
              type: "object", 
              properties: {
                id: { type: "string", example: "1" },
                member: { type: "string" },
                restaurant: { type: "string" },
                name: { type: "string" },
                introduction: { type: "string" },
                deadline: { type: "string", format: "date-time", example: "2025-02-01T00:00:00Z" },
                points: { type: "string", example: "100" },
                status: { type: "number", example: 0 }
              }
            }    
          }
        },
      },
      '@schemas': { // swagger-autogen 렌더링을 무시하고 Swagger Spec에서 직접적으로 정의된 스키마 렌더링
        MemberSchema: { // member 스키마
          type: "object",
          properties: {
            name: { type: "string" },
            nickname: { type: "string" },
            gender: { type: "number" },
            birth: { type: "string", example: "2000-04-24" },
            location: { type: "string" },
            email: { type: "string" },
            phoneNumber: { type: "string", example: "010-0000-0000" },
            favoriteFoodKinds: { type: "array", items: { type: "number" } }
          }
        },
        PaginationSchema: { // 페이징 응답 스키마
          type: "object",
          properties: {
            cursor: {
              type: "string",
              nullable: true,
              example: null
            }
          }
        }
      },
      parameters: { // 파라미터
        CursorParam: { // 커서 파라미터
          name: "cursor",
          in: "query",
          description: "페이징 커서 값 입력",
          schema: {
            type: "integer",
            format: "int64"
          }
        },
        MemberIdParam: { // 회원 ID 파라미터
          name: "memberId",
          in: 'path',
          required: true,
          description: "회원의 ID 입력",
          schema: {
            type: "integer",
            format: "int64"
          }
        },
        RestaurantIdParam: { // 식당 ID 파라미터 
          name: "restaurantId",
          in: 'path',
          required: true,
          description: "식당의 ID 입력",
          schema: {
            type: "integer",
            format: "int64"
          }
        },
      },
      examples: {
        ServerErrorExample: { // 서버 내부 에러 응답 예시
          summary: "서버 내부 오류",
          description: "서버에서 예상치 못한 오류가 발생하였습니다.",
          value:{
            resultType: "FAIL",
            error: { 
                errorCode: "U500",
                reason: "서버 내부 오류",
                data: {}
            },
            success: null 
          } 
        },
        MemberNotFoundErrorExample: { // member Not Found 에러 응답 예시
          summary: "존재하지 않는 회원",
          description: "등록되어 있지 않은 회원 ID로 조회하였습니다.",
          value: {
            resultType: "FAIL",
            error: { 
              errorCode: "U404",
              reason: "존재하지 않는 회원",
              data: {}
            },
            success: null 
          },
        },
        RestaurantNotFoundErrorExample: { // restaurant Not Found 에러 응답 예시
          summary: "존재하지 않는 식당",
          description: "등록되어 있지 않은 식당 ID로 조회하였습니다.",
          value: {
            resultType: "FAIL",
            error: { 
              errorCode: "U404",
              reason: "존재하지 않는 식당",
              data: {}
            },
            success: null 
          },
        },
        FoodKindNotFoundErrorExample: { // foodKind Not Found 에러 응답 예시
          summary: "존재하지 않는 음식 종류",
          description: "등록되어 있지 않은 음식 종류 ID로 조회하였습니다.",
          value: {
            resultType: "FAIL",
            error: { 
                errorCode: "U404",
                reason: "존재하지 않는 음식 종류",
                data: {}
            },
            success: null 
          },
        },
        DeadlineErrorExample: { // 마감기한 에러 응답 예시
          summary: "이미 종료된 미션",
          description: "이미 마감기한이 지난 미션입니다.",
          value: {
            resultType: "FAIL",
            error: { 
              errorCode: "U403",
              reason: "이미 종료된 미션",
              data: {}
            },
            success: null 
          },
        }
      }
    }
  };
  const result = await swaggerAutogen(options)(outputFile, routes, doc);
  // swaggerAutogen(options): Swagger Autogen 모듈 초기화
  // outputFile: 문서를 출력할 파일 경로
  // routes: 라우트 파일 경로 배열
  // doc: 추가 메타데이터 및 스키마
  res.json(result ? result.data : null);
  // result 객체가 생성되었는지 확인
  // result.data: Swagger Autogen이 생성한 JSON 데이터 포함
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

app.use(
  session({
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000, // ms
    },
    resave: false,
    saveUninitialized: false,
    secret: process.env.EXPRESS_SESSION_SECRET,
    store: new PrismaSessionStore(prisma, {
      checkPeriod: 2 * 60 * 1000, // ms
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }),
  })
);

app.use(passport.initialize()); // Passport의 기본적인 인증 로직 활성화
app.use(passport.session()); // 세션 기반 인증 상태 유지, 세션에서 사용자 데이터를 복원하여 req.user에 할당

const myLogger = (req, res, next) => {
  console.log("LOGGED"); // 다음 미들웨어나 라우트 핸들러로 제어를 넘긴다. 
  next(); // next()가 없을 경우 요청이 정지된다. (다음 미들웨어로 넘어가지 않는다)
}

app.use(myLogger); // myLogger 미들웨어가 실행되도록 등록한다.

app.get("/oauth2/login/google", passport.authenticate("google"));
app.get(
  "/oauth2/callback/google",
  passport.authenticate("google", {
    failureRedirect: "/oauth2/login/google",
    failureMessage: true,
  }),
  (req, res) => res.redirect("/")
);

app.get("/oauth2/login/kakao", passport.authenticate("kakao"));
app.get(
  "/oauth2/callback/kakao",
  passport.authenticate("kakao", {
    failureRedirect: "/oauth2/login/kakao",
    failureMessage: true,
  }),
  (req, res) => res.redirect("/")
);

app.get("/oauth2/login/naver", passport.authenticate("naver"));
app.get(
  "/oauth2/callback/naver",
  passport.authenticate("naver", {
    failureRedirect: "/oauth2/login/naver",
    failureMessage: true,
  }),
  (req, res) => res.redirect("/")
);

// app.get('/hello', (req, res) => {
//   console.log("Hello ");
//   res.send('안녕이란 말 Hello Hello ~');
// })

// GET 요청 처리 라우트 설정
app.get('/', (req, res) => {
  // #swagger.ignore = true
  console.log(req.user);
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
// curl.exe -X POST "http://localhost:3001/restaurants" -H "Content-Type: application/json" -d '{\"ceo\": 1,\"region\": 2,\"name\": \"종로닭한마리\",\"introduction\": \"닭볶음탕 전문문\",\"startTime\": \"09:00:00\",\"endTime\": \"18:00:00\"}'

app.post("/reviews", handleReviewRegist);
// curl.exe -X POST "http://localhost:3001/reviews" -H "Content-Type: application/json" -d '{\"member\": 1, \"restaurant\":11, \"rating\": 3.0, \"content\": \"사장님이 친절해요\"}'

app.post("/missions", handleMissionRegist);
// curl.exe -X POST "http://localhost:3001/missions" -H "Content-Type: application/json" -d '{\"restaurant\": 1, \"name\":\"미션 이름\", \"introduction\": \"미션 소개\", \"deadline\": \"2025-01-01 12:00:00\", \"points\": 10000, \"status\": 0}'

app.post("/participated-missions", handleMemberMissionRegist);
// curl.exe -X POST "http://localhost:3001/participated-missions" -H "Content-Type: application/json" -d '{\"memberId\": 1, \"missionId\": 3}' 

app.get("/restaurants/:restaurantId/reviews", handleListRestaurantReviews);
// curl.exe -X GET "http://localhost:3001/restaurants/1/reviews?cursor=5" 

app.get("/reviews", handleListReviews);
// curl.exe -X GET "http://localhost:3001/members/1/reviews?cursor=5" 

app.get("/restaurants/:restaurantId/missions", handleListRestaurantMissions);
// curl.exe -X GET "http://localhost:3001/restaurants/1/missions?cursor=5" 

app.get("/participated-missions", handleListMemberMission);
// curl.exe -X GET "http://localhost:3001/members/1/participated-missions?cursor=5"

app.patch("/participated-missions/:participatedMissionId", handleMissionUpdateCompleted);
// curl.exe -X PATCH "http://localhost:3001/members/1/participated-missions/1"

app.patch("/members", handleMemberUpdate);

app.patch("/favorite-foodkinds", handleFavoriteFoodKindUpdate);

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
 