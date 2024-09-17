import os.path
from time import time

import nltk
import pandas as pd
from fastapi import FastAPI, HTTPException, UploadFile, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from ldap3 import Server, Connection, ALL
from nltk.corpus import stopwords
from pydantic import BaseModel
from sklearn.feature_extraction.text import TfidfVectorizer
from sqlmodel import Session, select

from database import engine
from models import (
    Degrees,
    Faculties,
    Curriculums,
    Files,
    SubjectTypes,
    SubjectOccupationTypes,
    Subjects,
)
from similarity import controller as similarity_controller

nltk.download("stopwords")
stop_words = set(stopwords.words("english"))

tfidf = TfidfVectorizer()

app = FastAPI()
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


CURRICULUM_COLUMNS = {
    "Academic program code",
    "Academic program",
    "Education level",
    "Faculty",
    "Academic year of program initiation",
    "Program philosophy",
    "Program description",
    "Program educational objectives",
    "Program Learning Outcomes",
    "Collaborative networks supporting academic program",
    "Details of international/National collaborative",
    "Academic program accord with business opportunities: classified by industry",
    "Academic program instruction following CWIE Model",
    "Academic program instruction following EEC Model",
    "Duration of study",
    "Version",
}

SUBJECT_COLUMNS = {
    "Academic program code",
    "Academic year of program initiation",
    "Academic program version",
    "Course code",
    "Course title (Thai)",
    "Course title (English)",
    "Course description (Thai)",
    "Course description (English)",
    "Course credit",
    "Course credit (lecture)",
    "Course credit (lab)",
    "Course credit (self study)",
    "Course type",
    "Course occupation type",
}


class LoginForm(BaseModel):
    username: str
    password: str


def get_session():
    with Session(engine) as session:
        yield session


@app.post("/login", tags=["Authentication"])
def login(login_data: LoginForm):
    try:
        server = Server("10.5.1.80", get_info=ALL)
        conn = Connection(
            server,
            user=f"BUU\\{login_data.username}",
            password=f"{login_data.password}",
        )
        conn.bind()
        conn.search(
            "ou=People,dc=buu,dc=ac,dc=th",
            f"(|(cn={login_data.username}))",
            attributes=["cn", "mail", "displayName"],
        )
        if (
            conn.entries[0].entry_dn
            and conn.entries[0]["cn"]
            and conn.entries[0]["mail"]
            and conn.entries[0]["displayName"]
        ):
            print(conn.entries[0])
            return {
                "info": f"{conn.entries[0].entry_dn}",
                "username": f"{conn.entries[0]['cn']}",
                "email": f"{conn.entries[0]['mail']}",
                "name": f"{conn.entries[0]['displayName']}",
                "auth": True,
            }
        else:
            raise HTTPException(400)
    except Exception as e:
        raise HTTPException(400)


@app.get("/excel-template/{filename}", tags=["Excel Template"])
def get_excel_template(filename: str):
    return FileResponse(
        f"./xlsx_template/{filename}.xlsx",
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        filename=f"{filename}-template.xlsx",
    )


