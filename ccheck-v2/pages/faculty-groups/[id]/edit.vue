<script lang="ts" setup>
import { z } from "zod";
import type { FormSubmitEvent } from "#ui/types";

const router = useRouter();
const route = useRoute();
const toast = useToast();

const id = route.params.id;

const { data: facultyGroup } = await useFetch(`/api/faculty-groups/${id}`);
onMounted(() => {
  if (!facultyGroup.value) {
    toast.add({
      title: "ไม่พบข้อมูล",
      description: "ไม่พบข้อมูลกลุ่มคณะที่คุณต้องการ",
      color: "red",
      icon: "i-heroicons-information-circle",
      callback: () => router.push("/degrees"),
    });
  }
});

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
    label: "แก้ไขข้อมูลกลุ่มคณะ",
  },
];

const schema = facultyGroupSchema();

type Schema = z.output<typeof schema>;

const form = reactive({
  name: facultyGroup.value?.name,
});

const editFacultyGroup = async (event: FormSubmitEvent<Schema>) => {
  if (form.name === facultyGroup.value?.name) {
    toast.add({
      title: "ยกเลิกการบันทึกข้อมูล",
      description: "ข้อมูลไม่มีการเปลี่ยนแปลง",
      color: "yellow",
      icon: "i-heroicons-information-circle",
    });
    await router.push("/faculty-groups");
    return;
  }
  await $fetch(`/api/faculty-groups/${facultyGroup.value?.id}`, {
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
      <h1 class="text-3xl text-center my-8">แก้ไขข้อมูลกลุ่มคณะ</h1>
      <UForm
        :schema="schema"
        :state="form"
        class="space-y-4"
        @submit="editFacultyGroup"
      >
        <UFormGroup label="ชื่อกลุ่มคณะ" name="name" required>
          <UInput
            v-model="form.name"
            :disabled="!facultyGroup"
            placeholder="วิทยาศาสตร์และเทคโนโลยี"
          />
        </UFormGroup>

        <UButton :disabled="!facultyGroup" block type="submit">
          บันทึกข้อมูล
        </UButton>
      </UForm>
    </UCard>
  </UContainer>
</template>
