<template>
  <UContainer class="my-4">
    <UCard>
      <UBreadcrumb :links="links" />
      <h1 class="text-2xl font-semibold text-center">Graph</h1>
      <div id="container"></div>
    </UCard>
  </UContainer>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import Highcharts from "highcharts";
import networkgraph from "highcharts/modules/networkgraph";

networkgraph(Highcharts);

const links = [
  {
    label: "หน้าหลัก",
    to: "/",
  },
  {
    label: "sim",
    to: "/sim",
  },
  {
    label: "graph",
    to: "/graph",
  },
];

const curiculums = [["A", "B"]];

onMounted(() => {
  Highcharts.chart("container", {
    chart: {
      type: "networkgraph",
      events: {
        load: function () {
          const chart = this,
            links = chart.series[0].points;

          links.forEach((link) => {
            const graphic = link.graphic,
              originalStroke = graphic.attr("stroke");

            graphic.on("click", () => {
              console.log(
                chart.series[0].update({
                  data: [
                    ["A", `${link.options.to}1`],
                    ["A", `${link.options.to}2`],
                    ["A", "B"],
                  ],
                })
              );
            });

            graphic.on("mouseover", () => {
              graphic.attr({
                stroke: "rgb(0, 255, 0, 0.5)",
              });
            });

            graphic.on("mouseout", () => {
              graphic.attr({
                stroke: originalStroke,
              });
            });
          });
        },
      },
    },

    series: [
      {
        data: curiculums,
        marker: {
          radius: 10,
        },
        link: {
          width: 5,
        },
      },
    ],
  });
});
</script>
