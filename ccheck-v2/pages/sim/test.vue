<script setup>
import VueSimpleRangeSlider from "vue-simple-range-slider";
import "vue-simple-range-slider/css";
import dataTable from "~/components/dataTable.vue";

const state = reactive({ range: [0, 100], number: 10 });
watchEffect(() => {
    console.log(state.range);
    console.log(state.number);
});
</script>
<template>
    <dataTable />
    <!-- <div>
        <VueSimpleRangeSlider style="width: 300px" :min="0.0" :max="100" exponential v-model="state.range">
            <template #suffix="{ value }"> %</template>
        </VueSimpleRangeSlider>

        <VueSimpleRangeSlider style="width: 300px" :min="0.0" :max="100" v-model="state.number" />

    </div> -->
</template>
