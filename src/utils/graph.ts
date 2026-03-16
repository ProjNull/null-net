/**
 * This is a minimal example of sigma. You can use it as a base to write new
 * examples, or reproducible test cases for new issues, for instance.
 */


import type { State } from "vanjs-core";
import van from "vanjs-core";
import { DataSet, Network, type DataSetEdges, type DataSetNodes, type Edge, type Node, type Options } from "vis-network";


const config: Options = {
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
}


export default class SiteGraph {
    private network: Network
    private edges: Edge[]
    private nodes: Node[]
    private sites: Refs;

    private openPageCallback: (site:string) => void;

    constructor(container: HTMLElement, sites: Refs,openPageCallback:(site:string) => void) {
        this.sites = sites;
        this.edges = [];
        this.nodes = [];
        this.openPageCallback = openPageCallback;


        Object.keys(sites).forEach(r => {
            var size = 5 + this.calcRefs(r) * 4;
            var color = undefined;
            if (r == "projnull.eu") {
                size += 20;
                color = "#009200";
            }
            this.nodes.push({ id: r, label: r, size, color })
        })

        Object.entries(sites).forEach(([site, refs]) => {
            refs.forEach(ref => {
                this.edges.push({
                    from: site,
                    to: ref,
                    arrows: {
                        to: true
                    }
                })
            })
        })

        this.network = new Network(container, { nodes: this.nodes, edges: this.edges }, config)

        this.network.on("doubleClick", (p) => this.onDBClick(p))
    }

    private calcRefs(url: string) {
        return Object.values(this.sites).filter(r => r.includes(url)).length
    }


    private onDBClick(params: any) {
        if (params.nodes.length > 0) {
            // A node was clicked
            const nodeId = params.nodes[0]; // Get the first selected node ID
            this.openPageCallback(nodeId)

            // Your custom logic here (e.g., open a modal, show details)
            // alert("You clicked node: " + nodeData.label);
        }
    }

    public kill() {
        console.log("Kill")
        this.network.destroy();
    }

    public focus(id:string) {
        this.network.focus(id, { animation: true, scale: 2 })
    }
}


