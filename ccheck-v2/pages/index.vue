<script lang="ts" setup>
import { ref } from "vue";
import json from "~/static/data.json";
import { float } from "drizzle-orm/mysql-core";
import VueSimpleRangeSlider from "vue-simple-range-slider";
import "vue-simple-range-slider/css";
import dataTable from "~/components/dataTable.vue";
import nodegraph from "~/components/nodegraph.vue";


const links = [
  {
    label: "หน้าหลัก",
    to: "/",
  },
  {
    label: "sim",
    to: "/sim",
  },
];

const { data: curriculum_primary } = await useFetch("/api/curriculums-sim");
const { data: curriculum_compare } = await useFetch("/api/curriculums-sim");
const { data: subject_type_primary } = await useFetch("/api/subject-types");
const { data: subject_type_compare } = await useFetch("/api/subject-types");

console.log(subject_type_primary);
console.log(subject_type_compare);

const form = ref({
  GreenLower: "",
  GreenUpper: "",
  GreenWeight: "",
  LightGreenLower: "",
  LightGreenUpper: "",
  LightGreenWeight: "",
  YellowLower: "",
  YellowUpper: "",
  YellowWeight: "",
  OrangeLower: "",
  OrangeUpper: "",
  OrangeWeight: "",
  RedLower: "",
  RedUpper: "",
  RedWeight: "",
});

const form_bar = ref({
  Green: reactive({ range: ["", ""], weight: "" }),
  LightGreen: reactive({ range: ["", ""], weight: "" }),
  Yellow: reactive({ range: ["", ""], weight: "" }),
  Orange: reactive({ range: ["", ""], weight: "" }),
  Red: reactive({ range: ["", ""], weight: "" }),
});

//Preset 5 set
const set_color = [
  "5 กลุ่มแนะนำ",
  "5 กลุ่มมีน้ำหนัก",
  "3 กลุ่มแนะนำ",
  "3 กลุ่มแดงเด่น",
  "3 กลุ่มน้ำหนักเท่า",
];
const SelectPreset = ref("");

watch(SelectPreset, (value) => {
  if (value === "5 กลุ่มแนะนำ") {
    Default_5_set();
  } else if (value === "5 กลุ่มมีน้ำหนัก") {
    The_all_weight_5_set();
  } else if (value === "3 กลุ่มแนะนำ") {
    Default_3_set();
  } else if (value === "3 กลุ่มแดงเด่น") {
    Red_flag_3_set();
  } else if (value === "3 กลุ่มน้ำหนักเท่า") {
    Middle_pop_3_set();
  }
});

