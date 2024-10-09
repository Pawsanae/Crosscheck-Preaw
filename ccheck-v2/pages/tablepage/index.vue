<script lang="ts" setup>
import { ref, onMounted } from "vue";
// import dataGraph from "./dataGraph.vue";
import "@/css-index/stlye.css";
import { and } from "drizzle-orm";

const { data: curriculum_primary } = await useFetch("/api/curriculums-sim");
const { data: curriculum_compare } = await useFetch("/api/curriculums-sim");

// Update to the latest version
const curriculum_primary_details = ref(undefined);
const curriculum_compare_details = ref(undefined);

watchEffect(() => {
  const curriculum_primary = curriculum_primary_details.value;
  const curriculum_compare = curriculum_compare_details.value;
});

const props = {
  data: {
    curriculumsInfo: {
      // ยังไม่มีข้อมูลให้ส่งไป
      primary: {
        curriculum_pk: curriculum_primary_details.value?.pk,
        curriculum_code: curriculum_primary_details.value?.id,
        curriculum_name: curriculum_primary_details.value?.name,
        curriculum_year: curriculum_primary_details.value?.year,
      },
      compare: {
        curriculum_pk: curriculum_compare_details.value?.pk,
        curriculum_code: curriculum_compare_details.value?.id,
        curriculum_name: curriculum_compare_details.value?.name,
        curriculum_year: curriculum_compare_details.value?.year,
      },
      primary_curriculums_subject_type: ["ไม่ระบุ", "เอกบังคับ", "เอกเลือก"],
      compare_curriculums_subject_type: ["ไม่ระบุ", "เอกบังคับ", "เอกเลือก"],
    },
    bodyData: {
      boundary: [
        {
          boundary_name: "red",
          lower_boundary: 0.795,
          upper_boundary: 1,
          weight: 0.4,
        },
        {
          boundary_name: "orange",
          lower_boundary: 0.595,
          upper_boundary: 0.795,
          weight: 0.3,
        },
        {
          boundary_name: "yellow",
          lower_boundary: 0.395,
          upper_boundary: 0.595,
          weight: 0.2,
        },
        {
          boundary_name: "light green",
          lower_boundary: 0.195,
          upper_boundary: 0.395,
          weight: 0.1,
        },
        {
          boundary_name: "green",
          lower_boundary: 0,
          upper_boundary: 0.195,
          weight: 0,
        },
      ],
      compare_curriculum_pk: curriculum_compare_details.value?.pk,
      primary_curriculum_pk: curriculum_primary_details.value?.pk,
    },
    simirarityData: {
      cruriculumsSim: 0.4,
      groupSim: [
        {
          green: 0,
          lightgreen: 0,
          yellow: 0,
          orange: 0,
          red: 0,
        },
      ],
    },
  },
};

type Similarity = {
  similarity: number;
  simirality_type: string;
  subject1_id: number;
  subject1_name: string;
  subject1_type: string;
  subject2_id: number;
  subject2_name: string;
  subject2_type: string;
};

const getBackgroundColor = (value: any, props: any) => {
  const boundaryColors: { [key: string]: string } = {
    red: "bg-red-200",
    orange: "bg-orange-200",
    yellow: "bg-yellow-200",
    "light green": "bg-lime-200",
    green: "bg-green-200",
  };

  for (let boundary of props.data.bodyData.boundary) {
    if (value >= boundary.lower_boundary && value <= boundary.upper_boundary) {
      return boundaryColors[boundary.boundary_name];
    }
  }

  // Specific condition for value <= 0.1
  if (value == "<= 0.1") {
    return boundaryColors["green"];
  }

  return "";
};

const subject = ref<Similarity[]>([]);
const header = ref([]);
const columns = ref<{ key: string; label: string }[]>([]);
const index = ref([]);
const row = ref<any[][]>([]);

const pending = ref(false);

const initialHeader = ref<string[]>([]);
const initialIndex = ref<string[]>([]);
const initialRow = ref<any[][]>([]);

