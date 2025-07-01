from fastapi import FastAPI
from app.routers import account  # account.py에서 만든 router 임포트

app = FastAPI()

# 라우터 등록
app.include_router(account.router)

# CORS 설정
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 모든 도메인 허용 (필요에 따라 변경)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
