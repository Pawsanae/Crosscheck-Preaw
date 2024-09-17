<script lang="ts" setup>
const links = [
  {
    label: "หน้าหลัก",
    to: "/",
  },
  {
    label: "กู้คืนข้อมูลหลักสูตร",
    to: "/curriculums/trash",
  },
];

const { data: degrees } = await useFetch("/api/degrees");
const { data: faculties } = await useFetch("/api/faculties");

const curriculums = ref([]);
const pending = ref(false);
const error = ref(null);

const getCurriculums = async (
  limit: number,
  offset: number,
  name: string | undefined = undefined,
  degreeId: number | undefined = undefined,
  facultyId: number | undefined = undefined,
) => {
  pending.value = true;
  let apiEndpoint = `/api/curriculums/trash?limit=${limit}&offset=${offset}`;
  if (name) {
    apiEndpoint += `&search=${name}`;
  }
  if (degreeId) {
    apiEndpoint += `&degreeId=${degreeId}`;
  }
  if (facultyId) {
    apiEndpoint += `&facultyId=${facultyId}`;
  }
  await $fetch(apiEndpoint, {
    onResponse: ({ response }) => {
      if (!response.ok) {
        error.value = response._data;
        return;
      }
      curriculums.value = response._data.data;
      totalData.value = response._data.total;
    },
  });
  pending.value = false;
};

const q = ref(undefined);
const page = ref(1);
const perPage = ref(5);
const totalData = ref(0);
const degreeId = ref(undefined);
const facultyId = ref(undefined);

watchEffect(() => {
  const limit = perPage.value;
  const offset = (page.value - 1) * perPage.value;
  const name = q.value;
  const degree = degreeId.value;
  const faculty = facultyId.value;
  getCurriculums(limit, offset, name, degree, faculty);
});

const onChangeFilter = () => {
  page.value = 1;
};

onMounted(() => {
  getCurriculums(perPage.value, (page.value - 1) * perPage.value);
});

const columns = [
  {
    key: "id",
    label: "รหัสหลักสูตร",
    sortable: true,
  },

  {
    key: "name",
    label: "ชื่อหลักสูตร",
    sortable: true,
  },
  {
    key: "year",
    label: "ปีหลักสูตร",
    sortable: true,
  },
  {
    key: "degree.name",
    label: "ระดับการศึกษา",
    sortable: true,
  },
  {
    key: "faculty.name",
    label: "คณะ",
    sortable: true,
  },
  // {
  //   key: "faculty.facultyGroup.name",
  //   label: "กลุ่มคณะ",
  //   sortable: true,
  // },
  {
    key: "actions",
    label: "ตัวเลือก",
  },
];

const isDeleteModal = ref(false);
const selectedCurriculum = ref<any | null>(null);

const openModal = (curriculum: any) => {
  selectedCurriculum.value = curriculum;
  isDeleteModal.value = true;
};

const closeModal = () => {
  isDeleteModal.value = false;
  selectedCurriculum.value = null;
};

const isRestoreModal = ref(false);
const openRestoreModal = (curriculum: any) => {
  selectedCurriculum.value = curriculum;
  isRestoreModal.value = true;
};

const closeRestoreModal = () => {
  isRestoreModal.value = false;
  selectedCurriculum.value = null;
};

const restoreCurriculum = async (pk: number) => {
  await $fetch(`/api/curriculums/${pk}/restore`, {
    method: "PUT",
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
        title: "กู้คืนข้อมูลสำเร็จ",
        description: "ข้อมูลหลักสูตรถูกกู้คืนเรียบร้อยแล้ว",
        color: "green",
        icon: "i-heroicons-information-circle",
      });
      getCurriculums(
        perPage.value,
        (page.value - 1) * perPage.value,
        q.value,
        degreeId.value,
        facultyId.value,
      );
      closeRestoreModal();
    },
  });
};

const toast = useToast();
const deleteCurriculum = async (pk: number) => {
  await $fetch(`/api/curriculums/${pk}/permanent`, {
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
        description: "ข้อมูลหลักสูตรถูกลบถาวรเรียบร้อยแล้ว",
        color: "green",
        icon: "i-heroicons-information-circle",
      });
      getCurriculums(
        perPage.value,
        (page.value - 1) * perPage.value,
        q.value,
        degreeId.value,
        facultyId.value,
      );
      closeModal();
    },
  });
};
</script>

