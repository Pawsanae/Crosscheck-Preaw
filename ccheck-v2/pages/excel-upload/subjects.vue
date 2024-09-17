<script lang="ts" setup>
const runtimeConfig = useRuntimeConfig();
const links = [
  {
    label: "หน้าหลัก",
    to: "/",
  },
  {
    label: "อัพโหลดข้อมูลรายวิชา",
    to: "/excel-upload/subjects",
  },
];

const columns = [
  {
    key: "columnName",
    label: "ชื่อคอลัมน์",
  },
  {
    key: "columnDescription",
    label: "คำอธิบาย",
  },
  {
    key: "columnType",
    label: "ประเภทข้อมูล",
  },
  {
    key: "columnLength",
    label: "จำนวนตัวอักษร",
  },

  {
    key: "columnExample",
    label: "ตัวอย่างข้อมูล",
  },
  {
    key: "columnRemark",
    label: "หมายเหตุ",
  },
];

type Row = {
  columnName: string;
  columnType: string;
  columnLength: string;
  columnDescription: string;
  columnExample: string;
  columnRemark?: string;
};

const rows: Row[] = [
  {
    columnName: "Academic program code *",
    columnType: "ข้อความ (Text)",
    columnLength: "14",
    columnDescription: "รหัสหลักสูตร 14 หลัก",
    columnExample: "25380191100532",
  },
  {
    columnName: "Academic year of program initiation *",
    columnType: "ข้อความ (Text)",
    columnLength: "4",
    columnDescription: "ปีของหลักสูตร",
    columnExample: "2564",
  },
  {
    columnName: "Academic program version *",
    columnType: "ตัวเลข (Number)",
    columnLength: "< 2",
    columnDescription: "เวอร์ชั่นของหลักสูตร",
    columnExample: "1",
  },
  {
    columnName: "Course code *",
    columnType: "ข้อความ (Text)",
    columnLength: "8",
    columnDescription: "รหัสของรายวิชา",
    columnExample: "2222216",
  },
  {
    columnName: "Course title (Thai) *",
    columnType: "ข้อความ (Text)",
    columnLength: "4",
    columnDescription: "ชื่อรายวิชา (ภาษาไทย)",
    columnExample: "ทักษะการเขียนภาษาอังกฤษ",
  },
  {
    columnName: "Course title (English) *",
    columnType: "ข้อความ (Text)",
    columnLength: "< 65,535",
    columnDescription: "ชื่อรายวิชา (ภาษาอังกฤษ)",
    columnExample: "English Writing Skills",
  },
  {
    columnName: "Course description (Thai) *",
    columnType: "ข้อความ (Text)",
    columnLength: "< 65,535",
    columnDescription: "คำอธิบายรายวิชา (ภาษาไทย)",
    columnExample:
      "ไวยากรณ์และประโยคแบบต่าง ๆ การเขียนประโยคที่สื่อสารได้ถูกต้องและชัดเจน...",
  },
  {
    columnName: "Course description (English) *",
    columnType: "ข้อความ (Text)",
    columnLength: "< 65,535",
    columnDescription: "คำอธิบายรายวิชา (ภาษาอังกฤษ)",
    columnExample: "Grammar and different sentence structures; sentences...",
  },
  {
    columnName: "Course credit",
    columnType: "ตัวเลข (Number)",
    columnLength: "< 2",
    columnDescription: "จำนวนหน่วยกิต",
    columnExample: "3",
  },
  {
    columnName: "Course credit (lecture)",
    columnType: "ตัวเลข (Number)",
    columnLength: "< 2",
    columnDescription: "จำนวนชั่วโมงในการบรรยาย ต่อสัปดาห์",
    columnExample: "3",
  },
  {
    columnName: "Course credit (lab)",
    columnType: "ตัวเลข (Number)",
    columnLength: "< 2",
    columnDescription: "จำนวนชั่วโมงในการปฏิบัติ ต่อสัปดาห์",
    columnExample: "0",
  },
  {
    columnName: "Course credit (self study)",
    columnType: "ตัวเลข (Number)",
    columnLength: "< 2",
    columnDescription: "จำนวนชั่วโมงในการศึกษาด้วยตัวเอง ต่อสัปดาห์",
    columnExample: "0",
  },
  {
    columnName: "Course type",
    columnType: "ข้อความ (Text)",
    columnLength: "< 65,535",
    columnDescription: "ประเภทรายวิชา",
    columnExample: "ไม่ระบุ",
    columnRemark:
      "ตัวเลือกที่สามารถเลือกได้มีดังนี้ ไม่ระบุ, เอกบังคับ, เอกเลือก",
  },
  {
    columnName: "Course occupation type",
    columnType: "ข้อความ (Text)",
    columnLength: "< 65,535",
    columnDescription: "ประเภทวิชาชีพ",
    columnExample: "ไม่เป็นวิชาชีพ",
    columnRemark:
      "ตัวเลือกที่สามารถเลือกได้มีดังนี้ ไม่เป็นวิชาชีพ, เป็นวิชาชีพ",
  },
];

