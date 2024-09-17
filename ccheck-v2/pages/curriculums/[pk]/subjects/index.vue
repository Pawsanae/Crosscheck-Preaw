<script lang="ts" setup>
const route = useRoute();
const router = useRouter();
const toast = useToast();

const curriculumPk = route.params.pk;
const { data: curriculum } = await useFetch(`/api/curriculums/${curriculumPk}`);
const { data: subjectTypes } = await useFetch("/api/subject-types");

if (!curriculum.value || !subjectTypes.value) {
  router.push(`/curriculums/${curriculumPk}/subjects`);
}

const links = [
  {
    label: "หน้าหลัก",
    to: "/",
  },
  {
    label: "ข้อมูลหลักสูตร",
    to: "/curriculums",
  },
  {
    label: "ข้อมูลรายวิชา",
  },
];

const subjects = ref([]);
const pending = ref(false);
const error = ref(null);

const getSubjects = async (
  limit: number,
  offset: number,
  name: string | undefined = undefined,
  subjectTypeId: number | undefined = undefined,
) => {
  pending.value = true;
  let apiEndpoint = `/api/subjects?limit=${limit}&offset=${offset}&curriculumPk=${curriculumPk}`;
  if (name) {
    apiEndpoint += `&search=${name}`;
  }
  if (subjectTypeId) {
    apiEndpoint += `&subjectTypeId=${subjectTypeId}`;
  }
  console.log(apiEndpoint);
  await $fetch(apiEndpoint, {
    onResponse: ({ response }) => {
      if (!response.ok) {
        error.value = response._data;
        return;
      }
      subjects.value = response._data.data;
      totalData.value = response._data.total;
    },
  });
  pending.value = false;
};

const q = ref(undefined);
const page = ref(1);
const perPage = ref(5);
const totalData = ref(0);
const subjectTypeId = ref(undefined);

watchEffect(async () => {
  const limit = perPage.value;
  const offset = (page.value - 1) * perPage.value;
  await getSubjects(limit, offset, q.value, subjectTypeId.value);
});

const onChangeFilter = () => {
  page.value = 1;
};

onMounted(() => {
  getSubjects(perPage.value, (page.value - 1) * perPage.value, q.value);
  onMounted(() => {
    if (!curriculum.value) {
      toast.add({
        title: "ไม่พบข้อมูล",
        description: "ไม่พบข้อมูลหลักสูตรที่คุณต้องการ",
        color: "red",
        icon: "i-heroicons-information-circle",
        callback: () => router.push("/curriculums"),
      });
    }
  });
});

const columns = [
  {
    key: "id",
    label: "รหัสรายวิชา",
    sortable: true,
  },
  {
    key: "nameTH",
    label: "ชื่อรายวิชา",
    sortable: true,
  },
  {
    key: "subjectType.name",
    label: "ประเภทรายวิชา",
    sortable: true,
  },
  {
    key: "subjectOccupationType.name",
    label: "วิชาชีพ",
    sortable: true,
  },
  {
    key: "overAllCredit",
    label: "หน่วยกิต",
    sortable: true,
  },
  {
    key: "actions",
    label: "ดำเนินการ",
  },
];

const isOpen = ref(false);
const row = ref();

const showDescription = (data: any) => {
  row.value = data;
  isOpen.value = true;
};

const isDeleteModal = ref(false);
const selectedSubject = ref<any | null>(null);
const openModal = (subject: any) => {
  selectedSubject.value = subject;
  isDeleteModal.value = true;
};

const closeModal = () => {
  isDeleteModal.value = false;
  selectedSubject.value = null;
};
const deleteSubjects = async (pk: number) => {
  await $fetch(`/api/subjects/${pk}`, {
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
        description: "ข้อมูลรายวิชาถูกลบเรียบร้อยแล้ว",
        color: "green",
        icon: "i-heroicons-information-circle",
      });
      getSubjects(
        perPage.value,
        (page.value - 1) * perPage.value,
        q.value,
        subjectTypeId.value,
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
      <div class="my-8">
        <h1 class="text-3xl text-center">ข้อมูลรายวิชา</h1>
        <h3 class="text-2xl text-center">{{ curriculum?.name }}</h3>
      </div>
      <div class="flex md:flex-row flex-col gap-2 justify-between my-4">
        <div class="flex md:flex-row flex-col gap-2">
          <UInput
            v-model="q"
            class="min-w-64"
            placeholder="ค้นหาชื่อรายวิชา..."
            @change="onChangeFilter"
          />
          <USelectMenu
            v-if="subjectTypes"
            v-model="subjectTypeId"
            :options="subjectTypes"
            class="min-w-64"
            option-attribute="name"
            placeholder="เลือกประเภทรายวิชา"
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
                subjectTypeId = undefined;
              }
            "
          >
          </UButton>
          <UButton
            :loading="pending"
            color="gray"
            icon="i-heroicons-arrow-path-20-solid"
            @click="
              getSubjects(perPage, (page - 1) * perPage, q, subjectTypeId)
            "
          >
            รีเฟรช
          </UButton>
        </div>
        <UButton
          :to="`/curriculums/${curriculumPk}/subjects/create`"
          icon="i-heroicons-plus-20-solid"
        >
          เพิ่มรายวิชา
        </UButton>
      </div>
      <UTable
        :columns="columns"
        :loading="pending"
        :rows="subjects"
        class="my-4"
      >
        <template #nameTH-data="{ row }">
          {{ row.nameTH }}<br />
          <small>{{ row.nameEN }}</small>
        </template>
        <template #overAllCredit-data="{ row }">
          {{
            row.overAllCredit || row.overAllCredit === 0
              ? row.overAllCredit
              : "ไม่ระบุ"
          }}
          ({{
            row.lectureCredit || row.lectureCredit === 0
              ? row.lectureCredit
              : "ไม่ระบุ"
          }}-{{
            row.labCredit || row.labCredit === 0 ? row.labCredit : "ไม่ระบุ"
          }}-{{
            row.selfLearnCredit || row.selfLearnCredit === 0
              ? row.selfLearnCredit
              : "ไม่ระบุ"
          }})
        </template>
        <template #actions-data="{ row }">
          <div class="flex md:flex-row flex-col gap-4">
            <UButton
              icon="i-heroicons-eye-20-solid"
              square
              @click="showDescription(row)"
            >
            </UButton>
            <UButton
              :to="`/curriculums/${curriculumPk}/subjects/${row.pk}/edit`"
              color="amber"
              icon="i-heroicons-pencil-square-solid"
            />
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
    <UModal v-model="isOpen">
      <div class="p-4">
        <div class="text-xl font-bold my-2">
          {{ row.nameTH }}<br />
          ({{ row.nameEN }})
        </div>
        <p class="my-2">
          {{ row.descTH }}
        </p>
        <p class="my-2">
          {{ row.descEN }}
        </p>
      </div>
    </UModal>
    <UModal v-model="isDeleteModal">
      <div class="p-4">
        <h1 class="text-2xl text-center">ยืนยันการลบข้อมูล</h1>
        <p class="text-center">คุณแน่ใจหรือไม่ที่จะลบข้อมูลนี้</p>
        <div class="text-center text-xl my-8">
          {{ selectedSubject?.nameTH }}
        </div>
        <div class="flex justify-center gap-4 my-4">
          <UButton color="red" @click="closeModal()">ยกเลิก</UButton>
          <UButton color="green" @click="deleteSubjects(selectedSubject!.pk)">
            ยืนยัน
          </UButton>
        </div>
      </div>
    </UModal>
  </UContainer>
</template>
