<script setup lang="ts">
    import nodegraph from "~/components/nodegraph.vue";
    const data = {
        curriculumsInfo: {
            primary: {
                curriculum_pk: 1,
                curriculum_code: 25490191106441,
                curriculum_name: "หลักสูตรบัญชีบัณฑิต",
                curriculum_year: 2564,
            },
            compare: {
                curriculum_pk: 2,
                curriculum_code: 25490191106406,
                curriculum_name: "หลักสูตรบริหารธุรกิจบัณฑิต",
                curriculum_year: 2564,
            },
            primary_curriculums_subject_type: ["กลาง", "เลือก", "เลือกเสรี"],
            compare_curriculums_subject_type: ["กลาง", "เลือก", "เลือกเสรี"],
        },
        bodyData: {
            boundary: [
                {
                    boundary_name: "red",
                    lower_boundary: 0.795,
                    upper_boundary: 1,
                    weight: 0.4,
                },
                {
                    boundary_name: "orange",
                    lower_boundary: 0.595,
                    upper_boundary: 0.795,
                    weight: 0.3,
                },
                {
                    boundary_name: "yellow",
                    lower_boundary: 0.395,
                    upper_boundary: 0.595,
                    weight: 0.2,
                },
                {
                    boundary_name: "light green",
                    lower_boundary: 0.195,
                    upper_boundary: 0.395,
                    weight: 0.1,
                },
                {
                    boundary_name: "green",
                    lower_boundary: 0,
                    upper_boundary: 0.1,
                    weight: 0,
                },
            ],
            compare_curriculum_pk: 2,
            primary_curriculum_pk: 1,
        },
        simirarityData: {
            cruriculumsSim: 0.4,
            groupSim: [
                {
                    green: 95.407 / 100,
                    lightgreen: 3.39 / 100,
                    yellow: 0.926 / 100,
                    orange: 0.148 / 100,
                    red: 0.13 / 100,
                },
            ],
        },
    };
</script>
<template>
    <nodegraph
        :curriculumsInfo="data.curriculumsInfo"
        :bodyData="data.bodyData"
        :simirarityData="data.simirarityData"
    />
</template>