const Default_5_set = () => {
  form.value.GreenLower = "0";
  form.value.GreenUpper = "20";
  form.value.GreenWeight = "0";
  form.value.LightGreenLower = "25";
  form.value.LightGreenUpper = "40";
  form.value.LightGreenWeight = "1";
  form.value.YellowLower = "45";
  form.value.YellowUpper = "60";
  form.value.YellowWeight = "2";
  form.value.OrangeLower = "65";
  form.value.OrangeUpper = "80";
  form.value.OrangeWeight = "3";
  form.value.RedLower = "85";
  form.value.RedUpper = "100";
  form.value.RedWeight = "4";
  form_bar.value.Green.range = ["0", "20"];
  form_bar.value.Green.weight = "0";
  form_bar.value.LightGreen.range = ["20", "40"];
  form_bar.value.LightGreen.weight = "1";
  form_bar.value.Yellow.range = ["40", "60"];
  form_bar.value.Yellow.weight = "2";
  form_bar.value.Orange.range = ["60", "80"];
  form_bar.value.Orange.weight = "3";
  form_bar.value.Red.range = ["80", "100"];
  form_bar.value.Red.weight = "4";
};
const The_all_weight_5_set = () => {
  form.value.GreenLower = "0";
  form.value.GreenUpper = "20";
  form.value.GreenWeight = "1";
  form.value.LightGreenLower = "25";
  form.value.LightGreenUpper = "40";
  form.value.LightGreenWeight = "1";
  form.value.YellowLower = "45";
  form.value.YellowUpper = "60";
  form.value.YellowWeight = "0.1";
  form.value.OrangeLower = "65";
  form.value.OrangeUpper = "80";
  form.value.OrangeWeight = "3";
  form.value.RedLower = "85";
  form.value.RedUpper = "100";
  form.value.RedWeight = "4";
  form_bar.value.Green.range = ["0", "20"];
  form_bar.value.Green.weight = "1";
  form_bar.value.LightGreen.range = ["20", "40"];
  form_bar.value.LightGreen.weight = "1";
  form_bar.value.Yellow.range = ["40", "60"];
  form_bar.value.Yellow.weight = "1";
  form_bar.value.Orange.range = ["60", "80"];
  form_bar.value.Orange.weight = "3";
  form_bar.value.Red.range = ["80", "100"];
  form_bar.value.Red.weight = "4";
};
const Default_3_set = () => {
  form.value.GreenLower = "0";
  form.value.GreenUpper = "35";
  form.value.GreenWeight = "2";
  form.value.LightGreenLower = "";
  form.value.LightGreenUpper = "";
  form.value.LightGreenWeight = "";
  form.value.YellowLower = "40";
  form.value.YellowUpper = "65";
  form.value.YellowWeight = "3";
  form.value.OrangeLower = "";
  form.value.OrangeUpper = "";
  form.value.OrangeWeight = "";
  form.value.RedLower = "70";
  form.value.RedUpper = "100";
  form.value.RedWeight = "5";
  form_bar.value.Green.range = ["0", "35"];
  form_bar.value.Green.weight = "2";
  form_bar.value.LightGreen.range = ["35", "70"];
  form_bar.value.LightGreen.weight = "3";
  form_bar.value.Yellow.range = ["70", "100"];
  form_bar.value.Yellow.weight = "5";
  form_bar.value.Orange.range = ["0", "0.1"];
  form_bar.value.Orange.weight = "0.0";
  form_bar.value.Red.range = ["0", "0.1"];
  form_bar.value.Red.weight = "0";
};
const Red_flag_3_set = () => {
  form.value.GreenLower = "0";
  form.value.GreenUpper = "35";
  form.value.GreenWeight = "1";
  form.value.LightGreenLower = "";
  form.value.LightGreenUpper = "";
  form.value.LightGreenWeight = "";
  form.value.YellowLower = "40";
  form.value.YellowUpper = "65";
  form.value.YellowWeight = "2";
  form.value.OrangeLower = "";
  form.value.OrangeUpper = "";
  form.value.OrangeWeight = "";
  form.value.RedLower = "70";
  form.value.RedUpper = "100";
  form.value.RedWeight = "7";
  form_bar.value.Green.range = ["0", "35"];
  form_bar.value.Green.weight = "1";
  form_bar.value.LightGreen.range = ["35", "70"];
  form_bar.value.LightGreen.weight = "2";
  form_bar.value.Yellow.range = ["70", "100"];
  form_bar.value.Yellow.weight = "7";
  form_bar.value.Orange.range = ["0", "0.1"];
  form_bar.value.Orange.weight = "0";
  form_bar.value.Red.range = ["0", "0.1"];
  form_bar.value.Red.weight = "0";
};

const Middle_pop_3_set = () => {
  form.value.GreenLower = "0";
  form.value.GreenUpper = "35";
  form.value.GreenWeight = "3";
  form.value.LightGreenLower = "";
  form.value.LightGreenUpper = "";
  form.value.LightGreenWeight = "";
  form.value.YellowLower = "40";
  form.value.YellowUpper = "65";
  form.value.YellowWeight = "3";
  form.value.OrangeLower = "";
  form.value.OrangeUpper = "";
  form.value.OrangeWeight = "";
  form.value.RedLower = "70";
  form.value.RedUpper = "100";
  form.value.RedWeight = "4";
  form_bar.value.Green.range = ["0", "35"];
  form_bar.value.Green.weight = "3";
  form_bar.value.LightGreen.range = ["35", "70"];
  form_bar.value.LightGreen.weight = "3";
  form_bar.value.Yellow.range = ["70", "100"];
  form_bar.value.Yellow.weight = "4";
  form_bar.value.Orange.range = ["0", "0.1"];
  form_bar.value.Orange.weight = "0";
  form_bar.value.Red.range = ["0", "0.1"];
  form_bar.value.Red.weight = "0";
};

// Update to the latest version
const curriculum_primary_details = ref(undefined);
const curriculum_compare_details = ref(undefined);

