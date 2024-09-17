<script lang="ts" setup>
import { z } from "zod";
import type { FormSubmitEvent } from "#ui/types";

const links = [
  {
    label: "หน้าหลัก",
    to: "/",
  },
  {
    label: "ข้อมูลกลุ่มคณะ",
    to: "/faculty-groups",
  },
  {
    label: "เพิ่มข้อมูลกลุ่มคณะ",
  },
];

const schema = facultyGroupSchema();

type Schema = z.output<typeof schema>;

const form = reactive({
  name: undefined,
});

const toast = useToast();
const router = useRouter();
const createFacultyGroup = async (event: FormSubmitEvent<Schema>) => {
  await $fetch(`/api/faculty-groups/`, {
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
        description: "กลุ่มคณะถูกบันทึกเรียบร้อยแล้ว",
        color: "green",
        icon: "i-heroicons-information-circle",
      });
      router.push("/faculty-groups");
    },
  });
};
</script>

<template>
  <UContainer class="my-4">
    <UCard>
      <UBreadcrumb :links="links" />
      <h1 class="text-3xl text-center my-8">เพิ่มข้อมูลกลุ่มคณะ</h1>
      <UForm
        :schema="schema"
        :state="form"
        class="space-y-4"
        @submit="createFacultyGroup"
      >
        <UFormGroup label="ชื่อกลุ่มคณะ" name="name" required>
          <UInput v-model="form.name" placeholder="วิทยาศาสตร์และเทคโนโลยี" />
        </UFormGroup>
        <UButton block type="submit"> บันทึกข้อมูล</UButton>
      </UForm>
    </UCard>
  </UContainer>
</template>
