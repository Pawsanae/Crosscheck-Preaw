<script lang="ts" setup>
import { z } from "zod";
import { subjectSchema } from "~/composables/subjectSchema";
import type { FormSubmitEvent } from "#ui/types";

const router = useRouter();
const route = useRoute();

const curriculumPk = route.params.pk as string;
const subjectPk = route.params.subjectsPk as string;
const { data: subject } = await useFetch(`/api/subjects/${subjectPk}`);
const { data: curriculum } = await useFetch(`/api/curriculums/${curriculumPk}`);
const { data: subjectTypes } = await useFetch(`/api/subject-types`);
const { data: subjectOccupationTypes } = await useFetch(
  `/api/subject-occupation-types`,
);

if (
  !curriculum.value ||
  !subject.value ||
  !subjectTypes.value ||
  !subjectOccupationTypes.value
) {
  router.push(`/curriculums/${curriculumPk}/subjects`);
}

const links = [
  {
    label: "หน้าหลัก",
    to: "/",
  },
  {
    label: "ข้อมูลหลักสูตร",
    to: "/curriculums",
  },
  {
    label: "ข้อมูลรายวิชา",
    to: `/curriculums/${curriculumPk}/subjects`,
  },
  {
    label: "แก้ไขข้อมูลรายวิชา",
  },
];
const schema = subjectSchema();
type Schema = z.output<typeof schema>;

const form = reactive({
  id: subject.value?.id,
  nameTH: subject.value?.nameTH,
  nameEN: subject.value?.nameEN,
  descTH: subject.value?.descTH,
  descEN: subject.value?.descEN,
  overAllCredit: subject.value?.overAllCredit,
  selfLearnCredit: subject.value?.selfLearnCredit,
  lectureCredit: subject.value?.lectureCredit,
  labCredit: subject.value?.labCredit,
  curriculumPk: parseInt(curriculumPk),
  subjectTypeId: subject.value?.subjectTypeId,
  subjectOccupationId: subject.value?.subjectOccupationId,
});

watchEffect(() => {
  if (`${form.overAllCredit}` == "") {
    form.overAllCredit = null;
  }
  if (`${form.selfLearnCredit}` == "") {
    form.selfLearnCredit = null;
  }
  if (`${form.lectureCredit}` == "") {
    form.lectureCredit = null;
  }
  if (`${form.labCredit}` == "") {
    form.labCredit = null;
  }
});

const toast = useToast();
const editSubject = async (event: FormSubmitEvent<Schema>) => {
  // if not change
  if (
    form.id === subject.value?.id &&
    form.nameTH === subject.value?.nameTH &&
    form.nameEN === subject.value?.nameEN &&
    form.descTH === subject.value?.descTH &&
    form.descEN === subject.value?.descEN &&
    form.overAllCredit === subject.value?.overAllCredit &&
    form.selfLearnCredit === subject.value?.selfLearnCredit &&
    form.lectureCredit === subject.value?.lectureCredit &&
    form.labCredit === subject.value?.labCredit &&
    form.subjectTypeId === subject.value?.subjectTypeId &&
    form.subjectOccupationId === subject.value?.subjectOccupationId
  ) {
    toast.add({
      title: "ยกเลิกการบันทึกข้อมูล",
      description: "ข้อมูลไม่มีการเปลี่ยนแปลง",
      color: "yellow",
      icon: "i-heroicons-information-circle",
    });
    await router.push(`/curriculums/${curriculumPk}/subjects`);
    return;
  }
  await $fetch(`/api/subjects/${subjectPk}`, {
    method: "PUT",
    body: event.data,
    onResponse: ({ response }) => {
      if (!response.ok) {
        toast.add({
          title: "เกิดข้อผิดพลาด",
          description: response._data.message,
          color: "red",
          icon: "i-heroicons-information-circle",
        });
        return;
      }
      toast.add({
        title: "บันทึกข้อมูลสำเร็จ",
        description: "ข้อมูลรายวิชาเรียบร้อยแล้ว",
        color: "green",
        icon: "i-heroicons-information-circle",
      });
      router.push(`/curriculums/${curriculumPk}/subjects`);
    },
  });
};
</script>

