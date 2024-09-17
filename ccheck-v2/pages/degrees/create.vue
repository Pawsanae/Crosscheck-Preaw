<script lang="ts" setup>
import { z } from "zod";
import type { FormSubmitEvent } from "#ui/types";
import { degreeSchema } from "~/composables/degreeSchema";

const links = [
  {
    label: "หน้าหลัก",
    to: "/",
  },
  {
    label: "ข้อมูลระดับการศึกษา",
    to: "/degrees",
  },
  {
    label: "เพิ่มข้อมูลระดับการศึกษา",
  },
];

const schema = degreeSchema();

type Schema = z.output<typeof schema>;

const form = reactive({
  name: undefined,
});

const toast = useToast();
const router = useRouter();
const createDegree = async (event: FormSubmitEvent<Schema>) => {
  await $fetch(`/api/degrees/`, {
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
        description: "ระดับการศึกษาถูกบันทึกเรียบร้อยแล้ว",
        color: "green",
        icon: "i-heroicons-information-circle",
      });
      router.push("/degrees");
    },
  });
};
</script>

<template>
  <UContainer class="my-4">
    <UCard>
      <UBreadcrumb :links="links" />
      <h1 class="text-3xl text-center my-8">เพิ่มข้อมูลระดับการศึกษา</h1>
      <UForm
        :schema="schema"
        :state="form"
        class="space-y-4"
        @submit="createDegree"
      >
        <UFormGroup label="ระดับการศึกษา" name="name" required>
          <UInput v-model="form.name" placeholder="ปริญญาตรี" />
        </UFormGroup>
        <UButton block type="submit"> บันทึกข้อมูล</UButton>
      </UForm>
    </UCard>
  </UContainer>
</template>
