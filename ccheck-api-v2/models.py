from datetime import datetime
from typing import List, Optional

from sqlmodel import Field, SQLModel, Relationship


class DegreeBase(SQLModel):
    name: str = Field()


class Degrees(DegreeBase, table=True):
    id: int = Field(primary_key=True)
    curriculums: List["Curriculums"] = Relationship(back_populates="degree")


class FacultyGroupBase(SQLModel):
    name: str = Field()


class FacultyGroups(FacultyGroupBase, table=True):
    __tablename__ = "faculty_groups"
    id: int = Field(primary_key=True)
    faculties: List["Faculties"] = Relationship(back_populates="faculty_group")


class FacultyBase(SQLModel):
    name: str = Field()
    faculty_group_id: int = Field(foreign_key="faculty_groups.id")


class Faculties(FacultyBase, table=True):
    id: int = Field(primary_key=True)
    faculty_group: FacultyGroups = Relationship(back_populates="faculties")
    curriculums: List["Curriculums"] = Relationship(back_populates="faculty")


class CurriculumBase(SQLModel):
    id: str = Field(max_length=14, index=True)
    name: str = Field()
    year: str = Field(max_length=4, index=True)
    philosophy: Optional[str] = Field(default=None)
    description: Optional[str] = Field(default=None)
    objective: Optional[str] = Field(default=None)
    ability: Optional[str] = Field(default=None)
    partner: Optional[str] = Field(default=None)
    global_partner: Optional[str] = Field(default=None)
    industry: Optional[str] = Field(default=None)
    cwie: Optional[str] = Field(default=None)
    eec_model: Optional[str] = Field(default=None)
    graduate_in_year: int = Field(default=4)
    show_status: int = Field(default=1, index=True)
    version: int = Field(default=1, index=True)
    degree_id: int = Field(foreign_key="degrees.id")
    faculty_id: int = Field(foreign_key="faculties.id")


class Curriculums(CurriculumBase, table=True):
    pk: int = Field(primary_key=True)
    degree: Degrees = Relationship(back_populates="curriculums")
    faculty: Faculties = Relationship(back_populates="curriculums")
    subjects: List["Subjects"] = Relationship(back_populates="curriculum")


class CurriculumWithDegreeAndFaculty(CurriculumBase):
    degree: Degrees
    faculty: Faculties


class Files(SQLModel, table=True):
    id: int = Field(primary_key=True)
    name: str = Field()
    path: str = Field()
    created_at: datetime = Field(default_factory=datetime.now)


class SubjectTypeBase(SQLModel):
    name: str = Field()


class SubjectTypes(SubjectTypeBase, table=True):
    __tablename__ = "subject_types"
    id: int = Field(primary_key=True)
    subjects: List["Subjects"] = Relationship(back_populates="subject_type")


class SubjectOccupationTypeBase(SQLModel):
    name: str = Field()


class SubjectOccupationTypes(SubjectOccupationTypeBase, table=True):
    __tablename__ = "subject_occupation_types"
    id: int = Field(primary_key=True)
    subjects: List["Subjects"] = Relationship(back_populates="subject_occupation_type")


class SubjectBase(SQLModel):
    curriculum_pk: int = Field(foreign_key="curriculums.pk")
    subject_type_id: int = Field(foreign_key="subject_types.id")
    subject_occupation_id: int = Field(foreign_key="subject_occupation_types.id")
    id: str = Field(max_length=8, index=True)
    name_th: str = Field()
    name_en: str = Field()
    desc_th: str = Field()
    desc_en: str = Field()
    overall_credit: Optional[int] = Field(default=None)
    self_learn_credit: Optional[int] = Field(default=None)
    lecture_credit: Optional[int] = Field(default=None)
    lab_credit: Optional[int] = Field(default=None)


class Subjects(SubjectBase, table=True):
    pk: int = Field(primary_key=True)
    curriculum: Curriculums = Relationship(back_populates="subjects")
    subject_type: SubjectTypes = Relationship(back_populates="subjects")
    subject_occupation_type: SubjectOccupationTypes = Relationship(
        back_populates="subjects",
    )


class SimilarityBase(SQLModel):
    subject_pk_1: int = Field()
    subject_pk_2: int = Field()
    similarity: float = Field()


class Similarities(SimilarityBase, table=True):
    id: int = Field(primary_key=True)