@app.post("/curriculums/upload", tags=["Curriculum"])
def upload_curriculums(file: UploadFile, session: Session = Depends(get_session)):
    timestamp = int(time() * 1000)
    file_name = f"curriculums_{timestamp}.xlsx"
    file_path = f"./uploaded/{file_name}"

    with open(file_path, "wb") as buffer:
        buffer.write(file.file.read())

    if not os.path.isfile(file_path):
        raise HTTPException(500, "File not found")

    try:
        df = pd.read_excel(file_path, sheet_name="curriculum_data")
    except ValueError:
        os.remove(file_path)
        raise HTTPException(400, "กรุณาตรวจสอบไฟล์ Excel อีกครั้ง ชื่อชีทไม่ถูกต้อง")

    if set(df.columns) != CURRICULUM_COLUMNS:
        err_msg = "กรุณาตรวจสอบไฟล์ Excel อีกครั้ง คอลัมน์ไม่ถูกต้อง"
        difference = CURRICULUM_COLUMNS.difference(set(df.columns))
        if difference:
            err_msg += f" คอลัมน์ที่ต้องการเพิ่มเติม: {difference}"
        difference2 = set(df.columns).difference(CURRICULUM_COLUMNS)
        if difference2:
            err_msg += f" คอลัมน์ที่เกิน: {difference2}"
        os.remove(file_path)
        raise HTTPException(400, err_msg)

    df = df.rename(
        columns={
            "Academic program code": "id",
            "Academic program": "name",
            "Education level": "degree",
            "Faculty": "faculty",
            "Academic year of program initiation": "year",
            "Program philosophy": "philosophy",
            "Program description": "description",
            "Program educational objectives": "objective",
            "Program Learning Outcomes": "ability",
            "Collaborative networks supporting academic program": "partner",
            "Details of international/National collaborative": "global_partner",
            "Academic program accord with business opportunities: classified by industry": "industry",
            "Academic program instruction following CWIE Model": "cwie",
            "Academic program instruction following EEC Model": "eec_model",
            "Duration of study": "graduate_in_year",
            "Version": "version",
        }
    )

    df["graduate_in_year"] = df["graduate_in_year"].fillna(4)
    df["show_status"] = 1
    df["version"] = df["version"].fillna(1)

    df = df.astype(
        {
            "id": str,
            "name": str,
            "degree": str,
            "faculty": str,
            "year": str,
            "philosophy": str,
            "description": str,
            "objective": str,
            "ability": str,
            "partner": str,
            "global_partner": str,
            "industry": str,
            "cwie": str,
            "eec_model": str,
            "graduate_in_year": int,
            "version": int,
        }
    )

    df["id"] = df["id"].str.strip(".0")

    df["is_id_valid"] = df["id"].apply(str).str.contains("^[0-9]{14}$")
    invalid_id = [i + 1 for i in df[~df["is_id_valid"]].index]
    if invalid_id:
        os.remove(file_path)
        raise HTTPException(400, f"รหัสหลักสูตรต้องเป็นตัวเลข 14 หลัก ข้อมูลแถวที่: {invalid_id}")
    df = df.drop(columns=["is_id_valid"])

    df["is_year_valid"] = df["year"].apply(str).str.contains("^[0-9]{4}$")
    invalid_year = [i + 1 for i in df[~df["is_year_valid"]].index]
    if invalid_year:
        os.remove(file_path)
        raise HTTPException(400, f"ปีหลักสูตรต้องเป็นตัวเลข 4 หลัก ข้อมูลแถวที่: {invalid_year}")
    df = df.drop(columns=["is_year_valid"])

    degrees = session.exec(select(Degrees)).all()
    degrees_name = {degree.name: degree.id for degree in degrees}
    df["is_degree_valid"] = df["degree"].map(degrees_name).notna()
    invalid_degree = [i + 1 for i in df[~df["is_degree_valid"]].index]
    if invalid_degree:
        os.remove(file_path)
        raise HTTPException(400, f"ไม่พบระดับการศึกษา ข้อมูลแถวที่: {invalid_degree}")
    df["degree_id"] = df["degree"].map(degrees_name)
    df = df.drop(columns=["is_degree_valid", "degree"])

    faculties = session.exec(select(Faculties)).all()
    faculties_name = {faculty.name: faculty.id for faculty in faculties}
    df["is_faculty_valid"] = df["faculty"].map(faculties_name).notna()
    invalid_faculty = [i + 1 for i in df[~df["is_faculty_valid"]].index]
    if invalid_faculty:
        os.remove(file_path)
        raise HTTPException(
            400, f"ไม่พบคณะ ข้อมูลแถวที่: {df[~df['is_faculty_valid']]['id'].unique()}"
        )
    df["faculty_id"] = df["faculty"].map(faculties_name)
    df = df.drop(columns=["is_faculty_valid", "faculty"])

    df["is_name_valid"] = df["name"].apply(str).str.len() > 3
    invalid_name = [i + 1 for i in df[~df["is_name_valid"]].index]
    if invalid_name:
        os.remove(file_path)
        raise HTTPException(400, f"ชื่อหลักสูตรต้องมากกว่า 3 ตัวอักษร ข้อมูลแถวที่: {invalid_name}")
    df = df.drop(columns=["is_name_valid"])

    def insert_curriculum(row):
        row = row.to_dict()
        nullable_columns = [
            "philosophy",
            "description",
            "objective",
            "ability",
            "partner",
            "global_partner",
            "industry",
            "cwie",
            "eec_model",
        ]
        for column in nullable_columns:
            row[column] = row[column] if row[column] != "nan" else None

        new = Curriculums(
            id=row["id"],
            name=row["name"],
            year=row["year"],
            philosophy=row["philosophy"],
            description=row["description"],
            objective=row["objective"],
            ability=row["ability"],
            partner=row["partner"],
            global_partner=row["global_partner"],
            industry=row["industry"],
            cwie=row["cwie"],
            eec_model=row["eec_model"],
            graduate_in_year=row["graduate_in_year"],
            show_status=1,
            version=row["version"],
            degree_id=row["degree_id"],
            faculty_id=row["faculty_id"],
        )

        curriculum_exists = session.exec(
            select(Curriculums).where(
                Curriculums.id == new.id,
                Curriculums.year == new.year,
                Curriculums.version == new.version,
            )
        ).first()

        if curriculum_exists:
            curriculum_exists.name = new.name
            curriculum_exists.philosophy = new.philosophy
            curriculum_exists.description = new.description
            curriculum_exists.objective = new.objective
            curriculum_exists.ability = new.ability
            curriculum_exists.partner = new.partner
            curriculum_exists.global_partner = new.global_partner
            curriculum_exists.industry = new.industry
            curriculum_exists.cwie = new.cwie
            curriculum_exists.eec_model = new.eec_model
            curriculum_exists.graduate_in_year = new.graduate_in_year
            curriculum_exists.show_status = 1
            curriculum_exists.faculty_id = new.faculty_id
            curriculum_exists.degree_id = new.degree_id
            session.add(curriculum_exists)
            session.commit()
            session.refresh(curriculum_exists)
        else:
            session.add(new)
            session.commit()

    df.apply(insert_curriculum, axis=1)
    file = Files(
        name=file_name,
        path=file_path,
    )
    session.add(file)
    session.commit()
    return {"message": "นำเข้าข้อมูลทั้งหมดสำเร็จ"}