<template>
  <UContainer class="my-4">
    <UCard>
      <UBreadcrumb :links="links" />
      <div class="my-8">
        <h1 class="text-3xl text-center">แก้ไขข้อมูลรายวิชา</h1>
        <h3 class="text-2xl text-center">{{ curriculum?.name }}</h3>
      </div>
      <UForm
        :schema="schema"
        :state="form"
        class="space-y-4"
        @submit="editSubject"
      >
        <UFormGroup label="รหัสรายวิชา" name="id" required>
          <UInput v-model="form.id" placeholder="89036364"></UInput>
        </UFormGroup>
        <UFormGroup label="ชื่อรายวิชา (ภาษาไทย)" name="nameTH" required>
          <UInput
            v-model="form.nameTH"
            :disabled="!subject"
            placeholder="การประมวลผลภาษาธรรมชาติ"
          ></UInput>
        </UFormGroup>
        <UFormGroup label="ชื่อรายวิชา (ภาษาอังกฤษ)" name="nameEN" required>
          <UInput
            v-model="form.nameEN"
            :disabled="!subject"
            placeholder="Natural Language Processing"
          ></UInput>
        </UFormGroup>
        <UFormGroup label="คำอธิบายรายวิชา (ภาษาไทย)" name="descTH" required>
          <UTextarea
            v-model="form.descTH"
            :disabled="!subject"
            :maxrows="10"
            :rows="5"
            autoresize
            placeholder="หลักการของประมวลผลภาษาธรรมชาติ การตัดคำและการแบ่งประโยค การจำแนกประเภทข้อความ การวิเคราะห์เชิงความหมายและอารมณ์ การสกัดข้อมูล การเรียนรู้เชิงลึกสำหรับการประมวลผลภาษาธรรมชาติ"
          ></UTextarea>
        </UFormGroup>
        <UFormGroup label="คำอธิบายรายวิชา (ภาษาอังกฤษ)" name="descEN" required>
          <UTextarea
            v-model="form.descEN"
            :disabled="!subject"
            :maxrows="10"
            :rows="5"
            autoresize
            placeholder="Principles of Natural Language Processing, word and sentence tokenization, text classification, semantics and sentiment analysis, information extraction, deep learning for Natural Language Processing"
          ></UTextarea>
        </UFormGroup>
        <UFormGroup label="จำนวนหน่วยกิต" name="overAllCredit">
          <UInput
            v-model="form.overAllCredit!"
            :disabled="!subject"
            placeholder="3"
            type="number"
          ></UInput>
        </UFormGroup>
        <UFormGroup
          label="จำนวนชั่วโมงในการบรรยาย ต่อสัปดาห์"
          name="lectureCredit"
        >
          <UInput
            v-model="form.lectureCredit!"
            :disabled="!subject"
            placeholder="0"
            type="number"
          ></UInput>
        </UFormGroup>
        <UFormGroup
          label="จำนวนชั่วโมงในการปฏิบัติ ต่อสัปดาห์"
          name="labCredit"
        >
          <UInput
            v-model="form.labCredit!"
            :disabled="!subject"
            placeholder="6"
            type="number"
          ></UInput>
        </UFormGroup>
        <UFormGroup
          label="จำนวนชั่วโมงในการศึกษาด้วยตัวเอง ต่อสัปดาห์"
          name="selfLearnCredit"
        >
          <UInput
            v-model="form.selfLearnCredit!"
            :disabled="!subject"
            placeholder="3"
            type="number"
          ></UInput>
        </UFormGroup>
        <UFormGroup label="ประเภทรายวิชา" name="subjectTypeId" required>
          <USelectMenu
            v-if="subjectTypes"
            v-model="form.subjectTypeId"
            :disabled="!subject"
            :options="subjectTypes"
            option-attribute="name"
            placeholder="เลือกประเภทรายวิชา"
            value-attribute="id"
          ></USelectMenu>
        </UFormGroup>
        <UFormGroup label="ประเภทวิชาชีพ" name="subjectOccupationId" required>
          <USelectMenu
            v-if="subjectOccupationTypes"
            v-model="form.subjectOccupationId"
            :disabled="!subject"
            :options="subjectOccupationTypes"
            option-attribute="name"
            placeholder="เลือกประเภทวิชาชีพ"
            value-attribute="id"
          ></USelectMenu>
        </UFormGroup>
        <UButton block type="submit">บันทึกข้อมูล</UButton>
      </UForm>
    </UCard>
  </UContainer>
</template>
