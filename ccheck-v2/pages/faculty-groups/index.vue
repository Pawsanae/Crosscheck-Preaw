<script lang="ts" setup>
const links = [
  {
    label: "หน้าหลัก",
    to: "/",
  },
  {
    label: "ข้อมูลกลุ่มคณะ",
    to: "/faculty-groups",
  },
];

const {
  data: facultyGroups,
  pending,
  error,
  refresh,
} = await useFetch("/api/faculty-groups");

const q = ref("");
const page = ref(1);
const perPage = ref(5);
const searchFacultyGroups = computed(() => {
  if (!facultyGroups.value) {
    return [];
  }

  if (!q.value) {
    return facultyGroups.value;
  }
  page.value = 1;

  return facultyGroups.value.filter((facultyGroup) => {
    return facultyGroup.name.toLowerCase().includes(q.value.toLowerCase());
  });
});

const rows = computed(() => {
  return searchFacultyGroups.value.slice(
    (page.value - 1) * perPage.value,
    page.value * perPage.value,
  );
});

const columns = [
  {
    key: "id",
    label: "ลำดับที่",
    sortable: true,
  },
  {
    key: "name",
    label: "ชื่อกลุ่มคณะ",
    sortable: true,
  },
  {
    key: "actions",
    label: "ตัวเลือก",
  },
];

type FacultyGroup = {
  id: number;
  name: string;
};

const isDeleteModal = ref(false);
const selectedFacultyGroup = ref<FacultyGroup | null>(null);
const openModal = (facultyGroup: FacultyGroup) => {
  selectedFacultyGroup.value = facultyGroup;
  isDeleteModal.value = true;
};

const closeModal = () => {
  isDeleteModal.value = false;
  selectedFacultyGroup.value = null;
};

const toast = useToast();
const deleteFacultyGroup = async (id: number) => {
  await $fetch(`/api/faculty-groups/${id}`, {
    method: "DELETE",
    onResponse: ({ response }) => {
      if (!response.ok) {
        toast.add({
          title: "เกิดข้อผิดพลาด",
          description: response._data.message,
          color: "red",
          icon: "i-heroicons-information-circle",
        });
        closeModal();
        return;
      }
      toast.add({
        title: "ลบข้อมูลสำเร็จ",
        description: "ข้อมูลกลุ่มคณะถูกลบเรียบร้อยแล้ว",
        color: "green",
        icon: "i-heroicons-information-circle",
      });
      refresh();
      closeModal();
    },
  });
};
</script>

<template>
  <UContainer class="my-4">
    <UCard>
      <UBreadcrumb :links="links" />
      <h1 class="text-3xl text-center my-8">ข้อมูลกลุ่มคณะ</h1>
      <div class="flex md:flex-row flex-col gap-2 justify-between my-4">
        <div class="flex md:flex-row flex-col gap-2">
          <UInput v-model="q" placeholder="ค้นหาชื่อกลุ่มคณะ..." />
          <UButton
            :loading="pending"
            color="gray"
            icon="i-heroicons-arrow-path-20-solid"
            @click="refresh"
          >
            รีเฟรช
          </UButton>
        </div>
        <UButton icon="i-heroicons-plus-20-solid" to="/faculty-groups/create">
          เพิ่มกลุ่มคณะ
        </UButton>
      </div>
      <UTable :columns="columns" :loading="pending" :rows="rows" class="my-4">
        <template #actions-data="{ row }">
          <div class="flex md:flex-row flex-col gap-4">
            <UButton
              :to="`/faculty-groups/${row.id}/edit`"
              color="amber"
              icon="i-heroicons-pencil-square-solid"
            />
            <UButton
              color="red"
              icon="i-heroicons-trash-20-solid"
              @click="openModal(row)"
            />
          </div>
        </template>
      </UTable>
      <div
        class="flex md:flex-row flex-col justify-end items-center gap-4 my-4"
      >
        <div class="flex gap-2 items-center">
          <span>จำนวนต่อหน้า</span>
          <USelect v-model="perPage" :options="[5, 10, 15, 20]" />
        </div>

        <UPagination
          v-model="page"
          :page-count="perPage"
          :total="searchFacultyGroups.length"
        />
      </div>
    </UCard>
    <UModal v-model="isDeleteModal">
      <div class="p-4">
        <h1 class="text-2xl text-center">ยืนยันการลบข้อมูล</h1>
        <p class="text-center">คุณแน่ใจหรือไม่ที่จะลบข้อมูลนี้</p>
        <div class="text-center text-xl my-8">
          {{ selectedFacultyGroup?.name }}
        </div>
        <div class="flex justify-center gap-4 my-4">
          <UButton color="red" @click="closeModal()">ยกเลิก</UButton>
          <UButton
            color="green"
            @click="deleteFacultyGroup(selectedFacultyGroup!.id)"
          >
            ยืนยัน
          </UButton>
        </div>
      </div>
    </UModal>
  </UContainer>
</template>