@app.post("/subjects/upload", tags=["Subject"])
def upload_subjects(file: UploadFile, session: Session = Depends(get_session)):
    timestamp = int(time() * 1000)
    file_name = f"subjects_{timestamp}.xlsx"
    file_path = f"./uploaded/{file_name}"

    with open(file_path, "wb") as buffer:
        buffer.write(file.file.read())

    if not os.path.isfile(file_path):
        raise HTTPException(500, "File not found")

    try:
        df = pd.read_excel(file_path, sheet_name="subject_data")
    except ValueError:
        os.remove(file_path)
        raise HTTPException(400, "กรุณาตรวจสอบไฟล์ Excel อีกครั้ง ชื่อชีทไม่ถูกต้อง")

    if set(df.columns) != SUBJECT_COLUMNS:
        err_msg = "กรุณาตรวจสอบไฟล์ Excel อีกครั้ง คอลัมน์ไม่ถูกต้อง"
        difference = SUBJECT_COLUMNS.difference(set(df.columns))
        if difference:
            err_msg += f" คอลัมน์ที่ต้องการเพิ่มเติม: {difference}"
        difference2 = set(df.columns).difference(SUBJECT_COLUMNS)
        if difference2:
            err_msg += f" คอลัมน์ที่เกิน: {difference2}"
        os.remove(file_path)
        raise HTTPException(400, err_msg)

    df = df.rename(
        columns={
            "Academic program code": "curriculum_id",
            "Academic year of program initiation": "year",
            "Academic program version": "version",
            "Course code": "id",
            "Course title (Thai)": "name_th",
            "Course title (English)": "name_en",
            "Course description (Thai)": "desc_th",
            "Course description (English)": "desc_en",
            "Course credit": "overall_credit",
            "Course credit (lecture)": "lecture_credit",
            "Course credit (lab)": "lab_credit",
            "Course credit (self study)": "self_learn_credit",
            "Course type": "subject_type",
            "Course occupation type": "subject_occupation",
        }
    )

    df["version"] = df["version"].fillna(1)
    df["subject_type"] = df["subject_type"].fillna("ไม่ระบุ")
    df["subject_occupation"] = df["subject_occupation"].fillna("ไม่เป็นวิชาชีพ")

    df = df.astype(
        {
            "curriculum_id": str,
            "year": str,
            "version": int,
            "id": str,
            "name_th": str,
            "name_en": str,
            "desc_th": str,
            "desc_en": str,
            "overall_credit": int,
            "lecture_credit": int,
            "lab_credit": int,
            "self_learn_credit": int,
            "subject_type": str,
            "subject_occupation": str,
        }
    )

    df["curriculum_id"] = df["curriculum_id"].str.strip(".0")
    df["id"] = df["id"].str.strip(".0")

    df["is_curriculum_id_valid"] = (
        df["curriculum_id"].apply(str).str.contains("^[0-9]{14}$")
    )
    invalid_curriculum_id = [i + 1 for i in df[~df["is_curriculum_id_valid"]].index]
    if invalid_curriculum_id:
        os.remove(file_path)
        raise HTTPException(
            400, f"รหัสหลักสูตรต้องเป็นตัวเลข 14 หลัก ข้อมูลแถวที่: {invalid_curriculum_id}"
        )
    df = df.drop(columns=["is_curriculum_id_valid"])

    df["is_year_valid"] = df["year"].apply(str).str.contains("^[0-9]{4}$")
    invalid_year = [i + 1 for i in df[~df["is_year_valid"]].index]
    if invalid_year:
        os.remove(file_path)
        raise HTTPException(400, f"ปีหลักสูตรต้องเป็นตัวเลข 4 หลัก ข้อมูลแถวที่: {invalid_year}")
    df = df.drop(columns=["is_year_valid"])

    def find_curriculum(row):
        curriculum = session.exec(
            select(Curriculums).where(
                Curriculums.id == row["curriculum_id"],
                Curriculums.year == row["year"],
                Curriculums.version == row["version"],
            )
        ).first()
        if curriculum:
            return curriculum.pk
        else:
            return None

    df["curriculum_pk"] = df.apply(find_curriculum, axis=1)
    invalid_curriculum = [i + 1 for i in df[df["curriculum_pk"].isna()].index]
    if invalid_curriculum:
        os.remove(file_path)
        raise HTTPException(
            400,
            f"ไม่พบหลักสูตร ข้อมูลแถวที่: {invalid_curriculum}",
        )
    df = df.drop(columns=["curriculum_id", "year", "version"])

    subject_types = session.exec(select(SubjectTypes)).all()
    subject_types_name = {
        subject_type.name: subject_type.id for subject_type in subject_types
    }
    df["is_subject_type_valid"] = df["subject_type"].map(subject_types_name).notna()
    invalid_subject_type = [i + 1 for i in df[~df["is_subject_type_valid"]].index]
    if invalid_subject_type:
        os.remove(file_path)
        raise HTTPException(
            400,
            f"ไม่พบประเภทวิชา ข้อมูลแถวที่: {invalid_subject_type}",
        )
    df["subject_type_id"] = df["subject_type"].map(subject_types_name)
    df = df.drop(columns=["is_subject_type_valid", "subject_type"])

    subject_occupation_types = session.exec(select(SubjectOccupationTypes)).all()
    subject_occupation_types_name = {
        subject_occupation_type.name: subject_occupation_type.id
        for subject_occupation_type in subject_occupation_types
    }
    df["is_subject_occupation_valid"] = (
        df["subject_occupation"].map(subject_occupation_types_name).notna()
    )
    invalid_subject_occupation = [
        i + 1 for i in df[~df["is_subject_occupation_valid"]].index
    ]
    if invalid_subject_occupation:
        os.remove(file_path)
        raise HTTPException(
            400,
            f"ไม่พบประเภทวิชาชีพ ข้อมูลแถวที่: {invalid_subject_occupation}",
        )
    df["subject_occupation_id"] = df["subject_occupation"].map(
        subject_occupation_types_name
    )
    df = df.drop(columns=["is_subject_occupation_valid", "subject_occupation"])

    df["is_name_th_valid"] = df["name_th"].apply(str).str.len() > 3
    invalid_name_th = [i + 1 for i in df[~df["is_name_th_valid"]].index]
    if invalid_name_th:
        os.remove(file_path)
        raise HTTPException(
            400, f"ชื่อวิชาภาษาไทยต้องมากกว่า 3 ตัวอักษร ข้อมูลแถวที่: {invalid_name_th}"
        )
    df = df.drop(columns=["is_name_th_valid"])

    df["is_name_en_valid"] = df["name_en"].apply(str).str.len() > 3
    invalid_name_en = [i + 1 for i in df[~df["is_name_en_valid"]].index]
    if invalid_name_en:
        os.remove(file_path)
        raise HTTPException(
            400, f"ชื่อวิชาภาษาอังกฤษต้องมากกว่า 3 ตัวอักษร ข้อมูลแถวที่: {invalid_name_en}"
        )
    df = df.drop(columns=["is_name_en_valid"])

    df["is_desc_th_valid"] = df["desc_th"].apply(str).str.len() > 3
    invalid_desc_th = [i + 1 for i in df[~df["is_desc_th_valid"]].index]
    if invalid_desc_th:
        os.remove(file_path)
        raise HTTPException(
            400, f"คำอธิบายวิชาภาษาไทยต้องมากกว่า 3 ตัวอักษร ข้อมูลแถวที่: {invalid_desc_th}"
        )
    df = df.drop(columns=["is_desc_th_valid"])

    df["is_desc_en_valid"] = df["desc_en"].apply(str).str.len() > 3
    invalid_desc_en = [i + 1 for i in df[~df["is_desc_en_valid"]].index]
    if invalid_desc_en:
        os.remove(file_path)
        raise HTTPException(
            400, f"คำอธิบายวิชาภาษาอังกฤษต้องมากกว่า 3 ตัวอักษร ข้อมูลแถวที่: {invalid_desc_en}"
        )
    df = df.drop(columns=["is_desc_en_valid"])

    def insert_subject(row):
        row = row.to_dict()
        nullable_columns = [
            "overall_credit",
            "lecture_credit",
            "lab_credit",
            "self_learn_credit",
        ]
        for column in nullable_columns:
            row[column] = row[column] if row[column] != "nan" else None

        new = Subjects(
            curriculum_pk=row["curriculum_pk"],
            subject_type_id=row["subject_type_id"],
            subject_occupation_id=row["subject_occupation_id"],
            id=row["id"],
            name_th=row["name_th"],
            name_en=row["name_en"],
            desc_th=row["desc_th"],
            desc_en=row["desc_en"],
            overall_credit=row["overall_credit"],
            lecture_credit=row["lecture_credit"],
            lab_credit=row["lab_credit"],
            self_learn_credit=row["self_learn_credit"],
        )

        subject_exists = session.exec(
            select(Subjects).where(
                Subjects.curriculum_pk == new.curriculum_pk,
                Subjects.id == new.id,
            )
        ).first()

        if subject_exists:
            subject_exists.subject_type_id = new.subject_type_id
            subject_exists.subject_occupation_id = new.subject_occupation_id
            subject_exists.name_th = new.name_th
            subject_exists.name_en = new.name_en
            subject_exists.desc_th = new.desc_th
            subject_exists.desc_en = new.desc_en
            subject_exists.overall_credit = new.overall_credit
            subject_exists.lecture_credit = new.lecture_credit
            subject_exists.lab_credit = new.lab_credit
            subject_exists.self_learn_credit = new.self_learn_credit
            session.add(subject_exists)
            session.commit()
            session.refresh(subject_exists)
        else:
            session.add(new)
            session.commit()

    df.apply(insert_subject, axis=1)
    file = Files(
        name=file_name,
        path=file_path,
    )
    session.add(file)
    session.commit()
    return {"message": "นำเข้าข้อมูลทั้งหมดสำเร็จ"}


app.include_router(similarity_controller.router)
