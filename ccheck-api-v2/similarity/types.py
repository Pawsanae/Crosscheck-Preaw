from typing import List
from pydantic import BaseModel


class Boundary(BaseModel):
    boundary_name: str
    upper_boundary: float
    lower_boundary: float
    weight: float


class Request1(BaseModel):
    primary_curriculum_pk: int
    compare_curriculum_pk: int
    boundary: List[Boundary]

    class Config:
        json_schema_extra = {
            "examples": [
                {
                    "primary_curriculum_pk": 1,
                    "compare_curriculum_pk": 2,
                    "boundary": [
                        {
                            "boundary_name": "red",
                            "upper_boundary": 1,
                            "lower_boundary": 0.795,
                            "weight": 0.4,
                        },
                        {
                            "boundary_name": "orange",
                            "upper_boundary": 0.795,
                            "lower_boundary": 0.595,
                            "weight": 0.3,
                        },
                        {
                            "boundary_name": "yellow",
                            "upper_boundary": 0.595,
                            "lower_boundary": 0.395,
                            "weight": 0.2,
                        },
                        {
                            "boundary_name": "light green",
                            "upper_boundary": 0.395,
                            "lower_boundary": 0.195,
                            "weight": 0.1,
                        },
                        {
                            "boundary_name": "green",
                            "upper_boundary": 0.195,
                            "lower_boundary": 0,
                            "weight": 0,
                        },
                    ],
                }
            ]
        }


class Request2(BaseModel):
    primary_curriculum_pk: int
    compare_curriculum_pk: int
    boundary: Boundary

    class Config:
        json_schema_extra = {
            "examples": [
                {
                    "primary_curriculum_pk": 1,
                    "compare_curriculum_pk": 2,
                    "boundary": {
                        "boundary_name": "red",
                        "upper_boundary": 1,
                        "lower_boundary": 0.795,
                        "weight": 0.4,
                    },
                }
            ]
        }
