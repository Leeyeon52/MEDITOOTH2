from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Patient
import bcrypt
import re

# ✅ /user prefix 적용
router = APIRouter(prefix="/user")

# ========================== 모델 ==========================
class LoginRequest(BaseModel):
    email: str
    password: str

class UserUpdateRequest(BaseModel):
    email: str
    name: str

class ChangePasswordRequest(BaseModel):
    email: str
    current_password: str
    new_password: str

# ========================== 유틸 함수 ==========================
def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

def validate_password(password: str) -> bool:
    if len(password) < 8:
        return False
    if not re.search(r"[A-Z]", password):
        return False
    if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", password):
        return False
    return True

# ========================== API ==========================
# ✅ 로그인 API
@router.post("/login", summary="로그인")
async def login(req: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(Patient).filter(Patient.email == req.email).first()

    if not user or not verify_password(req.password, user.password):
        raise HTTPException(status_code=400, detail="아이디 또는 비밀번호를 확인해주세요.")
    
    return {"message": "로그인 성공"}

# ✅ 유저 정보 불러오기 API (쿼리 파라미터로 email 받기)
@router.get("/account", summary="유저 정보 조회")
def get_account(email: str, db: Session = Depends(get_db)):
    user = db.query(Patient).filter(Patient.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return {
        "users": [
            {
                "email": user.email,
                "name": user.name
            }
        ]
    }

# ✅ 회원 정보 수정 API
@router.put("/update", summary="회원 정보 수정")
def update_user(user: UserUpdateRequest, db: Session = Depends(get_db)):
    user_to_update = db.query(Patient).filter(Patient.email == user.email).first()
    if not user_to_update:
        raise HTTPException(status_code=404, detail="User not found")

    user_to_update.name = user.name
    db.commit()
    return {"message": "User updated successfully"}

# ✅ 비밀번호 변경 API
@router.put("/change-password", summary="비밀번호 변경")
def change_password(passwords: ChangePasswordRequest, db: Session = Depends(get_db)):
    user_to_update = db.query(Patient).filter(Patient.email == passwords.email).first()
    if not user_to_update:
        raise HTTPException(status_code=404, detail="User not found")

    if not verify_password(passwords.current_password, user_to_update.password):
        raise HTTPException(status_code=400, detail="현재 비밀번호가 올바르지 않습니다.")

    if not validate_password(passwords.new_password):
        raise HTTPException(
            status_code=400,
            detail="비밀번호는 최소 8자, 대문자 1개, 특수문자 1개를 포함해야 합니다."
        )

    user_to_update.password = hash_password(passwords.new_password)
    db.commit()
    return {"message": "Password changed successfully"}

# ✅ 회원 탈퇴 API (쿼리 파라미터로 email 받기)
@router.delete("/delete", summary="회원 탈퇴")
def delete_account(email: str, db: Session = Depends(get_db)):
    user_to_delete = db.query(Patient).filter(Patient.email == email).first()
    if not user_to_delete:
        raise HTTPException(status_code=404, detail="User not found")

    db.delete(user_to_delete)
    db.commit()
    return {"message": "User deleted successfully"}
