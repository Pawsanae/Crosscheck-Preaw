<script lang="ts" setup>
import { z } from "zod";
import type { FormSubmitEvent } from "#ui/types";

const links = [
  {
    label: "หน้าหลัก",
    to: "/",
  },
  {
    label: "ข้อมูลคณะ",
    to: "/faculties",
  },
  {
    label: "เพิ่มข้อมูลคณะ",
    to: "/faculties/create",
  },
];

const schema = facultySchema();

type Schema = z.output<typeof schema>;

const form = reactive({
  name: undefined,
  facultyGroupId: undefined,
});

const toast = useToast();
const router = useRouter();
const createFaculty = async (event: FormSubmitEvent<Schema>) => {
  await $fetch(`/api/faculties/`, {
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
        description: "ข้อมูลคณะถูกบันทึกเรียบร้อยแล้ว",
        color: "green",
        icon: "i-heroicons-information-circle",
      });
      router.push("/faculties");
    },
  });
};

const { data: facultyGroups } = useFetch("/api/faculty-groups");
if (!facultyGroups) {
  router.push("/faculties");
}
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
        @submit="createFaculty"
      >
        <UFormGroup label="ชื่อคณะ" name="name" required>
          <UInput v-model="form.name" placeholder="วิทยาการสารเทศ" />
        </UFormGroup>
        <UFormGroup label="กลุ่มคณะ" name="facultyGroupId" required>
          <USelectMenu
            v-if="facultyGroups"
            v-model="form.facultyGroupId"
            :options="facultyGroups"
            option-attribute="name"
            placeholder="เลือกกลุ่มคณะ"
            value-attribute="id"
          ></USelectMenu>
        </UFormGroup>
        <UButton block type="submit"> บันทึกข้อมูล</UButton>
      </UForm>
    </UCard>
  </UContainer>
</template>
