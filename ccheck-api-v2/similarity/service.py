from time import perf_counter

import nltk
import numpy as np
import pandas as pd
from nltk.corpus import stopwords
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sqlalchemy import text
from sqlmodel import Session, select, or_, and_

from models import Subjects, Similarities, SubjectTypes
from similarity.types import Request1, Request2

nltk.download("stopwords")
stop_words = set(stopwords.words("english"))

tfidf = TfidfVectorizer()


def remove_special_characters(string: str):
    string = string.lower()
    words = string.split()
    return " ".join(word for word in words if word.isalnum())


def remove_stopwords(string: str):
    words = string.split()
    return " ".join(word for word in words if word not in stop_words)


def stem_words(string: str):
    words = string.split()
    stemmer = nltk.PorterStemmer()
    return " ".join(stemmer.stem(word) for word in words)


def save_similarity(row):
    return Similarities(
        subject_pk_1=row["subject_pk_1"],
        subject_pk_2=row["subject_pk_2"],
        similarity=row["similarity"],
    )


def calculated_similarity(session: Session):
    subjects_db = session.exec(select(Subjects)).all()
    subjects_list = [
        [subject.pk, subject.id, subject.desc_en] for subject in subjects_db
    ]
    df = pd.DataFrame(subjects_list, columns=["pk", "id", "desc"])

    start = perf_counter()
    df["desc"] = df["desc"].apply(remove_special_characters)
    print("remove special characters: ", perf_counter() - start)

    start = perf_counter()
    df["desc"] = df["desc"].apply(remove_stopwords)
    print("remove stopwords: ", perf_counter() - start)

    start = perf_counter()
    df["desc"] = df["desc"].apply(stem_words)
    print("stem words: ", perf_counter() - start)

    start = perf_counter()
    tfidf_matrix = tfidf.fit_transform(df["desc"])
    print("tfidf matrix: ", perf_counter() - start)

    start = perf_counter()
    cosine_sim = cosine_similarity(tfidf_matrix, tfidf_matrix)
    print("cosine similarity: ", perf_counter() - start)

    start = perf_counter()
    cosine_sim = np.round(cosine_sim, 4)
    print("round similarity: ", perf_counter() - start)

    start = perf_counter()
    sim_df = pd.DataFrame(cosine_sim, columns=df["pk"], index=df["pk"])
    print("create similarity dataframe: ", perf_counter() - start)

    # remove upper triangle
    start = perf_counter()
    sim_df = sim_df.where(np.triu(np.ones(sim_df.shape)).astype(np.bool_))
    print("remove upper triangle: ", perf_counter() - start)

    start = perf_counter()
    sim_df = sim_df.stack().reset_index(allow_duplicates=True)
    sim_df.columns = ["subject_pk_1", "subject_pk_2", "similarity"]
    # sim_df.to_csv("similarity.csv", index=False)
    print("stack similarity dataframe: ", perf_counter() - start)
    #
    len_sim_df = len(sim_df)
    print("total similarity before filter: ", len_sim_df)
    #
    start = perf_counter()
    test = sim_df.query("similarity > 0.1").reset_index()
    print("filter similarity: ", perf_counter() - start)
    len_test = len(test)
    print("total similarity after filter > 0.1: ", len_test)

    #

    start = perf_counter()
    obj = test.apply(save_similarity, axis=1)
    print("apply similarity class: ", perf_counter() - start)

    start = perf_counter()
    session.exec(text("TRUNCATE TABLE SIMILARITIES"))
    session.bulk_save_objects(obj)
    session.commit()
    print("bulk save objects: ", perf_counter() - start)

    return {
        "message": "success",
    }


def get_subject_lst(curriculum_pk: int, session: Session):
    return session.exec(
        select(Subjects)
        .where(Subjects.curriculum_pk == curriculum_pk)
        .join(SubjectTypes)
    ).all()


def get_similarity_by_boundary(
    request: Request1, session: Session, get_subject: bool = False
):
    subject1_lst = get_subject_lst(request.primary_curriculum_pk, session)

    subject2_lst = get_subject_lst(request.compare_curriculum_pk, session)

    sims = []
    for subject1 in subject1_lst:
        for subject2 in subject2_lst:
            similarity = session.exec(
                select(Similarities).where(
                    or_(
                        and_(
                            Similarities.subject_pk_1 == subject1.pk,
                            Similarities.subject_pk_2 == subject2.pk,
                        ),
                        and_(
                            Similarities.subject_pk_1 == subject2.pk,
                            Similarities.subject_pk_2 == subject1.pk,
                        ),
                    )
                )
            ).first()
            if similarity:
                for i in request.boundary:
                    if (i.upper_boundary >= similarity.similarity) and (
                        similarity.similarity > i.lower_boundary
                    ):
                        sim_type = i.boundary_name
                        sims.append(
                            {
                                "subject1_id": subject1.id,
                                "subject1_name": subject1.name_en,
                                "subject1_type": subject1.subject_type.name,
                                "subject2_id": subject2.id,
                                "subject2_name": subject2.name_en,
                                "subject2_type": subject2.subject_type.name,
                                "similarity": f"{similarity.similarity:.3f}",
                                "similarity_type": sim_type,
                            }
                        )
                        break

            else:
                sim_type = ""
                for i in request.boundary:
                    if i.lower_boundary == 0:
                        sim_type = i.boundary_name
                        weight = i.weight

                sims.append(
                    {
                        "subject1_id": subject1.id,
                        "subject1_name": subject1.name_en,
                        "subject1_type": subject1.subject_type.name,
                        "subject2_id": subject2.id,
                        "subject2_name": subject2.name_en,
                        "subject2_type": subject2.subject_type.name,
                        "similarity": f"<= 0.1",
                        "similarity_type": sim_type,
                    }
                )

    if get_subject:
        return subject1_lst, subject2_lst, sims
    return sims


def calculate_ratio_of_labeling(request: Request1, session: Session):

    sims = get_similarity_by_boundary(request, session)

    sim_df = pd.DataFrame(sims)
    return (
        sim_df["similarity_type"]
        .value_counts(normalize=True)
        .mul(100)
        .round(3)
        .astype(str)
        + "%"
    )


def calculate_sum_of_ratio_multiplied_by_weight(request: Request1, session: Session):
    sims = get_similarity_by_boundary(request, session)
    sim_df = pd.DataFrame(sims)
    sim_type_ratio = sim_df["similarity_type"].value_counts(normalize=True).to_dict()
    summation = 0
    for i in request.boundary:
        try:
            summation += sim_type_ratio[i.boundary_name] * i.weight
        except KeyError:
            continue
    return {
        "sum_of_ratio_multiplied_by_weight": f"{summation:.3f}",
    }


def get_similarity_by_label(request: Request2, session: Session):
    req = Request1(
        primary_curriculum_pk=request.primary_curriculum_pk,
        compare_curriculum_pk=request.compare_curriculum_pk,
        boundary=[request.boundary],
    )
    sims = get_similarity_by_boundary(req, session)
    sim_df = pd.DataFrame(sims)
    sim_df = sim_df.query(f"similarity_type == '{request.boundary.boundary_name}'")
    return sim_df.to_dict(orient="records")