<template>
  <UContainer class="my-4">
    <UCard>
      <UBreadcrumb :links="links" />
      <h1 class="text-3xl text-center my-8">กู้คืนข้อมูลหลักสูตร</h1>
      <div class="flex md:flex-row flex-col gap-2 justify-between my-4">
        <div class="flex md:flex-row flex-col gap-2">
          <UInput
            v-model="q"
            class="min-w-64"
            placeholder="ค้นหาชื่อหลักสูตร..."
            @change="onChangeFilter"
          />
          <USelectMenu
            v-if="faculties"
            v-model="facultyId"
            :options="faculties"
            class="min-w-64"
            option-attribute="name"
            placeholder="เลือกคณะ"
            searchable
            value-attribute="id"
            @change="onChangeFilter"
          ></USelectMenu>
          <USelectMenu
            v-if="degrees"
            v-model="degreeId"
            :options="degrees"
            class=""
            option-attribute="name"
            placeholder="เลือกระดับการศึกษา"
            searchable
            value-attribute="id"
            @change="onChangeFilter"
          ></USelectMenu>
          <UButton
            color="red"
            icon="i-heroicons-trash-20-solid"
            @click="
              () => {
                page = 1;
                q = undefined;
                degreeId = undefined;
                facultyId = undefined;
              }
            "
          >
          </UButton>
          <UButton
            :loading="pending"
            color="gray"
            icon="i-heroicons-arrow-path-20-solid"
            @click="
              getCurriculums(
                perPage,
                (page - 1) * perPage,
                q,
                degreeId,
                facultyId,
              )
            "
          >
            รีเฟรช
          </UButton>
        </div>
      </div>
      <UTable
        :columns="columns"
        :loading="pending"
        :rows="curriculums"
        class="my-4"
      >
        <template #actions-data="{ row }">
          <div class="flex md:flex-row flex-col gap-4">
            <UButton
              color="amber"
              icon="i-heroicons-arrow-uturn-left-20-solid"
              square
              @click="openRestoreModal(row)"
            >
            </UButton>
            <UButton
              color="red"
              icon="i-heroicons-trash-20-solid"
              @click="openModal(row)"
            ></UButton>
          </div>
        </template>
      </UTable>
      <div
        class="flex md:flex-row flex-col justify-end items-center gap-4 my-4"
      >
        <div class="flex gap-2 items-center">
          <span>จำนวนต่อหน้า</span>
          <USelect
            v-model="perPage"
            :options="[5, 10, 15, 20, totalData]"
            @change="onChangeFilter"
          />
        </div>

        <UPagination v-model="page" :page-count="perPage" :total="totalData" />
      </div>
    </UCard>

    <UModal v-model="isRestoreModal">
      <div class="p-4">
        <h1 class="text-2xl text-center">ยืนยันการกู้คืนข้อมูล</h1>
        <p class="text-center">คุณแน่ใจหรือไม่ที่จะกู้คืนข้อมูลนี้</p>
        <div class="text-center text-xl my-8">
          {{ selectedCurriculum?.name }}<br />
          ปีหลักสูตร {{ selectedCurriculum?.year }}
        </div>
        <div class="flex justify-center gap-4 my-4">
          <UButton color="red" @click="closeRestoreModal()">ยกเลิก</UButton>
          <UButton
            color="green"
            @click="restoreCurriculum(selectedCurriculum!.pk)"
          >
            กู้คืนข้อมูล
          </UButton>
        </div>
      </div>
    </UModal>

    <UModal v-model="isDeleteModal">
      <div class="p-4">
        <h1 class="text-2xl text-center">ยืนยันการลบข้อมูล</h1>
        <p class="text-center">คุณแน่ใจหรือไม่ที่จะลบข้อมูลนี้</p>
        <div class="text-center text-xl my-8">
          {{ selectedCurriculum?.name }}<br />
          ปีหลักสูตร {{ selectedCurriculum?.year }}
        </div>
        <div class="flex justify-center gap-4 my-4">
          <UButton color="red" @click="closeModal()">ยกเลิก</UButton>
          <UButton
            color="green"
            @click="deleteCurriculum(selectedCurriculum!.pk)"
          >
            ยืนยัน
          </UButton>
        </div>
      </div>
    </UModal>
  </UContainer>
</template>
