<script lang="ts" setup>
import { z } from "zod";
import type { FormSubmitEvent } from "#ui/types";

const router = useRouter();
const route = useRoute();
const toast = useToast();

const id = route.params.id;

const { data: degree } = await useFetch(`/api/degrees/${id}`);
onMounted(() => {
  if (!degree.value) {
    toast.add({
      title: "ไม่พบข้อมูล",
      description: "ไม่พบข้อมูลระดับการศึกษาที่คุณต้องการ",
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
    label: "ข้อมูลระดับการศึกษา",
    to: "/degrees",
  },
  {
    label: "แก้ไขข้อมูลระดับการศึกษา",
  },
];

const schema = degreeSchema();

type Schema = z.output<typeof schema>;

const form = reactive({
  name: degree.value?.name,
});

const editDegree = async (event: FormSubmitEvent<Schema>) => {
  if (form.name === degree.value?.name) {
    toast.add({
      title: "ยกเลิกการบันทึกข้อมูล",
      description: "ข้อมูลไม่มีการเปลี่ยนแปลง",
      color: "yellow",
      icon: "i-heroicons-information-circle",
    });
    await router.push("/degrees");
    return;
  }
  await $fetch(`/api/degrees/${degree.value?.id}`, {
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
      <h1 class="text-3xl text-center my-8">แก้ไขข้อมูลระดับการศึกษา</h1>
      <UForm
        :schema="schema"
        :state="form"
        class="space-y-4"
        @submit="editDegree"
      >
        <UFormGroup label="ระดับการศึกษา" name="name" required>
          <UInput
            v-model="form.name"
            :disabled="!degree"
            placeholder="ปริญญาตรี"
          />
        </UFormGroup>

        <UButton :disabled="!degree" block type="submit">
          บันทึกข้อมูล
        </UButton>
      </UForm>
    </UCard>
  </UContainer>
</template>
