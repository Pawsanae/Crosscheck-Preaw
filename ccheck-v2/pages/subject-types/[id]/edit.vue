<script lang="ts" setup>
import { z } from "zod";
import type { FormSubmitEvent } from "#ui/types";
import { subjectTypeSchema } from "~/composables/subjectTypeSchema";

const router = useRouter();
const route = useRoute();
const toast = useToast();

const id = route.params.id;

const { data: subjectType } = await useFetch(`/api/subject-types/${id}`);
onMounted(() => {
  if (!subjectType.value) {
    toast.add({
      title: "ไม่พบข้อมูล",
      description: "ไม่พบข้อมูลประเภทรายวิชาที่คุณต้องการ",
      color: "red",
      icon: "i-heroicons-information-circle",
      callback: () => router.push("/subject-types"),
    });
  }
});

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
    label: "แก้ไขข้อมูลประเภทรายวิชา",
  },
];

const schema = subjectTypeSchema();

type Schema = z.output<typeof schema>;

const form = reactive({
  name: subjectType.value?.name,
});

const editSubjectType = async (event: FormSubmitEvent<Schema>) => {
  if (form.name === subjectType.value?.name) {
    toast.add({
      title: "ยกเลิกการบันทึกข้อมูล",
      description: "ข้อมูลไม่มีการเปลี่ยนแปลง",
      color: "yellow",
      icon: "i-heroicons-information-circle",
    });
    await router.push("/subject-types");
    return;
  }
  await $fetch(`/api/subject-types/${subjectType.value?.id}`, {
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
      <h1 class="text-3xl text-center my-8">แก้ไขข้อมูลประเภทรายวิชา</h1>
      <UForm
        :schema="schema"
        :state="form"
        class="space-y-4"
        @submit="editSubjectType"
      >
        <UFormGroup label="ชื่อประเภทรายวิชา" name="name" required>
          <UInput
            v-model="form.name"
            :disabled="!subjectType"
            placeholder="เอกบังคับ"
          />
        </UFormGroup>

        <UButton :disabled="!subjectType" block type="submit">
          บันทึกข้อมูล
        </UButton>
      </UForm>
    </UCard>
  </UContainer>
</template>
