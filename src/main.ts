/**
 * This is a minimal example of sigma. You can use it as a base to write new
 * examples, or reproducible test cases for new issues, for instance.
 */
import "./style.css"
import "./readme.css"
import SiteRefs from "./refs.json"

import van, { type State } from "vanjs-core";
import { GraphIcon, ListIcon } from "./utils/icons";
import type SiteGraph from "./utils/graph";
import GraphView from "./views/graphView";
import ListView from "./views/listView";
import { showSitePage } from "./utils/sitePage";

const sites: Refs = SiteRefs

const { p, pre, code, div, a,button } = van.tags



function App() {
    // State to toggle views
    const showGraph = van.state(true);

    // State to hold the GraphView instance
    const graphInstance = van.state<SiteGraph | null>(null);

    const toggleView = () => {
        if (showGraph.val) {
            // We are switching FROM graph TO list
            // 1. Cleanup first
            if (graphInstance.val) {
                graphInstance.val.kill();
                graphInstance.val = null;
            }
            // 2. Then switch state
            showGraph.val = false;
        } else {
            // We are switching TO graph
            showGraph.val = true;
            // Note: The GraphView will be instantiated in the render function below
        }
    };

    const openPage = (id:string) =>  {
        if (graphInstance.val!== null) {
            graphInstance.val.focus(id);
        }
        showSitePage(id,(s) => openPage(s))
    }

    return div({classList: "view"},
        button({classList: "btn toggle-button", onclick: toggleView }, () => showGraph.val ?  ListIcon() : GraphIcon()),

        () => showGraph.val
            ? GraphView(graphInstance,sites,(s) => openPage(s))
            : ListView(sites,(s) => openPage(s))
        
    );
}

van.add(document.body, App());


//new SiteGraph(document.getElementById("graph") as HTMLDivElement,sites);