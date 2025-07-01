from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base

class Patient(Base):
    __tablename__ = "patients"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    name = Column(String(255), nullable=False)

    # 관계 설정: 하나의 환자 -> 여러 로그인 기록
    login_records = relationship("LoginRecord", back_populates="patient", cascade="all, delete-orphan")


class LoginRecord(Base):
    __tablename__ = "login_records"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"), nullable=False)
    login_time = Column(DateTime(timezone=True), server_default=func.now())
    ip_address = Column(String(45), nullable=True)

    # 관계 설정: 로그인 기록 -> 환자
    patient = relationship("Patient", back_populates="login_records")
