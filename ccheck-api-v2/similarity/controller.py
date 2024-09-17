from fastapi import Depends, APIRouter
from sqlmodel import Session

from database import engine
from similarity import service
from similarity.types import Request1, Request2


def get_session():
    with Session(engine) as session:
        yield session


router = APIRouter(prefix="/similarities", tags=["Similarity"])


@router.get("/")
def calculated_sim(session: Session = Depends(get_session)):
    return service.calculated_similarity(session)


@router.post("/")
def similarity_by_boundary(request: Request1, session: Session = Depends(get_session)):
    return service.get_similarity_by_boundary(request, session)


@router.post("/ratio-of-labeling")
def ratio_of_labeling(request: Request1, session: Session = Depends(get_session)):
    return service.calculate_ratio_of_labeling(request, session)


@router.post("/sum-of-ratio-multiplied-by-weight")
def get_sum_of_ratio_multiplied_by_weight(
    request: Request1, session: Session = Depends(get_session)
):
    return service.calculate_sum_of_ratio_multiplied_by_weight(request, session)


@router.post("/similarity-by-label")
def similarity_by_label(request: Request2, session: Session = Depends(get_session)):
    return service.get_similarity_by_label(request, session)
