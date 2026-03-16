/**
 * This is a minimal example of sigma. You can use it as a base to write new
 * examples, or reproducible test cases for new issues, for instance.
 */
import "./style.css"
import Graph from "graphology";
import Sigma from "sigma";
import ForceSupervisor from "graphology-layout-force/worker";
import SiteRefs from "./refs.json"

import { Network, type Edge, type Node } from "vis-network";

const sites: Refs = SiteRefs


function calcRefs(url: string) {
    return Object.values(sites).filter(r => r.includes(url)).length
}

const edges: Edge[] = []

const nodes: Node[] = Object.keys(sites).map(r => {
    var size = 5 + calcRefs(r) * 4;
    var color = undefined;
    if (r == "projnull.eu") {
        size += 20;
        color = "#009200";
    }
    return { id: r, label: r, size, color }
})


Object.entries(sites).forEach(([site, refs]) => {
    refs.forEach(ref => {
        edges.push({
            from: site,
            to: ref,
            arrows: {
                to: true
            }
        })
    })
})

const network = new Network(document.getElementById("graph") as HTMLDivElement, {
    nodes,
    edges
}, {

    physics: {
        enabled: true,
        solver: 'repulsion', // Best for spreading out evenly
        repulsion: {
            nodeDistance: 300, // Default is usually 100. Try 200-500.
            springLength: 200, // Increases distance between connected nodes
            springConstant: 0.04, // Lower makes springs "looser", allowing more spread
            damping: 0.09
        },
        stabilization: {
            iterations: 400
        }
    },
    nodes: {
        shape: "dot",
        color: {
            border: "#222222",
            background: "#666666",
            hover: {
                border: "#3a3a3a",
                background: "#757575",
            },
            highlight: {
                border: "#004500",
                background: "#006300",
            },
        },
        shadow: true,
        font: { color: "#eeeeee" },
    }
})


// Assuming 'network' is your initialized vis.Network instance
network.on("doubleClick", function (params) {
    // params contains: pointers (DOM position), nodes (array of selected node IDs), edges (array of selected edge IDs)

    if (params.nodes.length > 0) {
        // A node was clicked
        const nodeId = params.nodes[0]; // Get the first selected node ID
        const nodeData = sites[nodeId] // Retrieve full data object for that node

        network.focus(nodeId, {animation: true, scale: 0.5})

        console.log("Node clicked:", nodeId);
        console.log("Node data:", nodeData);

        // Your custom logic here (e.g., open a modal, show details)
        // alert("You clicked node: " + nodeData.label);
    }
});
