import type { State } from "vanjs-core";
import SiteGraph from "../utils/graph";
import van from "vanjs-core";

export default (ref:State<SiteGraph | null>,sites:Refs,openPageCallback:(site:string) => void) => {
    const root = van.tags.div({classList: "view graph"});
    setTimeout(() => {
        ref.val = new SiteGraph(root,sites,openPageCallback);
    })
    return root;
}