from app.database import Base, engine
from app import models  # Patient, LoginRecord 모델 import를 통해 테이블 생성 가능

# 모든 테이블을 DB에 생성
Base.metadata.create_all(bind=engine)

print("✅ MySQL 테이블 생성 완료")
