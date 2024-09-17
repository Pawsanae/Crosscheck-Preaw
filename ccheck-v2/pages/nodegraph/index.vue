<template>
  <div id="sigma-container" style="width: 100%; height: 600px;"></div>
</template>

<script setup>
import { onMounted } from 'vue';
import chroma from 'chroma-js';
import Graph from 'graphology';
import ForceSupervisor from 'graphology-layout-force/worker';
import Sigma from 'sigma';
import { v4 as uuid } from 'uuid';

// Function to initialize Sigma and graph
const initializeGraph = () => {
  // Retrieve the HTML element for the Sigma container
  const container = document.getElementById('sigma-container');

  if (!container) {
    console.error('Container not found');
    return;
  }

  const data = {
        curriculumsInfo: {
            primary: {
                curriculum_pk: 1,
                curriculum_code: 25490191106441,
                curriculum_name: "หลักสูตรบัญชีบัณฑิต",
                curriculum_year: 2564,
            },
            compare: {
                curriculum_pk: 2,
                curriculum_code: 25490191106406,
                curriculum_name: "หลักสูตรบริหารธุรกิจบัณฑิต",
                curriculum_year: 2564,
            },
            primary_curriculums_subject_type: ["กลาง", "เลือก", "เลือกเสรี"],
            compare_curriculums_subject_type: ["กลาง", "เลือก", "เลือกเสรี"],
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
                    upper_boundary: 0.1,
                    weight: 0,
                },
            ],
            compare_curriculum_pk: 2,
            primary_curriculum_pk: 1,
        },
        simirarityData: {
            cruriculumsSim: 0.4,
            groupSim: [
                {
                    green: 95.407 / 100,
                    lightgreen: 3.39 / 100,
                    yellow: 0.926 / 100,
                    orange: 0.148 / 100,
                    red: 0.13 / 100,
                },
            ],
        },
    };
  // Create a sample graph
  const graph = new Graph();
  graph.addNode('primary', { label:data.curriculumsInfo.primary.curriculum_name, x: 0, y: 0, size: 20, color: chroma.random().hex() });
  graph.addNode('compare', {label:data.curriculumsInfo.compare.curriculum_name, x: -5, y: 5, size: 20, color: chroma.random().hex() });
  graph.addNode('n3', { x: 5, y: 5, size: 20, color: chroma.random().hex() });
  graph.addNode('n4', { x: 0, y: 10, size: 20, color: chroma.random().hex() });
  graph.addEdge('primary', 'compare',{ type: "line", label:data.simirarityData.cruriculumsSim , size: data.simirarityData.cruriculumsSim * 10,color: '#000000'});
  graph.addEdge('compare', 'n4');
  graph.addEdge('n4', 'n3');
  graph.addEdge('n3', 'primary');

  // Create the spring layout and start it
  const layout = new ForceSupervisor(graph, { isNodeFixed: (_, attr) => attr.highlighted });
  layout.start();

  // Create the Sigma renderer
  const renderer = new Sigma(graph, container,{renderEdgeLabels: true,});

  //
  // Drag'n'drop feature
  //

  let draggedNode = null;
  let isDragging = false;

  renderer.on('downNode', (e) => {
    isDragging = true;
    draggedNode = e.node;
    graph.setNodeAttribute(draggedNode, 'highlighted', true);
  });

  renderer.getMouseCaptor().on('mousemovebody', (e) => {
    if (!isDragging || !draggedNode) return;

    const pos = renderer.viewportToGraph(e);
    graph.setNodeAttribute(draggedNode, 'x', pos.x);
    graph.setNodeAttribute(draggedNode, 'y', pos.y);

    e.preventSigmaDefault();
    e.original.preventDefault();
    e.original.stopPropagation();
  });

  renderer.getMouseCaptor().on('mouseup', () => {
    if (draggedNode) {
      graph.removeNodeAttribute(draggedNode, 'highlighted');
    }
    isDragging = false;
    draggedNode = null;
  });

  renderer.getMouseCaptor().on('mousedown', () => {
    if (!renderer.getCustomBBox()) renderer.setCustomBBox(renderer.getBBox());
  });

  //
  // Create node (and edge) by click
  //

  // renderer.on('clickStage', ({ event }) => {
  //   const coordForGraph = renderer.viewportToGraph({ x: event.x, y: event.y });
  //   const node = {
  //     ...coordForGraph,
  //     size: 10,
  //     color: chroma.random().hex(),
  //   };

  //   const closestNodes = graph
  //     .nodes()
  //     .map((nodeId) => {
  //       const attrs = graph.getNodeAttributes(nodeId);
  //       const distance = Math.pow(node.x - attrs.x, 2) + Math.pow(node.y - attrs.y, 2);
  //       return { nodeId, distance };
  //     })
  //     .sort((a, b) => a.distance - b.distance)
  //     .slice(0, 2);

  //   const id = uuid();
  //   graph.addNode(id, node);

  //   closestNodes.forEach((e) => graph.addEdge(id, e.nodeId));
  // });

  // Clean up on component unmount
  onUnmounted(() => {
    renderer.kill();
  });
};

// Initialize the graph when the component is mounted
onMounted(() => {
  initializeGraph();
});
</script>

<style scoped>
/* Optional styling */
</style>
