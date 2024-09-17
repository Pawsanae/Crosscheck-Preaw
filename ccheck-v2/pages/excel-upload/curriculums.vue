<script lang="ts" setup>
const runtimeConfig = useRuntimeConfig();
const links = [
  {
    label: "หน้าหลัก",
    to: "/",
  },
  {
    label: "อัพโหลดข้อมูลหลักสูตร",
    to: "/excel-upload/curriculums",
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
    columnExample: "25630194000857",
  },
  {
    columnName: "Academic program *",
    columnType: "ข้อความ (Text)",
    columnLength: "< 65,535",
    columnDescription: "ชื่อของหลักสูตร",
    columnExample:
      "หลักสูตรวิทยาศาสตรบัณฑิต สาขาวิชาปัญญาประดิษฐ์ประยุกต์และเทคโนโลยีอัจฉริยะ (หลักสูตรสองภาษา)",
  },
  {
    columnName: "Education level *",
    columnType: "ข้อความ (Text)",
    columnLength: "< 65,535",
    columnDescription: "ระดับการศึกษาของหลักสูตร",
    columnExample: "ปริญญาตรี",
  },
  {
    columnName: "Faculty *",
    columnType: "ข้อความ (Text)",
    columnLength: "< 65,535",
    columnDescription: "คณะที่เปิดสอนหลักสูตร",
    columnExample: "คณะวิทยาการสารสนเทศ",
  },
  {
    columnName: "Academic year of program initiation *",
    columnType: "ข้อความ (Text)",
    columnLength: "4",
    columnDescription: "ปีที่เปิดหรือปรับปรุงหลักสูตร",
    columnExample: "2564",
    columnRemark: "ปี พ.ศ.",
  },
  {
    columnName: "Program philosophy",
    columnType: "ข้อความ (Text)",
    columnLength: "< 65,535",
    columnDescription: "ปรัชญา",
    columnExample:
      "หลักสูตรนี้มุ่งสร้างบัณฑิตนักปัญญาประดิษฐ์และเทคโนโลยีอปัจฉริยะ....",
  },
  {
    columnName: "Program description",
    columnType: "ข้อความ (Text)",
    columnLength: "< 65,535",
    columnDescription: "คำอธิบาย",
    columnExample:
      "ปัญญาประดิษฐ์ประยุกต์และเทคโนโลยีอปัจฉริยะ ได้พัฒนาขึ้นเพื่อ...",
  },
  {
    columnName: "Program educational objectives",
    columnType: "ข้อความ (Text)",
    columnLength: "< 65,535",
    columnDescription: "วัตถุประสงค์หลักสูตร (PEO)",
    columnExample:
      "เมื่อสิ้นสุดการเรียนการสอนตามหลักสูตรวิทยาศาสตรบัณฑิต สาขาวิชาปัญญาประดิษฐ์ประยุกต์...",
  },
  {
    columnName: "Program Learning Outcomes",
    columnType: "ข้อความ (Text)",
    columnLength: "< 65,535",
    columnDescription: "ทักษะและสมรรถนะของบัณฑิต (PLO)",
    columnExample:
      "เมื่อสิ้นสุดการเรียนการสอนตามหลักสูตรวิทยาศาสตรบัณฑิต สาขาวิชาปัญญาประดิษฐ์...",
  },
  {
    columnName: "Collaborative networks supporting academic program",
    columnType: "ข้อความ (Text)",
    columnLength: "< 65,535",
    columnDescription: "เครือข่ายความร่วมมือในการสนับสนุนหลักสูตร",
    columnExample: "บริษัท แวมสแตค จำกัด",
  },
  {
    columnName: "Details of international/National collaborative",
    columnType: "ข้อความ (Text)",
    columnLength: "< 65,535",
    columnDescription: "รายละเอียดความร่วมมือนานาชาติ/ระดับชาติ",
    columnExample: "",
  },
  {
    columnName: "Academic program accord with business opportunities",
    columnType: "ข้อความ (Text)",
    columnLength: "< 65,535",
    columnDescription:
      "หลักสูตรสอดคล้องต่ออุตสาหกรรมเป้าหมาย จำแนกตามกลุ่มอุตสาหกรรม",
    columnExample: "",
  },
  {
    columnName: "Academic program instruction following CWIE Model",
    columnType: "ข้อความ (Text)",
    columnLength: "< 65,535",
    columnDescription: "หลักสูตรที่จัดการเรียนการสอนตามแนวทาง CWIE Model",
    columnExample: "",
  },
  {
    columnName: "Academic program instruction following EEC Model",
    columnType: "ข้อความ (Text)",
    columnLength: "< 65,535",
    columnDescription: "หลักสูตรที่จัดการเรียนการสอนตามแนวทาง EEC Model",
    columnExample: "",
  },
  {
    columnName: "Duration of study",
    columnType: "ข้อความ (Text)",
    columnLength: "< 65,535",
    columnDescription: "ระยะเวลาในการเรียน",
    columnExample: "4",
    columnRemark: "หากไม่กรอกระยะเวลา ระบบจะกำหนดให้เป็น 4 ปี",
  },
  {
    columnName: "Version",
    columnType: "ตัวเลข (Number)",
    columnLength: "< 2",
    columnDescription: "เวอร์ชั่นของหลักสูตร",
    columnExample: "1",
    columnRemark: "หากไม่กรอกเวอร์ชั่น ระบบจะกำหนดให้เป็น 1",
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
  await $fetch(`${runtimeConfig.public.BASE_API_URL}/curriculums/upload`, {
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
        description: "ข้อมูลหลักสูตรถูกบันทึกเรียบร้อยแล้ว",
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
      <h1 class="text-3xl text-center my-4">อัพโหลดข้อมูลหลักสูตร</h1>
      <h3 class="text-lg text-center my-4">
        คำอธิบายเบื้องต้น: โปรดตรวจสอบไฟล์ของท่านให้ตรงตามเงื่อนไขต่อไปนี้
      </h3>
      <div class="flex justify-center my-8">
        <div class="w-96">
          <a
            :href="`${runtimeConfig.public.BASE_API_URL}/excel-template/curriculums`"
            target="_blank"
          >
            <UButton
              block
              icon="i-heroicons-document-arrow-down-solid"
              variant="outline"
            >
              ดาวน์โหลดแบบฟอร์มไฟล์ข้อมูลหลักสูตร
            </UButton>
          </a>
        </div>
      </div>

      <div class="m-2 text-xl font-bold">ชื่อชีท (Sheet Name)</div>
      <div class="m-2">ชื่อของชีทที่ต้องการ: curriculum_data</div>
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
          help="กรุณาอัพโหลดไฟล์ .xlsx โดยมีชีทที่ชื่อว่า 'curriculum_data'"
          label="อัพโหลดไฟล์ข้อมูลหลักสูตร"
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
