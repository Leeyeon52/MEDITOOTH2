from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Patient
import bcrypt
import re

# router 객체를 정의
router = APIRouter()

# 로그인 요청에 대한 처리
class LoginRequest(BaseModel):
    email: str
    password: str

@router.post("/login")
async def login(req: LoginRequest, db: Session = Depends(get_db)):
    # 데이터베이스에서 이메일로 사용자 조회
    user = db.query(Patient).filter(Patient.email == req.email).first()
    
    if not user:
        raise HTTPException(status_code=400, detail="아이디 또는 비밀번호를 확인해주세요.")
    
    # 비밀번호 확인 (bcrypt로 해싱된 비밀번호와 비교)
    if not bcrypt.checkpw(req.password.encode('utf-8'), user.password.encode('utf-8')):
        raise HTTPException(status_code=400, detail="아이디 또는 비밀번호를 확인해주세요.")
    
    return {"message": "로그인 성공"}

# 회원 정보 수정 요청 스키마
class UserUpdateRequest(BaseModel):
    email: str
    name: str

# 비밀번호 변경 요청 스키마
class ChangePasswordRequest(BaseModel):
    email: str
    current_password: str
    new_password: str

# 비밀번호 해싱 함수 (bcrypt 사용)
def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')

# 비밀번호 검증 함수
def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

# 새 비밀번호 유효성 검사 (길이, 대문자, 특수문자 포함)
def validate_password(password: str) -> bool:
    # 최소 8자 이상, 대문자, 특수문자 포함 여부 확인
    if len(password) < 8:
        return False
    if not re.search(r"[A-Z]", password):  # 대문자 포함 여부
        return False
    if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", password):  # 특수문자 포함 여부
        return False
    return True

# 회원 정보 수정 API (이름 변경)
@router.put("/update", summary="회원 정보 수정")
def update_user(user: UserUpdateRequest, db: Session = Depends(get_db)):
    user_to_update = db.query(Patient).filter(Patient.email == user.email).first()
    if not user_to_update:
        raise HTTPException(status_code=404, detail="User not found")
    
    user_to_update.name = user.name  # 이름 수정
    db.commit()
    return {"message": "User updated successfully"}

# 비밀번호 변경 API
@router.put("/change-password", summary="비밀번호 변경")
def change_password(passwords: ChangePasswordRequest, db: Session = Depends(get_db)):
    user_to_update = db.query(Patient).filter(Patient.email == passwords.email).first()
    if not user_to_update:
        raise HTTPException(status_code=404, detail="User not found")
    
    # 현재 비밀번호 검증
    if not verify_password(passwords.current_password, user_to_update.password):
        raise HTTPException(status_code=400, detail="Current password is incorrect")
    
    # 새 비밀번호 유효성 검사
    if not validate_password(passwords.new_password):
        raise HTTPException(status_code=400, detail="New password does not meet the criteria: minimum 8 characters, at least one uppercase letter, and at least one special character.")
    
    # 새 비밀번호는 해싱 후 저장
    user_to_update.password = hash_password(passwords.new_password)
    
    db.commit()
    return {"message": "Password changed successfully"}
