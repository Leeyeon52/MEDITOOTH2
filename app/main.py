from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import account  # account.py에서 라우터 임포트

app = FastAPI()

# CORS 설정 (여러 출처에서의 요청을 허용)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 모든 출처 허용 (필요시 도메인 추가)
    allow_credentials=True,
    allow_methods=["*"],  # 모든 HTTP 메서드 허용
    allow_headers=["*"],  # 모든 헤더 허용
)

# /user 경로로 들어오는 요청을 account 라우터에서 처리
app.include_router(account.router, prefix="/user", tags=["user"])

# 서버 시작 시 확인 메시지
@app.on_event("startup")
async def startup():
    print("FastAPI 서버가 시작되었습니다.")

# 서버 종료 시 확인 메시지
@app.on_event("shutdown")
async def shutdown():
    print("FastAPI 서버가 종료되었습니다.")
