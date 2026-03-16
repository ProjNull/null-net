import type { State } from "vanjs-core";
import van from "vanjs-core";
import AppConfig from "../../config";

const {div,ul,li,h3,span,button} = van.tags;


function calcRefs(sites:Refs,url: string) {
    return Object.values(sites).filter(r => r.includes(url)).length
}
function sortSite(sites:Refs,siteA:string,siteB:string) {
    if (siteA == AppConfig.masterSite) {
        return -1000
    }
    return calcRefs(sites,siteA) - calcRefs(sites,siteB)
}

const SiteItem = (url:string,refs:number,callback: () => void) => li(
    div({classList: "info"},h3({style:"margin:0;padding:0"},url),span("Refs: " + refs)),
    button({classList:"btn",style:"padding-inline:var(--s-3)", onclick: callback},"Info")
)




export default (sites:Refs,openPageCallback:(site:string) => void) => {
    const sortedSites = Object.keys(sites).sort((a,b) => sortSite(sites,a,b))
    return div({classList: "view list"},
        ul({classList: "site-list"},...sortedSites.map(s => SiteItem(s,calcRefs(sites,s), () => openPageCallback(s))))
    )
}