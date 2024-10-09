<script lang="ts" setup>
import { ref, onMounted } from "vue";
// import dataGraph from "./dataGraph.vue";

const props = defineProps({
  data: Object,
});


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

const getSubject = async (
  props: any,
  header: any,
  columns: any,
  index: any,
  row: any
) => {
  try {
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
            props.data.curriculumsInfo.primary_curriculums_subject_type.includes(
              i.subject1_type
            ) &&
            props.data.curriculumsInfo.compare_curriculums_subject_type.includes(
              i.subject2_type
            )
          );
        });

        header.value = [
          ...new Set(subject.value.map((i: Similarity) => i.subject1_name)),
        ];

        columns.value = [
          { key: "0", label: "" },
          ...header.value.map((i: string, ind: number) => {
            return { key: `${ind + 1}`, label: i };
          }),
        ];

        index.value = [
          ...new Set(subject.value.map((i: Similarity) => i.subject2_name)),
        ];

        row.value = index.value.map((i: string) => {
          return [
            { value: i },
            ...header.value.map((j: string, ind: number) => {
              const similarity = subject.value.find(
                (k: Similarity) =>
                  k.subject1_name === j && k.subject2_name === i
              )?.similarity;
              return {
                value: similarity,
                colorBG: getBackgroundColor(similarity, props),
              };
            }),
          ];
        });
      },
    });
    pending.value = false;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

const ratio = props.data?.simirarityData.groupSim[0];
const similalityData = props.data?.simirarityData.cruriculumsSim;


onMounted(() => {
  pending.value = true;
  getSubject(props, header, columns, index, row);
  
});
</script>

<template>
  <div v-if="pending">
    <div class="container">
      <div class="slice"></div>
      <div class="slice"></div>
      <div class="slice"></div>
      <div class="slice"></div>
      <div class="slice"></div>
      <div class="slice"></div>
    </div>
  </div>
  <div v-else style="    width: auto;
    height: 22rem;
    margin-left: 10rem;">
    <div>
      <h1 style="font-size: 30px; font-weight: bold">DATA TABLE</h1>
      <div style="
        display: flex;
        justify-items: center;
        justify-content: center;
        gap: 1rem;
        margin: 2rem;
      ">
        <div class="bg-green-200">
          <div class="my_div grid place-content-center">
            <div>Green</div>
            <div>{{ (parseFloat(ratio.green) * 100).toFixed(2) ?? "-" }}%</div>
          </div>
        </div>
        <div class="bg-lime-200 my_div">
          <div class="my_div grid place-content-center">
            <h2>LightGreen</h2>
            <div>
              {{ (parseFloat(ratio.light_green) * 100).toFixed(2) ?? "-" }}%
            </div>
          </div>
        </div>
        <div class="bg-yellow-200 my_div">
          <div class="my_div grid place-content-center">
            <h2>Yellow</h2>
            <div>{{ (parseFloat(ratio.yellow) * 100).toFixed(2) ?? "-" }}%</div>
          </div>
        </div>
        <div class="bg-orange-200 my_div">
          <div class="my_div grid place-content-center">
            <h2>Orange</h2>
            <div>{{ (parseFloat(ratio.orange) * 100).toFixed(2) ?? "-" }}%</div>
          </div>
        </div>
        <div class="bg-red-200 my_div">
          <div class="my_div grid place-content-center">
            <h2>Red</h2>
            <div>{{ (parseFloat(ratio.red) * 100).toFixed(2) ?? "-" }}%</div>
          </div>
        </div>
        <div class="bg-[#f0f0f0] my_div shadow">
          <div class="my_div grid place-content-center">
            <h2>Similarity</h2>
            <div>{{ (parseFloat(similalityData) * 100).toFixed(2) }}%</div>
          </div>
        </div>
      </div>

      <div class="ml-20">
        <div class="table-container">
          <div style="text-align: center; font-size: 20px; font-weight: bold; ">
            {{ props.data?.curriculumsInfo.primary.curriculum_name }}
          </div>
          <div class="vertical-text">
            <div>
              {{ props.data?.curriculumsInfo.compare.curriculum_name }}
            </div>

          </div>
          <div class="scrollable-table">

            <table style="margin-left: 1rem;" class="table">
              <thead>
                <tr>
                  <th v-for="col in columns" :key="col.key">{{ col.label }}</th>
                </tr>
              </thead>

              <tbody>
                <tr v-for="r in row" :key="r[0]">
                  <th>{{ r[0].value }}</th>
                  <td v-for="(c, ind) in r.slice(1)" :key="ind" :class="c.colorBG">
                    {{ c.value }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
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

.vertical-text {
  writing-mode: vertical-rl;
  transform: rotate(180deg);
  text-align: center;
  font-size: 1rem;
  font-weight: bold;
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  background-color: #ffffff;
  /* Add a background color to match the table header */
  z-index: 4;
  height: 100%;
  /* Ensure it stays above other elements */
}

.middle-top-text {
  text-align: center;
  font-size: 20px;
  font-weight: bold;
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
}

.table-container {
  position: relative;

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


th,
td {
  border: 1px solid #000000;
  padding: 8px;
  text-align: left;
}

thead th {
  position: sticky;
  top: 0;
  background-color: #ffffff;
  z-index: 2;
  /* Ensure the sticky header is above other elements */
}

tbody th {
  position: sticky;
  left: 0;
  background-color: #ffffff;
  z-index: 1;
  /* Ensure the sticky column header is above other elements */
}

.scrollable-table {
  height: 25vh;
  width: 63vw;
  overflow-y: scroll;
  overflow-x: scroll;
  /* scroll-snap-type: y; */
  position: relative;
  /* Add relative positioning to the scrollable table container */
  padding-left: 1rem;
  /* Add padding to account for the vertical-text width */
}
</style>