const getSubject = async () => {
  // ตรวจสอบว่าได้เลือกหลักสูตรทั้งสองก่อน
  if (!curriculum_primary_details.value || !curriculum_compare_details.value) {
    return;
  }

  // ตั้งค่าตัวแปร PK สำหรับหลักสูตรหลักและหลักสูตรเปรียบเทียบ
  props.data.bodyData.primary_curriculum_pk = curriculum_primary_details.value.pk;
  props.data.bodyData.compare_curriculum_pk = curriculum_compare_details.value.pk;

  try {
    pending.value = true;
    getRatio();

    // เรียก API เพื่อดึงข้อมูล similarity
    await $fetch(`http://127.0.0.1:8000/similarities/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(props.data?.bodyData),
      onResponse: ({ response }) => {
        if (!response.ok) {
          console.error("Error fetching data:", response);
          return;
        }

        subject.value = response._data.filter((i: Similarity) => {
          return (
            props.data.curriculumsInfo.primary_curriculums_subject_type.includes(i.subject1_type) &&
            props.data.curriculumsInfo.compare_curriculums_subject_type.includes(i.subject2_type)
          );
        });

        // สร้าง header และ index ใหม่
        header.value = [
          ...new Set(subject.value.map((i: Similarity) => i.subject1_name)),
        ].sort((a, b) => {
          const similarityA = subject.value.find(
            (item) => item.subject1_name === a
          )?.similarity || 0;
          const similarityB = subject.value.find(
            (item) => item.subject1_name === b
          )?.similarity || 0;
          return similarityB - similarityA;
        });

        index.value = [
          ...new Set(subject.value.map((i: Similarity) => i.subject2_name)),
        ].sort((a, b) => {
          const similarityA = subject.value.find(
            (item) => item.subject2_name === a
          )?.similarity || 0;
          const similarityB = subject.value.find(
            (item) => item.subject2_name === b
          )?.similarity || 0;
          return similarityB - similarityA;
        });

        columns.value = [
          { key: "0", label: "" },
          ...header.value.map((i: string, ind: number) => {
            return { key: `${ind + 1}`, label: i };
          }),
        ];

        row.value = index.value.map((subject2) => {
          const rowValues = header.value.map((subject1) => {
            const similarity = subject.value.find(
              (item: Similarity) =>
                item.subject1_name === subject1 &&
                item.subject2_name === subject2
            )?.similarity;
            return {
              value: similarity !== undefined ? similarity : "-",
              colorBG: similarity !== undefined ? getBackgroundColor(similarity, props) : "",
            };
          });

          // ตรวจสอบว่าแถวนี้มีข้อมูลที่ไม่ใช่ '-' หรือไม่
          const hasData = rowValues.some(cell => cell.value !== "-");

          // ถ้ามีข้อมูล แสดงแถวนี้
          if (hasData) {
            return [{ value: subject2 }, ...rowValues];
          }

          // ถ้าไม่มีข้อมูล ไม่แสดงแถวนี้
          return null;
        }).filter(row => row !== null);



        // เก็บข้อมูลเริ่มต้นของ header, index, และ row สำหรับการรีเซ็ต
        initialHeader.value = [...header.value];
        initialIndex.value = [...index.value];
        initialRow.value = [...row.value];

      },
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    pending.value = false;
  }
};



watch([curriculum_primary_details, curriculum_compare_details], getSubject);

const ratio = props.data?.simirarityData.groupSim[0];
const getRatio = async () => {
  try {
    await $fetch(`http://127.0.0.1:8000/similarities/ratio-of-labeling`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(props.data?.bodyData),
      onResponse: ({ response }) => {
        if (!response.ok) {
          console.error("Error fetching data:", response);
          return;
        }
        console.log(response._data)
        ratio.green = response._data.green;
        ratio.lightgreen = response._data["light green"];
        ratio.orange = response._data.orange;
        ratio.red = response._data.red;
        ratio.yellow = response._data.yellow;

        pending.value = false;
      },
    });
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

const similarityData = props.data?.simirarityData.cruriculumsSim;

//onMounted(() => {
// pending.value = true;
// getSubject(props, header, columns, index, row);
// getRatio();
// getSimilality();
//});

const updateRowData = (filteredSubjects: Similarity[]) => {
  // สร้าง newIndex ตาม subjects ที่กรอง
  const newIndex = [
    ...new Set(filteredSubjects.map((i: Similarity) => i.subject2_name)),
  ].sort();

  // สร้างแผนที่เพื่อจัดเก็บความคล้ายคลึง
  const similarityMap = new Map<string, Map<string, number>>();

  // ป้อนข้อมูลลงใน similarityMap
  filteredSubjects.forEach((item: Similarity) => {
    if (!similarityMap.has(item.subject1_name)) {
      similarityMap.set(item.subject1_name, new Map());
    }
    similarityMap.get(item.subject1_name)?.set(item.subject2_name, item.similarity);
  });

  // สร้าง header ใหม่ตาม subjects ที่มี similarities
  const newHeader = Array.from(similarityMap.keys()).sort();

  // สร้างข้อมูล row ใหม่
  const newRow = newIndex.map((subject2) => {
    return [
      { value: subject2 },
      ...newHeader.map((subject1) => {
        const similarity = similarityMap.get(subject1)?.get(subject2);
        return {
          value: similarity !== undefined ? similarity : "-", // ใช้ "-" หากไม่พบข้อมูล
          colorBG: similarity !== undefined
            ? getBackgroundColor(similarity, props)
            : "", // ปล่อยสีพื้นหลังว่างหากไม่มี similarity
        };
      }),
    ];
  });

  // อัปเดตค่า index, header, และ row
  index.value = newIndex;
  header.value = newHeader;
  row.value = newRow;
};


const filterByRatio = (selectedRatio: string) => {

  const selectedBoundary = props.data.bodyData.boundary.find(
    (boundary) =>
      boundary.boundary_name.replace(" ", "").toLowerCase() ===
      selectedRatio.toLowerCase()
  );

  if (!selectedBoundary) {
    console.error("No matching boundary found for:", selectedRatio);
    return;
  }

  // ทำการ filter ข้อมูลที่มี similarity ตรงตาม boundary ที่เลือก
  const filteredSubjects = subject.value.filter((item: Similarity) => {
    return (
      item.similarity >= selectedBoundary.lower_boundary &&
      item.similarity <= selectedBoundary.upper_boundary
    );
  });

  // อัปเดตค่าในตาราง โดยไม่เปลี่ยนแปลง header และ index
  row.value = index.value.map((subject2) => {
    const rowValues = header.value.map((subject1) => {
      const similarity = filteredSubjects.find(
        (item: Similarity) =>
          item.subject1_name === subject1 &&
          item.subject2_name === subject2
      )?.similarity;
      return {
        value: similarity !== undefined ? similarity : "-",
        colorBG: similarity !== undefined ? getBackgroundColor(similarity, props) : "",
      };
    });
    return [{ value: subject2 }, ...rowValues];
  });
};

const updateTableData = (subjectData: Similarity[]) => {
  // สร้าง header ใหม่
  header.value = [
    ...new Set(subjectData.map((i: Similarity) => i.subject1_name)),
  ];

  // สร้าง index ใหม่
  index.value = [
    ...new Set(subjectData.map((i: Similarity) => i.subject2_name)),
  ];

  // สร้างข้อมูลแถวใหม่ (row)
  row.value = index.value.map((subject2) => {
    return [
      { value: subject2 },
      ...header.value.map((subject1) => {
        const similarity = subjectData.find(
          (item: Similarity) =>
            item.subject1_name === subject1 && item.subject2_name === subject2
        )?.similarity;

        return {
          value: similarity !== undefined ? similarity : "-",
          colorBG: similarity !== undefined
            ? getBackgroundColor(similarity, props)
            : "",
        };
      }),
    ];
  });
};

// เรียกใช้ updateTableData เมื่อมีการอัปเดตข้อมูล subject
watch([curriculum_primary_details, curriculum_compare_details], async () => {
  if (curriculum_primary_details.value && curriculum_compare_details.value) {
    await getSubject();
  }
});

const resetFilter = () => {
  // คืนค่า header, index, และ row ให้เป็นค่าที่ถูกโหลดหลังจากเลือกหลักสูตร
  header.value = [...initialHeader.value]; 
  index.value = [...initialIndex.value];    
  row.value = [...initialRow.value];      
};


</script>

<template>
  <div v-if="pending" class="slice-page">
    <div class="container">
      <div class="slice"></div>
      <div class="slice"></div>
      <div class="slice"></div>
      <div class="slice"></div>
      <div class="slice"></div>
      <div class="slice"></div>
    </div>
  </div>
  <div v-else class="page">
    <div>
      <div class="cur-box">
        <div
          class="col-start-1 col-span-2 row-start-1 bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800 ring-1 ring-gray-200 dark:ring-gray-800 rounded-lg shadow"
          style="margin-right: 1rem"
        >
          <div class="cur">
            <div class="p-3 text-center">
              <h2 class="text-xl">เลือกหลักสูตรที่ 1</h2>
              <USelectMenu
                v-if="curriculum_primary"
                v-model="curriculum_primary_details"
                :options="curriculum_primary"
                class="w-100 md:max-lg:w-60 sm:max-md:w-20 mt-1"
                option-attribute="name"
                placeholder="Select a curriculum..."
                searchable
              />
            </div>
          </div>
        </div>
        <div
          class="col-start-3 col-span-2 row-start-1 bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800 ring-1 ring-gray-200 dark:ring-gray-800 rounded-lg shadow"
        >
          <div class="cur">
            <div class="p-3 text-center">
              <h2 class="text-xl">เลือกหลักสูตรที่ 2</h2>
              <USelectMenu
                v-if="curriculum_compare"
                v-model="curriculum_compare_details"
                :options="curriculum_compare"
                class="w-100 md:max-lg:w-60 sm:max-md:w-20 mt-1"
                option-attribute="name"
                placeholder="Select a curriculum..."
                searchable
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div>
      <div class="all_box">
        <div class="bg-green-200 shadow box_line">
          <button @click="filterByRatio('green')">
            <div class="my_div grid place-content-center">
              <div class="txt-box-color">Green</div>
              <div class="txt-box-per">
                {{ (parseFloat(ratio.green)).toFixed(2) ?? "-" }}%
              </div>
            </div>
          </button>
        </div>
        <div class="bg-lime-200 my_div shadow box_line">
          <button @click="filterByRatio('lightgreen')">
            <div class="my_div grid place-content-center">
              <div class="txt-box-color">LightGreen</div>
              <div class="txt-box-per">
                {{ (parseFloat(ratio.lightgreen)).toFixed(2) ?? "-" }}%
              </div>
            </div>
          </button>
        </div>
        <div class="bg-yellow-200 my_div shadow box_line">
          <button @click="filterByRatio('yellow')">
            <div class="my_div grid place-content-center">
              <div class="txt-box-color">Yellow</div>
              <div class="txt-box-per">
                {{ (parseFloat(ratio.yellow)).toFixed(2) ?? "-" }}%
              </div>
            </div>
          </button>
        </div>
        <div class="bg-orange-200 my_div shadow box_line">
          <button @click="filterByRatio('orange')">
            <div class="my_div grid place-content-center">
              <div class="txt-box-color">Orange</div>
              <div class="txt-box-per">
                {{ (parseFloat(ratio.orange)).toFixed(2) ?? "-" }}%
              </div>
            </div>
          </button>
        </div>
        <div class="bg-red-200 my_div shadow box_line">
          <button @click="filterByRatio('red')">
            <div class="my_div grid place-content-center">
              <div class="txt-box-color">Red</div>
              <div class="txt-box-per">
                {{ (parseFloat(ratio.red)).toFixed(2) ?? "-" }}%
              </div>
            </div>
          </button>
        </div>
        <div class="bg-[#f0f0f0] my_div shadow box_line">
          <div class="my_div grid place-content-center">
            <div class="txt-box-color">Similarity</div>
            <div class="txt-box-per">
              {{ (parseFloat(similarityData) * 100).toFixed(2) }}%
            </div>
          </div>
        </div>
        <button @click="resetFilter" class="btn-reset">Reset</button>
      </div>
    </div>
    <div class="table-center">
      <div class="table-container ">
        <table class="beautiful-table">
          <thead>
            <tr>
              <th v-for="col in columns" :key="col.key">{{ col.label }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(rowItem, rowIndex) in row" :key="rowIndex">
              <td v-for="(cell, cellIndex) in rowItem" :key="cellIndex" :class="cell?.colorBG">
                {{ cell?.value !== undefined ? cell.value : "" }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
