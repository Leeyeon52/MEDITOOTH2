from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base, Session

# ✅ MySQL 연결 정보
SQLALCHEMY_DATABASE_URL = "mysql+pymysql://root:4907@localhost/meditooth?charset=utf8mb4"


# 예시:
# SQLALCHEMY_DATABASE_URL = "mysql+pymysql://root:yourpassword@localhost/meditooth?charset=utf8mb4"

# ✅ DB 엔진 생성
engine = create_engine(SQLALCHEMY_DATABASE_URL)

# ✅ 세션 로컬 클래스 생성
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# ✅ Base 클래스 선언 (모든 모델의 부모)
Base = declarative_base()

# ✅ DB 세션 종속성 (FastAPI에서 사용)
def get_db():
    db: Session = SessionLocal()
    try:
        yield db
    finally:
        db.close()
