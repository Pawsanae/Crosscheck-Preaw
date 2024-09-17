<script lang="ts" setup>
import { z } from "zod";
import type { FormSubmitEvent } from "#ui/types";

const router = useRouter();
const route = useRoute();
const toast = useToast();

const id = route.params.id;

const { data: subjectOccupationType } = await useFetch(
  `/api/subject-occupation-types/${id}`,
);
onMounted(() => {
  if (!subjectOccupationType.value) {
    toast.add({
      title: "ไม่พบข้อมูล",
      description: "ไม่พบข้อมูลประเภทวิชาชีพที่คุณต้องการ",
      color: "red",
      icon: "i-heroicons-information-circle",
      callback: () => router.push("/subject-occupation-types"),
    });
  }
});

const links = [
  {
    label: "หน้าหลัก",
    to: "/",
  },
  {
    label: "ข้อมูลประเภทวิชาชีพ",
    to: "/subject-occupation-types",
  },
  {
    label: "แก้ไขข้อมูลประเภทวิชาชีพ",
  },
];

const schema = subjectOccupationTypeSchema();

type Schema = z.output<typeof schema>;

const form = reactive({
  name: subjectOccupationType.value?.name,
});

const editSubjectOccupationType = async (event: FormSubmitEvent<Schema>) => {
  if (form.name === subjectOccupationType.value?.name) {
    toast.add({
      title: "ยกเลิกการบันทึกข้อมูล",
      description: "ข้อมูลไม่มีการเปลี่ยนแปลง",
      color: "yellow",
      icon: "i-heroicons-information-circle",
    });
    await router.push("/subject-occupation-types");
    return;
  }
  await $fetch(
    `/api/subject-occupation-types/${subjectOccupationType.value?.id}`,
    {
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
          description: "ประเภทวิชาชีพถูกบันทึกเรียบร้อยแล้ว",
          color: "green",
          icon: "i-heroicons-information-circle",
        });
        router.push("/subject-occupation-types");
      },
    },
  );
};
</script>

<template>
  <UContainer class="my-4">
    <UCard>
      <UBreadcrumb :links="links" />
      <h1 class="text-3xl text-center my-8">แก้ไขข้อมูลประเภทวิชาชีพ</h1>
      <UForm
        :schema="schema"
        :state="form"
        class="space-y-4"
        @submit="editSubjectOccupationType"
      >
        <UFormGroup label="ชื่อประเภทวิชาชีพ" name="name" required>
          <UInput
            v-model="form.name"
            :disabled="!subjectOccupationType"
            placeholder="เป็นวิชาชีพ"
          />
        </UFormGroup>

        <UButton :disabled="!subjectOccupationType" block type="submit">
          บันทึกข้อมูล
        </UButton>
      </UForm>
    </UCard>
  </UContainer>
</template>
