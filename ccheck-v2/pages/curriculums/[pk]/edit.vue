<script lang="ts" setup>
import { z } from "zod";
import type { FormSubmitEvent } from "#ui/types";

const toast = useToast();
const route = useRoute();
const router = useRouter();

const pk = route.params.pk;
const { data: curriculum } = await useFetch(`/api/curriculums/${pk}`);
onMounted(() => {
  if (!curriculum.value) {
    toast.add({
      title: "ไม่พบข้อมูล",
      description: "ไม่พบข้อมูลหลักสูตรที่คุณต้องการ",
      color: "red",
      icon: "i-heroicons-information-circle",
      callback: () => router.push("/curriculums"),
    });
  }
});

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
    label: "แก้ไขข้อมูลหลักสูตร",
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
  id: curriculum.value?.id,
  name: curriculum.value?.name,
  year: curriculum.value?.year,
  philosophy: curriculum.value?.philosophy,
  description: curriculum.value?.description,
  objective: curriculum.value?.objective,
  ability: curriculum.value?.ability,
  partner: curriculum.value?.partner,
  globalPartner: curriculum.value?.globalPartner,
  industry: curriculum.value?.industry,
  cwie: curriculum.value?.cwie,
  eecModel: curriculum.value?.eecModel,
  graduateInYear: curriculum.value?.graduateInYear,
  facultyId: curriculum.value?.facultyId,
  degreeId: curriculum.value?.degreeId,
  version: curriculum.value?.version,
});

const editCurriculum = async (event: FormSubmitEvent<Schema>) => {
  if (
    form.id === curriculum.value?.id &&
    form.name === curriculum.value?.name &&
    form.year === curriculum.value?.year &&
    form.philosophy === curriculum.value?.philosophy &&
    form.description === curriculum.value?.description &&
    form.objective === curriculum.value?.objective &&
    form.ability === curriculum.value?.ability &&
    form.partner === curriculum.value?.partner &&
    form.globalPartner === curriculum.value?.globalPartner &&
    form.industry === curriculum.value?.industry &&
    form.cwie === curriculum.value?.cwie &&
    form.eecModel === curriculum.value?.eecModel &&
    form.graduateInYear === curriculum.value?.graduateInYear &&
    form.facultyId === curriculum.value?.facultyId &&
    form.degreeId === curriculum.value?.degreeId &&
    form.version === curriculum.value?.version
  ) {
    toast.add({
      title: "ยกเลิกการบันทึกข้อมูล",
      description: "ข้อมูลไม่มีการเปลี่ยนแปลง",
      color: "yellow",
      icon: "i-heroicons-information-circle",
    });
    await router.push("/curriculums");
    return;
  }
  await $fetch(`/api/curriculums/${curriculum.value?.pk}`, {
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
      <h1 class="text-3xl text-center my-8">แก้ไขข้อมูลหลักสูตร</h1>
      <UForm
        :schema="schema"
        :state="form"
        class="space-y-4"
        @submit="editCurriculum"
      >
        <UFormGroup label="รหัสหลักสูตร" name="id" required>
          <UInput
            v-model="form.id"
            :disabled="!curriculum"
            placeholder="25630194000857"
          ></UInput>
        </UFormGroup>
        <UFormGroup label="ชื่อหลักสูตร" name="name" required>
          <UInput
            v-model="form.name"
            :disabled="!curriculum"
            placeholder="หลักสูตรวิทยาศาสตรบัณฑิต สาขาวิชาปัญญาประดิษฐ์ประยุกต์และเทคโนโลยีอัจฉริยะ (หลักสูตรสองภาษา)"
          ></UInput>
        </UFormGroup>
        <UFormGroup label="ปีหลักสูตร" name="year" required>
          <UInput
            v-model="form.year"
            :disabled="!curriculum"
            placeholder="2564"
          ></UInput>
        </UFormGroup>
        <UFormGroup label="ระยะเวลาของหลักสูตร" name="graduateInYear" required>
          <UInput
            v-model="form.graduateInYear"
            :disabled="!curriculum"
            placeholder="4"
            type="number"
          ></UInput>
        </UFormGroup>
        <UFormGroup label="ระดับการศึกษา" name="degreeId" required>
          <USelectMenu
            v-if="degrees"
            v-model="form.degreeId"
            :disabled="!curriculum"
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
            :disabled="!curriculum"
            :options="faculties"
            option-attribute="name"
            placeholder="เลือกคณะ"
            value-attribute="id"
          ></USelectMenu>
        </UFormGroup>
        <UFormGroup label="เวอร์ชั่น" name="version" required>
          <UInput
            v-model="form.version"
            :disabled="!curriculum"
            placeholder="1"
            type="number"
          ></UInput>
        </UFormGroup>
        <UFormGroup label="ปรัชญา" name="philosophy">
          <UTextarea
            v-model="form.philosophy!"
            :disabled="!curriculum"
            :maxrows="10"
            :rows="5"
            autoresize
            placeholder="ปรัชญาของหลักสูตร"
          ></UTextarea>
        </UFormGroup>
        <UFormGroup label="คำอธิบาย" name="description">
          <UTextarea
            v-model="form.description!"
            :maxrows="10"
            :rows="5"
            autoresize
            placeholder="คำอธิบายของหลักสูตร"
          ></UTextarea>
        </UFormGroup>
        <UFormGroup label="วัตถุประสงค์" name="objective">
          <UTextarea
            v-model="form.objective!"
            :disabled="!curriculum"
            :maxrows="10"
            :rows="5"
            autoresize
            placeholder="วัตถุประสงค์ของหลักสูตร"
          ></UTextarea>
        </UFormGroup>
        <UFormGroup label="ทักษะและสมรรถนะของบัณฑิต" name="ability">
          <UTextarea
            v-model="form.ability"
            :disabled="!curriculum"
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
            v-model="form.partner!"
            :disabled="!curriculum"
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
            v-model="form.globalPartner!"
            :disabled="!curriculum"
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
            v-model="form.industry!"
            :disabled="!curriculum"
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
            v-model="form.cwie!"
            :disabled="!curriculum"
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
            v-model="form.eecModel!"
            :disabled="!curriculum"
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