watchEffect(() => {
  const curriculum_primary = curriculum_primary_details.value;
  const curriculum_compare = curriculum_compare_details.value;
});

const primary_Type = ref([]);
const compare_Type = ref([]);

const submitStatus = ref(false);
const submitChanges = () => {
  console.log("loding..");
  updateSchema();
  // getSimilality();
  getRatio();

  submitStatus.value = false;
  // setTimeout(() => {
  //   submitStatus.value = true;
  // }, 1000);
};

const schema = {
  boundary: [
    {
      boundary_name: "red",
      lower_boundary: 0,
      upper_boundary: 0,
      weight: 0,
    },
    {
      boundary_name: "orange",
      lower_boundary: 0,
      upper_boundary: 0,
      weight: 0,
    },
    {
      boundary_name: "yellow",
      lower_boundary: 0,
      upper_boundary: 0,
      weight: 0,
    },
    {
      boundary_name: "light green",
      lower_boundary: 0,
      upper_boundary: 0,
      weight: 0,
    },
    {
      boundary_name: "green",
      lower_boundary: 0,
      upper_boundary: 0,
      weight: 0,
    },
  ],
  compare_curriculum_pk: 0,
  primary_curriculum_pk: 0,
};

const updateSchema = () => {
  schema.boundary = schema.boundary = [
    {
      boundary_name: "red",
      lower_boundary: Number(form_bar.value.Red.range[0]) / 100,
      upper_boundary: Number(form_bar.value.Red.range[1]) / 100,
      weight: Number(form_bar.value.Red.weight) / 10,
    },
    {
      boundary_name: "orange",
      lower_boundary: Number(form_bar.value.Orange.range[0]) / 100,
      upper_boundary: Number(form_bar.value.Orange.range[1]) / 100,
      weight: Number(form_bar.value.Orange.weight) / 10,
    },
    {
      boundary_name: "yellow",
      lower_boundary: Number(form_bar.value.Yellow.range[0]) / 100,
      upper_boundary: Number(form_bar.value.Yellow.range[1]) / 100,
      weight: Number(form_bar.value.Yellow.weight) / 10,
    },
    {
      boundary_name: "light green",
      lower_boundary: Number(form_bar.value.LightGreen.range[0]) / 100,
      upper_boundary: Number(form_bar.value.LightGreen.range[1]) / 100,
      weight: Number(form_bar.value.LightGreen.weight) / 10,
    },
    {
      boundary_name: "green",
      lower_boundary: Number(form_bar.value.Green.range[0]) / 100,
      upper_boundary: Number(form_bar.value.Green.range[1]) / 100,
      weight: Number(form_bar.value.Green.weight) / 10,
    },
  ];
  schema.compare_curriculum_pk = curriculum_compare_details.value?.pk;
  schema.primary_curriculum_pk = curriculum_primary_details.value?.pk;
};

