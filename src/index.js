// const express = require('express') // CommonJS
import express from 'express' // ES Module
const app = express()
const port = 3000 // 서버 실행 포트를 3000번으로 지정

// GET 요청 처리 라우트 설정
app.get('/', (req, res) => {
  res.send('Hello World! UMC Wenty') // 메시지를 클라이언트에 응답
})

// 서버 실행
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})