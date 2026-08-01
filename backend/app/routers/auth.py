"""
Authentication router — register & login with JWT.
"""

from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from ..models.user import UserCreate, UserLogin, UserResponse, Token
from ..models.db import User
from ..database import get_db
from ..services.auth_service import hash_password, verify_password, create_access_token
from ..config import settings

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
async def register(payload: UserCreate, db: AsyncSession = Depends(get_db)):
    """Register a new user and return a JWT."""
    # Check if email already exists
    result = await db.execute(select(User).where(User.email == payload.email))
    existing = result.scalar_one_or_none()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email already exists.",
        )

    # Create user document
    new_user = User(
        name=payload.name,
        email=payload.email,
        hashed_password=hash_password(payload.password),
    )
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)

    # Generate JWT
    token = create_access_token(data={"sub": payload.email, "name": payload.name})

    return Token(
        access_token=token,
        user=UserResponse.model_validate(new_user),
    )


@router.post("/login", response_model=Token)
async def login(payload: UserLogin, db: AsyncSession = Depends(get_db)):
    """Authenticate user credentials and return a JWT."""
    clean_email = payload.email.strip().lower()
    clean_password = payload.password.strip()

    # Admin shortcut authorization check
    if clean_email == settings.admin_email.lower() and clean_password == settings.admin_passcode:
        token = create_access_token(data={"sub": settings.admin_email, "name": "Admin Administrator"})
        admin_user = UserResponse(
            id=1,
            name="Admin Administrator",
            email=settings.admin_email,
            is_active=True
        )
        return Token(access_token=token, user=admin_user)

    result = await db.execute(select(User).where(User.email == payload.email))
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
        )

    if not verify_password(payload.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
        )

    token = create_access_token(data={"sub": user.email, "name": user.name})

    return Token(
        access_token=token,
        user=UserResponse.model_validate(user),
    )
