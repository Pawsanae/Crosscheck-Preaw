<script lang="ts" setup>
import { z } from "zod";
import type { FormSubmitEvent } from "#ui/types";

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
    label: "เพิ่มข้อมูลประเภทวิชาชีพ",
  },
];

const schema = subjectOccupationTypeSchema();

type Schema = z.output<typeof schema>;

const form = reactive({
  name: undefined,
});

const toast = useToast();
const router = useRouter();
const createSubjectOccupationType = async (event: FormSubmitEvent<Schema>) => {
  await $fetch(`/api/subject-occupation-types/`, {
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
        description: "ประเภทวิชาชีพถูกบันทึกเรียบร้อยแล้ว",
        color: "green",
        icon: "i-heroicons-information-circle",
      });
      router.push("/subject-occupation-types");
    },
  });
};
</script>

<template>
  <UContainer class="my-4">
    <UCard>
      <UBreadcrumb :links="links" />
      <h1 class="text-3xl text-center my-8">เพิ่มข้อมูลประเภทวิชาชีพ</h1>
      <UForm
        :schema="schema"
        :state="form"
        class="space-y-4"
        @submit="createSubjectOccupationType"
      >
        <UFormGroup label="ชื่อประเภทวิชาชีพ" name="name" required>
          <UInput v-model="form.name" placeholder="เป็นวิชาชีพ" />
        </UFormGroup>
        <UButton block type="submit"> บันทึกข้อมูล</UButton>
      </UForm>
    </UCard>
  </UContainer>
</template>
