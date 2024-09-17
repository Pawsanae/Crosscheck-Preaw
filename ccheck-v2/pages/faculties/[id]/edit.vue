<script lang="ts" setup>
import { z } from "zod";
import type { FormSubmitEvent } from "#ui/types";

const router = useRouter();
const route = useRoute();
const toast = useToast();

const id = route.params.id;

const { data: faculty } = await useFetch(`/api/faculties/${id}`);
onMounted(() => {
  if (!faculty.value) {
    toast.add({
      title: "ไม่พบข้อมูล",
      description: "ไม่พบข้อมูลคณะที่คุณต้องการ",
      color: "red",
      icon: "i-heroicons-information-circle",
      callback: () => router.push("/faculties"),
    });
  }
});

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
  name: faculty.value?.name,
  facultyGroupId: faculty.value?.facultyGroupId,
});

const editFaculty = async (event: FormSubmitEvent<Schema>) => {
  console.log(event.data);
  if (form.name === faculty.value?.name) {
    if (form.facultyGroupId === faculty.value?.facultyGroupId) {
      toast.add({
        title: "ยกเลิกการบันทึกข้อมูล",
        description: "ข้อมูลไม่มีการเปลี่ยนแปลง",
        color: "yellow",
        icon: "i-heroicons-information-circle",
      });
      await router.push("/faculties");
      return;
    }
  }
  await $fetch(`/api/faculties/${faculty.value?.id}`, {
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
      <h1 class="text-3xl text-center my-8">เพิ่มข้อมูลคณะ</h1>
      <UForm
        :schema="schema"
        :state="form"
        class="space-y-4"
        @submit="editFaculty"
      >
        <UFormGroup label="ชื่อคณะ" name="name" required>
          <UInput
            v-model="form.name"
            :disabled="!faculty"
            placeholder="วิทยาการสารเทศ"
          />
        </UFormGroup>
        <UFormGroup label="กลุ่มคณะ" name="facultyGroupId" required>
          <USelectMenu
            v-if="facultyGroups"
            v-model="form.facultyGroupId"
            :disabled="!faculty"
            :options="facultyGroups"
            option-attribute="name"
            placeholder="เลือกกลุ่มคณะ"
            value-attribute="id"
          ></USelectMenu>
        </UFormGroup>
        <UButton :disabled="!faculty" block type="submit">
          บันทึกข้อมูล
        </UButton>
      </UForm>
    </UCard>
  </UContainer>
</template>
