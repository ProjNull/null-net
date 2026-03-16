/**
 * This is a minimal example of sigma. You can use it as a base to write new
 * examples, or reproducible test cases for new issues, for instance.
 */
import "./style.css"
import Graph from "graphology";
import Sigma from "sigma";
import ForceSupervisor from "graphology-layout-force/worker";
import Sites from "./sites.json"


const sites = Sites as Site[]

const graph = new Graph();

function countRefs(url: string): number {
    return sites.filter(s => s.refs.includes(url)).length
}


console.log(sites)

sites.forEach(s => {
    graph.addNode(s.url, { label: s.name, size: 5 + s.refs.length, x: Math.random(), y: Math.random(), color: "#00FF00" })
})

sites.forEach(s => {
    console.group("Joins for: ", s.url)
    s.refs.forEach(r => {
        console.group("Join: ", r)
        if (sites.findIndex(st => st.url == r) != -1) {
            graph.addEdge(s.url, r, { size: 5, color: "#7e7e7e" });
            console.log("YES")
        }
        console.groupEnd()
    })
    console.groupEnd()
})


const layout = new ForceSupervisor(graph, { isNodeFixed: (_, attr) => attr.highlighted , settings: {maxMove: 0.2}});
layout.start();


const renderer = new Sigma(
    graph,
    document.getElementById("graph") as HTMLDivElement,
    { minCameraRatio: 0.5, maxCameraRatio: 2, cameraPanBoundaries: {tolerance: 2,boundaries: {x: [-1,1],y: [-1,1]}}, labelColor: {"color":"white",attribute: "black"} }
);


//
// Drag'n'drop feature
// ~~~~~~~~~~~~~~~~~~~
//

// State for drag'n'drop
let draggedNode: string | null = null;
let isDragging = false;

// On mouse down on a node
//  - we enable the drag mode
//  - save in the dragged node in the state
//  - highlight the node
//  - disable the camera so its state is not updated
renderer.on("downNode", (e) => {
    isDragging = true;
    draggedNode = e.node;
    graph.setNodeAttribute(draggedNode, "highlighted", true);
    if (!renderer.getCustomBBox()) renderer.setCustomBBox(renderer.getBBox());
});

// On mouse move, if the drag mode is enabled, we change the position of the draggedNode
renderer.on("moveBody", ({ event }) => {
    if (!isDragging || !draggedNode) return;

    // Get new position of node
    const pos = renderer.viewportToGraph(event);

    graph.setNodeAttribute(draggedNode, "x", pos.x);
    graph.setNodeAttribute(draggedNode, "y", pos.y);

    // Prevent sigma to move camera:
    event.preventSigmaDefault();
    event.original.preventDefault();
    event.original.stopPropagation();
});

// On mouse up, we reset the dragging mode
const handleUp = () => {
    if (draggedNode) {
        graph.removeNodeAttribute(draggedNode, "highlighted");
    }
    isDragging = false;
    draggedNode = null;
};
renderer.on("upNode", handleUp);
renderer.on("upStage", handleUp);