const toast = useToast();
const router = useRouter();

const refForm = ref();
const file = ref();
const isPending = ref(false);

const handleFile = async () => {
  isPending.value = true;
  const formData = new FormData();
  formData.append("file", file.value.files[0]);
  // console.log(reviewerFile.value.files[0]);
  await $fetch(`${runtimeConfig.public.BASE_API_URL}/subjects/upload`, {
    method: "POST",
    body: formData,
    onResponse: ({ response }) => {
      if (!response.ok) {
        toast.add({
          title: "เกิดข้อผิดพลาด",
          description: response._data.detail,
          color: "red",
          icon: "i-heroicons-information-circle",
          timeout: 10000,
        });
        refForm.value.reset();
        isPending.value = false;
        return;
      }
      toast.add({
        title: "บันทึกข้อมูลสำเร็จ",
        description: "ข้อมูลรายวิชาถูกบันทึกเรียบร้อยแล้ว",
        color: "green",
        icon: "i-heroicons-information-circle",
      });
      router.push("/curriculums");
    },
    onRequestError: (error) => {
      toast.add({
        title: "เกิดข้อผิดพลาดขณะบันทึกข้อมูล",
        description: error.error.message,
        color: "red",
        icon: "i-heroicons-information-circle",
        timeout: 10000,
      });
      refForm.value.reset();
      isPending.value = false;
    },
  });
};
</script>
<template>
  <UContainer class="my-4">
    <UCard>
      <UBreadcrumb :links="links" />
      <h1 class="text-3xl text-center my-4">อัพโหลดข้อมูลรายวิชา</h1>
      <h3 class="text-lg text-center my-4">
        คำอธิบายเบื้องต้น: โปรดตรวจสอบไฟล์ของท่านให้ตรงตามเงื่อนไขต่อไปนี้
      </h3>
      <div class="flex justify-center my-8">
        <div class="w-96">
          <a
            :href="`${runtimeConfig.public.BASE_API_URL}/excel-template/subjects`"
            target="_blank"
          >
            <UButton
              block
              icon="i-heroicons-document-arrow-down-solid"
              variant="outline"
            >
              ดาวน์โหลดแบบฟอร์มไฟล์ข้อมูลรายวิชา
            </UButton>
          </a>
        </div>
      </div>

      <div class="m-2 text-xl font-bold">ชื่อชีท (Sheet Name)</div>
      <div class="m-2">ชื่อของชีทที่ต้องการ: subject_data</div>
      <div class="m-2 text-xl font-bold">ชื่อคอลัมน์ (Column Name)</div>
      <div class="text-red-500 text-end m-2">
        หากชื่อคอลัมน์ใดมี * หมายความว่าจำเป็นต้องกรอกข้อมูล
      </div>
      <UTable :columns="columns" :rows="rows">
        <template #columnName-data="{ row }">
          <div v-if="row.columnName.slice(-1) == '*'">
            <div>
              <span>{{ row.columnName.slice(0, -1) }}</span>
              <span class="text-red-500">*</span>
            </div>
          </div>
          <div v-else class="max-w-96 whitespace-normal break-words">
            {{ row.columnName }}
          </div>
        </template>
        <template #columnDescription-data="{ row }">
          <div class="max-w-96 whitespace-normal break-words">
            {{ row.columnDescription }}
          </div>
        </template>
        <template #columnExample-data="{ row }">
          <div class="max-w-96 whitespace-normal break-words">
            {{ row.columnExample }}
          </div>
        </template>
        <template #columnRemark-data="{ row }">
          <div class="max-w-96 whitespace-normal break-words">
            {{ row.columnRemark }}
          </div>
        </template>
      </UTable>
      <UDivider class="my-4" />
      <form ref="refForm">
        <UFormGroup
          class=""
          help="กรุณาอัพโหลดไฟล์ .xlsx โดยมีชีทที่ชื่อว่า 'subject_data'"
          label="อัพโหลดไฟล์ข้อมูลรายวิชา"
        >
          <input
            id="file"
            ref="file"
            :disabled="isPending"
            accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            class="block w-full text-md text-slate-500 file:mr-4 file:py-1.5 file:px-2.5 file:rounded-l-md file:border-0 file:text-md file:font-semibold file:bg-slate-700 file:text-white hover:file:bg-slate-900 border-0 rounded-md shadow-sm ring-1 ring-gray-200 pe-2.5"
            name="file"
            required
            type="file"
            @change="handleFile"
          />
          <UProgress v-if="isPending" animation="carousel" class="my-2" />
        </UFormGroup>
      </form>
    </UCard>
  </UContainer>
</template>
