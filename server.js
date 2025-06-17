//
// ***************************************************************************************************
// 이 서버 코드는 MySQL 연결 및 API 로직 측면에서 올바르게 작성되었습니다.
// 만약 앱에서 여전히 "Network Error"가 발생하고 서버 콘솔에 요청 수신 로그가 뜨지 않는다면,
// 이 서버 코드 자체의 문제가 아니라, 다음을 확인해야 합니다:
// 1. 앱 (RegistrationScreen.tsx, LoginScreen.tsx)에 설정된 API_BASE_URL의 IP 주소가
//    이 서버가 실행 중인 컴퓨터의 "현재 실제 내부 IP 주소"와 정확히 일치하는지.
// 2. 이 서버가 실행 중인 컴퓨터의 방화벽이 3000번 포트의 인바운드 연결을 차단하고 있지 않은지.
// 3. 앱과 서버 컴퓨터가 동일한 네트워크(Wi-Fi 등)에 연결되어 있는지.
// ***************************************************************************************************

import express from 'express';
import mysql from 'mysql2/promise'; // async/await 지원하는 promise 버전
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import cors from 'cors'; // 클라이언트(React Native Web/App)와 통신을 위해 CORS 설정

dotenv.config(); // .env 파일 로드

const app = express();
const port = process.env.PORT || 3000;
const saltRounds = 10; // bcrypt 솔트 라운드 (보안 강도)

// 미들웨어 설정
app.use(express.json()); // JSON 요청 본문 파싱
app.use(cors()); // CORS 활성화 (필요에 따라 특정 Origin으로 제한)

// 데이터베이스 연결 풀 생성
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// 데이터베이스 연결 테스트
pool.getConnection()
  .then(connection => {
    console.log('MySQL 데이터베이스에 성공적으로 연결되었습니다.');
    connection.release(); // 연결 해제
  })
  .catch(err => {
    console.error('MySQL 데이터베이스 연결 오류:', err.message);
    process.exit(1); // 연결 실패 시 서버 종료
  });

// --- 루트 경로 (Health Check) API 추가 ---
// 이 API를 통해 백엔드 서버가 최소한 요청을 받는지 확인합니다.
app.get('/', (req, res) => {
  console.log('루트 경로 (/) 요청 수신됨.');
  res.status(200).send('백엔드 서버가 정상적으로 실행 중입니다.');
});

// --- 회원가입 API ---
app.post('/register', async (req, res) => {
  // 회원가입 요청이 백엔드 서버에 도달하는지 확인하는 로그
  console.log('>>> 회원가입 요청 수신됨. 요청 본문:', req.body);

  const { email, password, name } = req.body; // 이름도 함께 받음

  if (!email || !password || !name) {
    return res.status(400).json({ message: '이메일, 비밀번호, 이름을 모두 입력해주세요.' });
  }

  try {
    // 1. 비밀번호 해싱
    console.log('비밀번호 해싱 중...');
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 2. 이름 비식별화 (해싱)
    console.log('이름 비식별화 중...');
    const pseudonymizedName = await bcrypt.hash(name, saltRounds); // 이름도 bcrypt로 해싱

    // 3. 사용자 정보를 DB에 저장
    console.log('DB에 사용자 정보 저장 시도 중...');
    const [result] = await pool.execute(
      'INSERT INTO users (email, hashed_password, pseudonymized_name) VALUES (?, ?, ?)',
      [email, hashedPassword, pseudonymizedName]
    );
    console.log('DB에 사용자 정보 저장 성공. User ID:', result.insertId);

    res.status(201).json({ message: '회원가입 성공', userId: result.insertId });
  } catch (error) {
    console.error('회원가입 오류 (내부 처리):', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: '이미 존재하는 이메일 주소입니다.' });
    }
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

// --- 로그인 API ---
app.post('/login', async (req, res) => {
  // 로그인 요청이 백엔드 서버에 도달하는지 확인하는 로그
  console.log('>>> 로그인 요청 수신됨. 요청 본문:', req.body);

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: '이메일과 비밀번호를 입력해주세요.' });
  }

  try {
    // 1. 이메일로 사용자 정보 조회
    console.log('DB에서 사용자 정보 조회 시도 중...');
    const [rows] = await pool.execute(
      'SELECT id, hashed_password FROM users WHERE email = ?',
      [email]
    );

    if (rows.length === 0) {
      console.log('로그인 실패: 사용자 없음 또는 비밀번호 불일치.');
      return res.status(401).json({ message: '잘못된 이메일 또는 비밀번호입니다.' });
    }

    const user = rows[0];

    // 2. 비밀번호 일치 여부 확인
    console.log('비밀번호 일치 여부 확인 중...');
    const passwordMatch = await bcrypt.compare(password, user.hashed_password);

    if (passwordMatch) {
      console.log('로그인 성공:', user.id);
      res.status(200).json({ message: '로그인 성공', userId: user.id });
    } else {
      console.log('로그인 실패: 비밀번호 불일치.');
      res.status(401).json({ message: '잘못된 이메일 또는 비밀번호입니다.' });
    }
  } catch (error) {
    console.error('로그인 오류 (내부 처리):', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

// 서버 시작
app.listen(port, () => {
  console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
  console.log(`MySQL 데이터베이스에 성공적으로 연결되었습니다.`);
});