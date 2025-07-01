from fastapi import APIRouter, HTTPException, Depends, Body
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Patient
from pydantic import BaseModel

router = APIRouter()

# 요청 바디 스키마
class DeleteUserRequest(BaseModel):
    email: str

# 회원 탈퇴 API
@router.delete("/user/delete", summary="회원 탈퇴")
def delete_user(req: DeleteUserRequest = Body(...), db: Session = Depends(get_db)):
    user = db.query(Patient).filter(Patient.email == req.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="유저를 찾을 수 없습니다.")
    db.delete(user)
    db.commit()
    return {"message": "회원 탈퇴가 완료되었습니다."}

# 계정 정보 조회 API
@router.get("/user/account", summary="계정 정보 조회")
def get_account(db: Session = Depends(get_db)):
    users = db.query(Patient).all()
    return {"users": users}
