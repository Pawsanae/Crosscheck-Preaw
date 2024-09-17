<script setup lang="ts">
    import * as d3 from "d3";

    const runtimeConfig = useRuntimeConfig();
    const toast = useToast();

    const data = defineProps({
        curriculumsInfo: Object,
        bodyData: Object,
        simirarityData: Object,
    });

    const nodes: any = ref([]);
    const links: any = ref([]);

    const curriculumsInfo = ref(data.curriculumsInfo);
    const similaritiesLevel1Value = computed(
        () => data.simirarityData?.cruriculumsSim
    );
    const similaritiesLevel2Value = computed(
        () => data.simirarityData?.groupSim
    );
    console.log(Object.keys(similaritiesLevel2Value.value[0]));

    const bodyData = ref(data.bodyData);

    // Chart dimensions
    const width = 800;
    const height = 600;

    const chart = ref(null);
    const isLoading = ref(false);

    const level1Data: any = computed(() => {
        if (!curriculumsInfo.value) return;
        return {
            nodes: [
                {
                    id: curriculumsInfo.value.primary.curriculum_code,
                    name:
                        curriculumsInfo.value.primary.curriculum_name +
                        " (" +
                        curriculumsInfo.value.primary.curriculum_year +
                        ")",
                    level: 1,
                    group: "gray",
                },
                {
                    id: curriculumsInfo.value.compare.curriculum_code,
                    name:
                        curriculumsInfo.value.compare.curriculum_name +
                        " (" +
                        curriculumsInfo.value.compare.curriculum_year +
                        ")",
                    level: 1,
                    group: "blue",
                },
            ],
            links: [
                {
                    source: curriculumsInfo.value.primary.curriculum_code,
                    target: curriculumsInfo.value.compare.curriculum_code,
                    distance: calNodeDistance(similaritiesLevel1Value.value),
                    similaritiesLevel1Value: simToPercentage(
                        similaritiesLevel1Value.value
                    ),
                    color: "#999",
                    clickable: true,
                },
            ],
        };
    });

    const level2Data: any = computed(() => {
        if (!curriculumsInfo.value) return;
        return {
            nodes: [
                ...level1Data.value.nodes,
                ...Object.keys(similaritiesLevel2Value.value[0]).map(
                    (key, index) => {
                        return {
                            id: key + level1Data.value.nodes[0].id,
                            name: key,
                            level: 2,
                            group: key,
                        };
                    }
                ),
                ...Object.keys(similaritiesLevel2Value.value[0]).map(
                    (key, index) => {
                        return {
                            id: key + level1Data.value.nodes[1].id,
                            name: key,
                            level: 2,
                            group: key,
                        };
                    }
                ),

                // example
                // {
                //     id: "1",
                //     name: "1",
                //     level: 2,
                //     group: 3,
                // },
                // {
                //     id: "2",
                //     name: "2",
                //     level: 2,
                //     group: 4,
                // },
            ],
            links: [
                // example
                // {
                //     source: "1",
                //     target: "2",
                //     distance: 100,
                //     similaritiesLevel1Value: "100%",
                // },

                // link from primary to group
                ...Object.keys(similaritiesLevel2Value.value[0]).map(
                    (key, index) => {
                        return {
                            source: level1Data.value.nodes[0].id,
                            target: key + level1Data.value.nodes[0].id,
                            distance: 150,
                            similaritiesLevel1Value: "",
                            color: "#999",
                            clickable: false,
                        };
                    }
                ),
                // link from compare to group
                ...Object.keys(similaritiesLevel2Value.value[0]).map(
                    (key, index) => {
                        return {
                            source: level1Data.value.nodes[1].id,
                            target: key + level1Data.value.nodes[1].id,
                            distance: 150,
                            similaritiesLevel1Value: "",
                            color: "#999",
                            clickable: false,
                        };
                    }
                ),

                // link between group
                ...Object.keys(similaritiesLevel2Value.value[0]).map(
                    (key, index) => {
                        return {
                            source: key + level1Data.value.nodes[0].id,
                            target: key + level1Data.value.nodes[1].id,
                            distance: calNodeDistance(
                                similaritiesLevel2Value.value[0][key]
                            ),
                            similaritiesLevel1Value: simToPercentage(
                                similaritiesLevel2Value.value[0][key]
                            ),
                            color: key,
                            clickable: true,
                        };
                    }
                ),
            ],
        };
    });
    console.log(similaritiesLevel2Value.value);
    console.log(level2Data.value);

    // const similaritiesLevel2Value: any = ref(null);
    // async function getLevel2Data() {
    //     await $fetch(
    //         `${runtimeConfig.public.BASE_API_URL}/similarities/ratio-of-labeling`,
    //         {
    //             method: "POST",
    //             body: bodyData.value,
    //             onResponse: ({ response }) => {
    //                 if (!response.ok) {
    //                     toast.add({
    //                         title: "เกิดข้อผิดพลาด",
    //                         description: response._data.detail,
    //                         color: "red",
    //                     });
    //                     return;
    //                 }
    //             },
    //         }
    //     ).then((response: any) => {
    //         similaritiesLevel2Value.value = response;

    //         nodes.value = [
    //             level1Data.value.nodes,
    //             {
    //                 id: "1",
    //                 name: "1",
    //                 level: 2,
    //                 group: 3,
    //             },
    //             {
    //                 id: "2",
    //                 name: "2",
    //                 level: 2,
    //                 group: 4,
    //             },
    //         ];
    //         links.value = [];

    //         console.log(nodes.value, links.value);
    //     });
    // }

    function simToPercentage(sim: number) {
        return sim * 100 + "%";
    }

    function calNodeDistance(sim: number) {
        // more similar, less distance
        const minDistance = 100;
        const maxDistance = 600;
        const distance = minDistance + (1 - sim) * (maxDistance - minDistance);
        return distance;
    }

    function handleLinkClick(source: any, target: any, level: number) {
        console.log(source, target, level);
        if (level === 1) {
            console.log("level 1 to level 2");
            curentLevel.value = 2;
        } else if (level === 2) {
            console.log("level 2");
        }
    }

    function handleBack() {
        if (curentLevel.value === 2) {
            curentLevel.value = 1;
        }
    }

    const curentLevel = ref(0);
    // watch currenLevel
    watch(curentLevel, (newValue, oldValue) => {
        if (newValue === 1) {
            nodes.value = [...level1Data.value.nodes];
            links.value = [...level1Data.value.links];
            console.log("watch level 1");
            createChart();
        } else if (newValue === 2) {
            nodes.value = [...level2Data.value.nodes];
            links.value = [...level2Data.value.links];
            console.log("watch level 2");
            createChart();
        }
    });

    function createChart() {
        console.log("create chart");

        // Clear any existing SVG content
        d3.select(chart.value).selectAll("*").remove();

        // Specify the color scale.
        const color = d3.scaleOrdinal(d3.schemeCategory10);

        // Create the SVG container
        const svg = d3
            .select(chart.value)
            .append("svg")
            .attr("width", width)
            .attr("height", height);

        // Create a simulation with forces
        const simulation = d3
            .forceSimulation([...nodes.value])
            .force(
                "link",
                d3
                    .forceLink([...links.value])
                    .id((d: any) => d.id)
                    .distance((d: any) => d.distance)
            )
            .force("charge", d3.forceManyBody().strength(-30))
            .force("center", d3.forceCenter(width / 2, height / 2));

        // Create links (lines)
        const link = svg
            .selectAll("line")
            .data([...links.value])
            .enter()
            .append("line")
            .attr("stroke", (d: any) => d.color)
            .attr("opacity", 0.5)
            .attr("stroke-width", 3)
            .on("click", (d: any) => {
                console.log(d.target.__data__);
                handleLinkClick(
                    d.target.__data__.source.id,
                    d.target.__data__.target.id,
                    d.target.__data__.target.level
                );
            })
            .on("mouseover", function () {
                d3.select(this).attr("stroke", "blue");
            })
            .on("mouseout", function () {
                d3.select(this).attr("stroke", (d: any) => d.color);
            });

        // Create nodes (circles)
        const node = svg
            .selectAll("circle")
            .data([...nodes.value])
            .enter()
            .append("circle")
            .attr("r", 10)
            .attr("fill", (d: any) => d.group)
            // random color

            .call(
                d3
                    .drag()
                    .on("start", dragStarted)
                    .on("drag", dragged)
                    .on("end", dragEnded)
            );

        // Add labels to nodes
        const label = svg
            .selectAll("text")
            .data([...nodes.value])
            .enter()
            .append("text")
            .attr("dy", -15) // Position the label above the node
            .attr("text-anchor", "middle")
            .text((d: any) => d.name);

        // Add labels to links
        const linkLabel = svg
            .selectAll(".link-label")
            .data([...links.value])
            .enter()
            .append("text")
            .attr("class", "link-label")
            .attr("text-anchor", "middle")
            .attr("fill", (d: any) => d.color)
            .text((d: any) => d.similaritiesLevel1Value);

        // Update positions on each simulation tick
        simulation.on("tick", () => {
            link.attr("x1", (d: any) => d.source.x)
                .attr("y1", (d: any) => d.source.y)
                .attr("x2", (d: any) => d.target.x)
                .attr("y2", (d: any) => d.target.y);

            node.attr("cx", (d: any) => d.x).attr("cy", (d: any) => d.y);

            label.attr("x", (d: any) => d.x).attr("y", (d: any) => d.y);

            linkLabel
                .attr("x", (d: any) => (d.source.x + d.target.x) / 2)
                .attr("y", (d: any) => (d.source.y + d.target.y) / 2);
        });

        // Drag event handlers
        function dragStarted(event: any, d: any) {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
        }

        function dragged(event: any, d: any) {
            d.fx = event.x;
            d.fy = event.y;
        }

        function dragEnded(event: any, d: any) {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
        }
    }

    onMounted(() => {
        console.log("mounted");
        curentLevel.value = 1;
        createChart();
    });
</script>
<template>
    <UContainer class="my-4">
        <UCard>
            <UButton
                square
                label="Back"
                color="gray"
                variant="solid"
                @click="handleBack()"
            />
            <div ref="chart"></div>
        </UCard>
    </UContainer>
</template>
