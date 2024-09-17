<script lang="ts" setup>
import { z } from "zod";
import type { FormSubmitEvent } from "#ui/types";

const router = useRouter();

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
    label: "เพิ่มข้อมูลหลักสูตร",
    to: "/curriculums/create",
  },
];

const { data: faculties } = await useFetch("/api/faculties");
const { data: degrees } = await useFetch("/api/degrees");
if (!faculties.value || !degrees.value) {
  router.push("/curriculums");
}

const schema = curriculumSchema();
type Schema = z.output<typeof schema>;

const form = reactive({
  id: undefined,
  name: undefined,
  year: undefined,
  philosophy: undefined,
  description: undefined,
  objective: undefined,
  ability: undefined,
  partner: undefined,
  globalPartner: undefined,
  industry: undefined,
  cwie: undefined,
  eecModel: undefined,
  graduateInYear: undefined,
  facultyId: undefined,
  degreeId: undefined,
  version: undefined,
});

const toast = useToast();
const createCurriculum = async (event: FormSubmitEvent<Schema>) => {
  await $fetch(`/api/curriculums/`, {
    method: "POST",
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
        description: "ข้อมูลหลักสูตรถูกบันทึกเรียบร้อยแล้ว",
        color: "green",
        icon: "i-heroicons-information-circle",
      });
      router.push("/curriculums");
    },
  });
};
</script>
<template>
  <UContainer class="my-4">
    <UCard>
      <UBreadcrumb :links="links" />
      <h1 class="text-3xl text-center my-8">เพิ่มข้อมูลหลักสูตร</h1>
      <UForm
        :schema="schema"
        :state="form"
        class="space-y-4"
        @submit="createCurriculum"
      >
        <UFormGroup label="รหัสหลักสูตร" name="id" required>
          <UInput v-model="form.id" placeholder="25630194000857"></UInput>
        </UFormGroup>
        <UFormGroup label="ชื่อหลักสูตร" name="name" required>
          <UInput
            v-model="form.name"
            placeholder="หลักสูตรวิทยาศาสตรบัณฑิต สาขาวิชาปัญญาประดิษฐ์ประยุกต์และเทคโนโลยีอัจฉริยะ (หลักสูตรสองภาษา)"
          ></UInput>
        </UFormGroup>
        <UFormGroup label="ปีหลักสูตร" name="year" required>
          <UInput v-model="form.year" placeholder="2564"></UInput>
        </UFormGroup>
        <UFormGroup label="ระยะเวลาของหลักสูตร" name="graduateInYear" required>
          <UInput
            v-model="form.graduateInYear"
            placeholder="4"
            type="number"
          ></UInput>
        </UFormGroup>
        <UFormGroup label="ระดับการศึกษา" name="degreeId" required>
          <USelectMenu
            v-if="degrees"
            v-model="form.degreeId"
            :options="degrees"
            option-attribute="name"
            placeholder="เลือกระดับการศึกษา"
            value-attribute="id"
          ></USelectMenu>
        </UFormGroup>
        <UFormGroup label="คณะ" name="facultyId" required>
          <USelectMenu
            v-if="faculties"
            v-model="form.facultyId"
            :options="faculties"
            option-attribute="name"
            placeholder="เลือกคณะ"
            value-attribute="id"
          ></USelectMenu>
        </UFormGroup>
        <UFormGroup label="เวอร์ชั่น" name="version" required>
          <UInput v-model="form.version" placeholder="1" type="number"></UInput>
        </UFormGroup>
        <UFormGroup label="ปรัชญา" name="philosophy">
          <UTextarea
            v-model="form.philosophy"
            :maxrows="10"
            :rows="5"
            autoresize
            placeholder="ปรัชญาของหลักสูตร"
          ></UTextarea>
        </UFormGroup>
        <UFormGroup label="คำอธิบาย" name="description">
          <UTextarea
            v-model="form.description"
            :maxrows="10"
            :rows="5"
            autoresize
            placeholder="คำอธิบายของหลักสูตร"
          ></UTextarea>
        </UFormGroup>
        <UFormGroup label="วัตถุประสงค์" name="objective">
          <UTextarea
            v-model="form.objective"
            :maxrows="10"
            :rows="5"
            autoresize
            placeholder="วัตถุประสงค์ของหลักสูตร"
          ></UTextarea>
        </UFormGroup>
        <UFormGroup label="ทักษะและสมรรถนะของบัณฑิต" name="ability">
          <UTextarea
            v-model="form.ability"
            :maxrows="10"
            :rows="5"
            autoresize
            placeholder="ทักษะและสมรรถนะของบัณฑิตของหลักสูตร"
          ></UTextarea>
        </UFormGroup>
        <UFormGroup
          label="เครือข่ายความร่วมมือในการสนับสนุนหลักสูตร"
          name="partner"
        >
          <UTextarea
            v-model="form.partner"
            :maxrows="10"
            :rows="5"
            autoresize
            placeholder="เครือข่ายความร่วมมือในการสนับสนุนหลักสูตรของหลักสูตร"
          ></UTextarea>
        </UFormGroup>
        <UFormGroup
          label="รายละเอียดความร่วมมือในระดับนานาชาติ"
          name="globalPartner"
        >
          <UTextarea
            v-model="form.globalPartner"
            :maxrows="10"
            :rows="5"
            autoresize
            placeholder="รายละเอียดความร่วมมือในระดับนานาชาติของหลักสูตร"
          ></UTextarea>
        </UFormGroup>
        <UFormGroup
          label="หลักสูตรสอดคล้องต่ออุตสาหกรรมเป้าหมายโดยจำแนกตามกลุ่มอุตสาหกรรม"
          name="industry"
        >
          <UTextarea
            v-model="form.industry"
            :maxrows="10"
            :rows="5"
            autoresize
            placeholder="ความสอดคล้องระหว่างหลักสูตรกับอุตสาหกรรมเป้าหมาย โดยจำแนกตามกลุ่มอุตสาหกรรม"
          ></UTextarea>
        </UFormGroup>
        <UFormGroup
          label="หลักสูตรจัดการเรียนการสอนตามแนวทาง CWIE Model"
          name="cwie"
        >
          <UTextarea
            v-model="form.cwie"
            :maxrows="10"
            :rows="5"
            autoresize
            placeholder="รูปแบบ CWIE Model ของหลักสูตร"
          ></UTextarea>
        </UFormGroup>
        <UFormGroup
          label="หลักสูตรจัดการเรียนการสอนตามแนวทาง EEC Model"
          name="eecModel"
        >
          <UTextarea
            v-model="form.eecModel"
            :maxrows="10"
            :rows="5"
            autoresize
            placeholder="รูปแบบ EEC Model ของหลักสูตร"
          ></UTextarea>
        </UFormGroup>
        <UButton block type="submit"> บันทึกข้อมูล</UButton>
      </UForm>
    </UCard>
  </UContainer>
</template>