const ratio = ref({ green: 0, "light green": 0, yellow: 0, orange: 0, red: 0 });
const getRatio = () => {
  try {
    $fetch(`http://127.0.0.1:8000/similarities/ratio-of-labeling`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(schema),
      onResponse: ({ response }) => {
        if (!response.ok) {
          console.error("Error fetching data:", response);
          return;
        }
        
        console.log(response._data);
        ratio.value.green = Number(response._data.green.replace("%", "")) / 100;
        ratio.value["light green"] =
          Number(response._data["light green"].replace("%", "")) / 100;
        ratio.value.yellow =
          Number(response._data.yellow.replace("%", "")) / 100;
        ratio.value.orange =
          Number(response._data.orange.replace("%", "")) / 100;
        ratio.value.red = Number(response._data.red.replace("%", "")) / 100;

        getSimilality();
      },
    });
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

const similalityData = ref("");
const getSimilality = () => {
  try {
    $fetch(
      `http://localhost:8000/similarities/sum-of-ratio-multiplied-by-weight`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(schema),
        onResponse: ({ response }) => {
          if (!response.ok) {
            console.error("Error fetching data:", response);
            return;
          }
          similalityData.value =
            response._data.sum_of_ratio_multiplied_by_weight;
          submitStatus.value = true;

          console.log(propsData.value);
        },
      }
    );
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

const propsData = computed(() => {
  return {
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
      primary_curriculums_subject_type: primary_Type.value.map(
        (itme) => itme.name
      ),
      compare_curriculums_subject_type: compare_Type.value.map(
        (itme) => itme.name
      ),
      //
    },
    bodyData: {
      boundary: [
        {
          boundary_name: "red",
          lower_boundary: Number(form_bar.value.Red.range[0]) / 100,
          upper_boundary: Number(form_bar.value.Red.range[1]) / 100,
          weight: Number(form_bar.value.Red.weight) / 10,
        },
        {
          boundary_name: "orange",
          lower_boundary: Number(form_bar.value.Orange.range[0]) / 100,
          upper_boundary: Number(form_bar.value.Orange.range[1]) / 100,
          weight: Number(form_bar.value.Orange.weight) / 10,
        },
        {
          boundary_name: "yellow",
          lower_boundary: Number(form_bar.value.Yellow.range[0]) / 100,
          upper_boundary: Number(form_bar.value.Yellow.range[1]) / 100,
          weight: Number(form_bar.value.Yellow.weight) / 10,
        },
        {
          boundary_name: "light green",
          lower_boundary: Number(form_bar.value.LightGreen.range[0]) / 100,
          upper_boundary: Number(form_bar.value.LightGreen.range[1]) / 100,
          weight: Number(form_bar.value.LightGreen.weight) / 10,
        },
        {
          boundary_name: "green",
          lower_boundary: Number(form_bar.value.Green.range[0]) / 100,
          upper_boundary: Number(form_bar.value.Green.range[1]) / 100,
          weight: Number(form_bar.value.Green.weight) / 10,
        },
      ],
      // ยังไม่มีข้อมูลให้ส่งไป
      compare_curriculum_pk: curriculum_compare_details.value?.pk,
      primary_curriculum_pk: curriculum_primary_details.value?.pk,
      //
    },
    simirarityData: {
      cruriculumsSim: similalityData.value,
      groupSim: [
        {
          green: ratio.value.green,
          light_green: ratio.value["light green"],
          yellow: ratio.value.yellow,
          orange: ratio.value.orange,
          red: ratio.value.red,
        },
      ],
    },
  };
});


</script>
<template>
  <div class="">
    <div class="grid grid-rows-10 grid-cols-6 gap-2 m-3 h-svh">
      <div
        class="col-start-1 col-span-2 row-start-1 bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800 ring-1 ring-gray-200 dark:ring-gray-800 rounded-lg shadow"
      >
        <div class="">
          <div class="p-3 text-center">
            <h2 class="text-xl">เลือกหลักสูตรที่ 1</h2>
            <USelectMenu v-if="curriculum_primary" v-model="curriculum_primary_details" :options="curriculum_primary"
              class="w-100 md:max-lg:w-60 sm:max-md:w-20 mt-1" option-attribute="name"
              placeholder="Select a curriculum..." searchable />
          </div>
        </div>
      </div>
      <div
        class="col-start-3 col-span-2 row-start-1 bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800 ring-1 ring-gray-200 dark:ring-gray-800 rounded-lg shadow">
        <div class="">
          <div class="p-3 text-center">
            <h2 class="text-xl ">เลือกหลักสูตรที่ 2</h2>
            <USelectMenu v-if="curriculum_compare" v-model="curriculum_compare_details" :options="curriculum_compare"
              class="w-100 md:max-lg:w-60 sm:max-md:w-20 mt-1" option-attribute="name"
              placeholder="Select a curriculum..." searchable />
          </div>
        </div>
      </div>
      <div
        class="col-start-5 col-span-3 row-start-1 bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800 ring-1 ring-gray-200 dark:ring-gray-800 rounded-lg shadow">
        <div>
          <div class="p-3 text-center">
            <h2 class="text-xl">เซ็ตกลุ่มของสี</h2>
            <USelectMenu :options="set_color" placeholder="Select a preset..." class="mt-1" v-model="SelectPreset" />
          </div>
        </div>
      </div>


      <div
        class="col-start-1 col-span-1 row-start-2 p-3 text-center bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800 'ring-1 ring-gray-200 dark:ring-gray-800 rounded-lg shadow border-none">
        <h2 class="text-x">ประเภทรายวิชาของหลักสูตรที่ 1</h2>
        <USelectMenu v-if="subject_type_primary" class="mt-1 border-none" v-model="primary_Type"
          :options="subject_type_primary" multiple placeholder="Select type.." option-attribute="name" />
      </div>
      <div
        class="col-start-2 col-span-1 row-start-2 p-3 text-center bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800 ring-1 ring-gray-200 dark:ring-gray-800 rounded-lg shadow border-none">
        <h2 class="text-x">ประเภทรายวิชาของหลักสูตรที่ 2</h2>
        <USelectMenu v-if="subject_type_compare" class="mt-1 border-none" v-model="compare_Type"
          :options="subject_type_compare" multiple placeholder="Select type.." option-attribute="name" />
      </div>

      <div
        class="row-span-4 col-start-3 col-span-4 row-start-2 overflow-scroll bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800 ring-1 ring-gray-200 dark:ring-gray-800 rounded-lg shadow flex items-center justify-center">
        <div v-if="submitStatus">
          <dataTable :data="propsData" />
        </div>
        <div v-else class="">
          <div class="">
            <div class="container">
              <div class="slice"></div>
              <div class="slice"></div>
              <div class="slice"></div>
              <div class="slice"></div>
              <div class="slice"></div>
              <div class="slice"></div>
            </div>
          </div>
        </div>
      </div>

      <div
        class="relative row-span-4 col-start-3 col-span-4 row-start-6 overflow-scroll bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800 ring-1 ring-gray-200 dark:ring-gray-800 rounded-lg shadow flex items-center justify-center">
        <div v-if="submitStatus">
          <nodegraph :curriculumsInfo="propsData.curriculumsInfo" :bodyData="propsData.bodyData"
            :simirarityData="propsData.simirarityData" />
        </div>
        <div v-else>
          <div class="col-span-4 flex justify-center">
            <div class="container">
              <div class="slice"></div>
              <div class="slice"></div>
              <div class="slice"></div>
              <div class="slice"></div>
              <div class="slice"></div>
              <div class="slice"></div>
            </div>
          </div>
        </div>
      </div>

      <div
        class="row-start-3 col-start-1 row-span-3 col-end-3 bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800 ring-1 ring-gray-200 dark:ring-gray-800 rounded-lg shadow overflow-y-auto border-none">
        <h1 class="text-center px-2 text-xl">
          กำหนดขอบเขตล่าง - ขอบเขตบน
        </h1>
        <div class="text-xs flex flex-nowrap text-center justify-center border-none">
          <div class=" mx-3 flex place-items-center" style="padding-right: 3rem">
            <h2>Green level</h2>
          </div>
          <div class=" mx-3 flex place-items-center">
            <h2>0</h2>
          </div>
          <div class="mx-3">
            <VueSimpleRangeSlider style="width: 15vw" :min="0" :max="100" v-model="form_bar.Green.range"
              bar-color="#bbf7d0" active-bar-color="#16a34a">
              <template #suffix="{ value }"> %</template>
            </VueSimpleRangeSlider>
          </div>
          <div class=" mx-3 flex place-items-center">
            <h2>100</h2>
          </div>
        </div>
        <div class="text-xs flex flex-nowrap justify-center text-center border-none">
          <div class="mx-3 flex place-items-center" style="padding-right: 0.75rem">
            <h2>Light green level</h2>
          </div>
          <div class="mx-3 flex place-items-center">
            <h2>0</h2>
          </div>
          <div class="mx-3">
            <VueSimpleRangeSlider style="width: 15vw" :min="0" :max="100" v-model="form_bar.LightGreen.range"
              bar-color="#d9f99d" active-bar-color="#a3e635" :disable="Number(form_bar.Green.range[1]) > 0">
              <template #suffix="{ value }"> %</template>
            </VueSimpleRangeSlider>
          </div>
          <div class="mx-3 flex place-items-center">
            <h2>100</h2>
          </div>
        </div>
        <div class="text-xs flex flex-nowrap justify-center text-center border-none">
          <div class="mx-3 flex place-items-center" style="padding-right: 3rem">
            <h2>Yellow level</h2>
          </div>
          <div class="mx-3 flex place-items-center">
            <h2>0</h2>
          </div>
          <div class="mx-3">
            <VueSimpleRangeSlider style="width: 15vw" :min="0" :max="100" v-model="form_bar.Yellow.range"
              bar-color="#fef08a" active-bar-color="#facc15">
              <template #suffix="{ value }"> %</template>
            </VueSimpleRangeSlider>
          </div>
          <div class="mx-3 flex place-items-center">
            <h2>100</h2>
          </div>
        </div>
        <div class="text-xs flex flex-nowrap justify-center text-center border-none">
          <div class="mx-3 flex place-items-center" style="padding-right: 2.5rem">
            <h2>Orange level</h2>
          </div>
          <div class="mx-3 flex place-items-center">
            <h2>0</h2>
          </div>
          <div class="mx-3">
            <VueSimpleRangeSlider style="width: 15vw" :min="0" :max="100" v-model="form_bar.Orange.range"
              bar-color="#fed7aa" active-bar-color="#fb923c">
              <template #suffix="{ value }"> %</template>
            </VueSimpleRangeSlider>
          </div>
          <div class="mx-3 flex place-items-center">
            <h2>100</h2>
          </div>
        </div>
        <div class="text-xs flex flex-nowrap justify-center text-center border-none">
          <div class="mx-3 flex place-items-center" style="padding-right: 4rem">
            <h2>Red level</h2>
          </div>
          <div class="mx-3 flex place-items-center">
            <h2>0</h2>
          </div>
          <div class="mx-3">
            <VueSimpleRangeSlider style="width: 15vw" :min="0" :max="100" v-model="form_bar.Red.range" bar-color="#fecaca"
              active-bar-color="#f87171">
              <template #suffix="{ value }"> %</template>
            </VueSimpleRangeSlider>
          </div>
          <div class="mx-3 flex place-items-center">
            <h2>100</h2>
          </div>
        </div>
      </div>

      <div
        class="row-start-6 col-start-1 row-span-3 col-end-3 bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800 ring-1 ring-gray-200 dark:ring-gray-800 rounded-lg shadow overflow-y-auto border-none">
        <div>
          <div class="flex flex-nowrap justify-center gap-5 text-center">
            <h1 class="border-solid py-3 px-2 text-xl">
              กำหนดค่าน้ำหนัก
            </h1>
            <div class="border-solid py-3 px-2 text-xl">
              <h1>น้ำหนักรวม<sup style="color:red;">*</sup></h1>
              {{
                Number(form_bar.Green.weight) +
                Number(form_bar.LightGreen.weight) +
                Number(form_bar.Yellow.weight) +
                Number(form_bar.Orange.weight) +
                Number(form_bar.Red.weight)
              }}
              / 10
            </div>
          </div>
          <div class="text-xs flex flex-nowrap text-center justify-center">
            <div class="mx-3 flex place-items-center" style="padding-right: 3rem">
              <h2>Green level</h2>
            </div>
            <div class="mx-3 flex place-items-center">
              <h2>0</h2>
            </div>
            <div class="mx-3">
              <VueSimpleRangeSlider style="width: 15vw" :min="0" :max="10" v-model="form_bar.Green.weight"
                bar-color="#bbf7d0" active-bar-color="#16a34a">
                <template #suffix="{ value }"> </template>
              </VueSimpleRangeSlider>
            </div>
            <div class="mx-3 flex place-items-center">
              <h2>10</h2>
            </div>
          </div>
          <div class="text-xs flex flex-nowrap justify-center text-center">
            <div class="mx-3 flex place-items-center" style="padding-right: 0.75rem">
              <h2>Light green level</h2>
            </div>
            <div class="mx-3 flex place-items-center">
              <h2>0</h2>
            </div>
            <div class="mx-3">
              <VueSimpleRangeSlider style="width: 15vw" :min="0" :max="10" v-model="form_bar.LightGreen.weight"
                bar-color="#d9f99d" active-bar-color="#a3e635" :disable="Number(form_bar.Green.weight) > 0">
                <template #suffix="{ value }"> </template>
              </VueSimpleRangeSlider>
            </div>
            <div class="mx-3 flex place-items-center">
              <h2>10</h2>
            </div>
          </div>
          <div class="text-xs flex flex-nowrap justify-center text-center">
            <div class="mx-3 flex place-items-center" style="padding-right: 3rem">
              <h2>Yellow level</h2>
            </div>
            <div class="mx-3 flex place-items-center">
              <h2>0</h2>
            </div>
            <div class="mx-3">
              <VueSimpleRangeSlider style="width: 15vw" :min="0" :max="10" v-model="form_bar.Yellow.weight"
                bar-color="#fef08a" active-bar-color="#facc15">
                <template #suffix="{ value }"> </template>
              </VueSimpleRangeSlider>
            </div>
            <div class="mx-3 flex place-items-center">
              <h2>10</h2>
            </div>
          </div>
          <div class="text-xs flex flex-nowrap justify-center text-center">
            <div class="mx-3 flex place-items-center" style="padding-right: 2.5rem">
              <h2>Orange level</h2>
            </div>
            <div class="mx-3 flex place-items-center">
              <h2>0</h2>
            </div>
            <div class="mx-3">
              <VueSimpleRangeSlider style="width: 15vw" :min="0" :max="10" v-model="form_bar.Orange.weight"
                bar-color="#fed7aa" active-bar-color="#fb923c">
                <template #suffix="{ value }"> </template>
              </VueSimpleRangeSlider>
            </div>
            <div class="mx-3 flex place-items-center">
              <h2>10</h2>
            </div>
          </div>
          <div class="text-xs flex flex-nowrap justify-center text-center">
            <div class="mx-3 flex place-items-center" style="padding-right: 4rem">
              <h2>Red level</h2>
            </div>
            <div class="mx-3 flex place-items-center">
              <h2>0</h2>
            </div>
            <div class="mx-3">
              <VueSimpleRangeSlider style="width: 15vw" :min="0" :max="10" v-model="form_bar.Red.weight"
                bar-color="#fecaca" active-bar-color="#f87171">
                <template #suffix="{ value }"> </template>
              </VueSimpleRangeSlider>
            </div>
            <div class="mx-3 flex place-items-center">
              <h2>10</h2>
            </div>
          </div>
        </div>
      </div>


      <div
        class="row-start-9 col-span-2 row-span-1 p-5 bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800 ring-1 ring-gray-200 dark:ring-gray-800 rounded-lg shadow">
        <div class="flex justify-center">
          <UButton @click="submitChanges" block class="button_sumit">Submit</UButton>
        </div>
      </div>

    </div>
    <UCard>
      <div v-if="submitStatus">
        <dataTable :data="propsData" />
      </div>
    </UCard>
  </div>
</template>
<style scoped>
/* CSS */
div div {
  text-align: center;
}

.my_div {
  height: 200px;
  width: 200px;
}

.grid {
  display: grid;
}

.place-content-center {
  place-content: center;
}

.button_sumit {
  appearance: button;
  background-color: #1899d6;
  border: solid transparent;
  border-radius: 16px;
  border-width: 0 0 4px;
  box-sizing: border-box;
  color: #ffffff;
  cursor: pointer;
  display: inline-block;
  font-size: 20px;
  letter-spacing: 0.8px;
  line-height: 20px;
  margin: 0;
  outline: none;
  overflow: visible;
  padding: 13px 16px;
  text-align: center;
  touch-action: manipulation;
  transform: translateZ(0);
  transition: filter 0.2s;
  user-select: none;
  -webkit-user-select: none;
  vertical-align: middle;
  white-space: nowrap;
  width: 100%;
}

.button_sumit:after {
  background-clip: padding-box;
  background-color: #1cb0f6;
  border: solid transparent;
  border-radius: 16px;
  border-width: 0 0 4px;
  bottom: -4px;
  content: "";
  left: 0;
  position: absolute;
  right: 0;
  top: 0;
  z-index: -1;
}

.button_sumit:main,
.button_sumit:focus {
  user-select: auto;
}

.button_sumit:hover:not(:disabled) {
  filter: brightness(1.1);
  -webkit-filter: brightness(1.1);
}

.button_sumit:disabled {
  cursor: auto;
}

.button_sumit:active {
  border-width: 4px 0 0;
  background: none;
}

.container {
  --uib-size: 45px;
  --uib-color: rgb(29, 94, 190);
  --uib-speed: 2.5s;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: var(--uib-size);
  width: var(--uib-size);
}

.slice {
  position: relative;
  height: calc(var(--uib-size) / 6);
  width: 100%;
}

.slice::before,
.slice::after {
  --uib-a: calc(var(--uib-speed) / -2);
  --uib-b: calc(var(--uib-speed) / -6);
  content: '';
  position: absolute;
  top: 0;
  left: calc(50% - var(--uib-size) / 12);
  height: 100%;
  width: calc(100% / 6);
  border-radius: 50%;
  background-color: var(--uib-color);
  flex-shrink: 0;
  animation: orbit var(--uib-speed) linear infinite;
  transition: background-color 0.3s ease;
}

.slice:nth-child(1)::after {
  animation-delay: var(--uib-a);
}

.slice:nth-child(2)::before {
  animation-delay: var(--uib-b);
}

.slice:nth-child(2)::after {
  animation-delay: calc(var(--uib-a) + var(--uib-b));
}

.slice:nth-child(3)::before {
  animation-delay: calc(var(--uib-b) * 2);
}

.slice:nth-child(3)::after {
  animation-delay: calc(var(--uib-a) + var(--uib-b) * 2);
}

.slice:nth-child(4)::before {
  animation-delay: calc(var(--uib-b) * 3);
}

.slice:nth-child(4)::after {
  animation-delay: calc(var(--uib-a) + var(--uib-b) * 3);
}

.slice:nth-child(5)::before {
  animation-delay: calc(var(--uib-b) * 4);
}

.slice:nth-child(5)::after {
  animation-delay: calc(var(--uib-a) + var(--uib-b) * 4);
}

.slice:nth-child(6)::before {
  animation-delay: calc(var(--uib-b) * 5);
}

.slice:nth-child(6)::after {
  animation-delay: calc(var(--uib-a) + var(--uib-b) * 5);
}

@keyframes orbit {
  0% {
    transform: translateX(calc(var(--uib-size) * 0.25)) scale(0.73684);
    opacity: 0.65;
  }

  5% {
    transform: translateX(calc(var(--uib-size) * 0.235)) scale(0.684208);
    opacity: 0.58;
  }

  10% {
    transform: translateX(calc(var(--uib-size) * 0.182)) scale(0.631576);
    opacity: 0.51;
  }

  15% {
    transform: translateX(calc(var(--uib-size) * 0.129)) scale(0.578944);
    opacity: 0.44;
  }

  20% {
    transform: translateX(calc(var(--uib-size) * 0.076)) scale(0.526312);
    opacity: 0.37;
  }

  25% {
    transform: translateX(0%) scale(0.47368);
    opacity: 0.3;
  }

  30% {
    transform: translateX(calc(var(--uib-size) * -0.076)) scale(0.526312);
    opacity: 0.37;
  }

  35% {
    transform: translateX(calc(var(--uib-size) * -0.129)) scale(0.578944);
    opacity: 0.44;
  }

  40% {
    transform: translateX(calc(var(--uib-size) * -0.182)) scale(0.631576);
    opacity: 0.51;
  }

  45% {
    transform: translateX(calc(var(--uib-size) * -0.235)) scale(0.684208);
    opacity: 0.58;
  }

  50% {
    transform: translateX(calc(var(--uib-size) * -0.25)) scale(0.73684);
    opacity: 0.65;
  }

  55% {
    transform: translateX(calc(var(--uib-size) * -0.235)) scale(0.789472);
    opacity: 0.72;
  }

  60% {
    transform: translateX(calc(var(--uib-size) * -0.182)) scale(0.842104);
    opacity: 0.79;
  }

  65% {
    transform: translateX(calc(var(--uib-size) * -0.129)) scale(0.894736);
    opacity: 0.86;
  }

  70% {
    transform: translateX(calc(var(--uib-size) * -0.076)) scale(0.947368);
    opacity: 0.93;
  }

  75% {
    transform: translateX(0%) scale(1);
    opacity: 1;
  }

  80% {
    transform: translateX(calc(var(--uib-size) * 0.076)) scale(0.947368);
    opacity: 0.93;
  }

  85% {
    transform: translateX(calc(var(--uib-size) * 0.129)) scale(0.894736);
    opacity: 0.86;
  }

  90% {
    transform: translateX(calc(var(--uib-size) * 0.182)) scale(0.842104);
    opacity: 0.79;
  }

  95% {
    transform: translateX(calc(var(--uib-size) * 0.235)) scale(0.789472);
    opacity: 0.72;
  }

  100% {
    transform: translateX(calc(var(--uib-size) * 0.25)) scale(0.73684);
    opacity: 0.65;
  }
}
</style>
