<script lang="ts" setup>
import { z } from "zod";
import type { FormSubmitEvent } from "#ui/types";
import { subjectTypeSchema } from "~/composables/subjectTypeSchema";

const links = [
  {
    label: "หน้าหลัก",
    to: "/",
  },
  {
    label: "ข้อมูลประเภทรายวิชา",
    to: "/subject-types",
  },
  {
    label: "เพิ่มข้อมูลประเภทรายวิชา",
  },
];

const schema = subjectTypeSchema();

type Schema = z.output<typeof schema>;

const form = reactive({
  name: undefined,
});

const toast = useToast();
const router = useRouter();
const createSubjectType = async (event: FormSubmitEvent<Schema>) => {
  await $fetch(`/api/subject-types/`, {
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
        description: "ประเภทรายวิชาถูกบันทึกเรียบร้อยแล้ว",
        color: "green",
        icon: "i-heroicons-information-circle",
      });
      router.push("/subject-types");
    },
  });
};
</script>

<template>
  <UContainer class="my-4">
    <UCard>
      <UBreadcrumb :links="links" />
      <h1 class="text-3xl text-center my-8">เพิ่มข้อมูลประเภทรายวิชา</h1>
      <UForm
        :schema="schema"
        :state="form"
        class="space-y-4"
        @submit="createSubjectType"
      >
        <UFormGroup label="ชื่อประเภทรายวิชา" name="name" required>
          <UInput v-model="form.name" placeholder="เอกบังคับ" />
        </UFormGroup>
        <UButton block type="submit"> บันทึกข้อมูล</UButton>
      </UForm>
    </UCard>
  </UContainer>
</template>
