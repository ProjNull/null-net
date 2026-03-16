import van from "vanjs-core";
import DOMPurify from 'dompurify';
import { showModal } from "./modal"
const {div,h2,a,p,button} = van.tags;

const fetchSiteInfo = async (siteID:string):Promise<Site> => {
    const res = await fetch(`./sites/${siteID}.json`);
    return await res.json();
}




const renderSiteData = (site:Site,openPageCallback:(id:string) => void) => div({classList:"flex-div"},
    div({classList: "actions"},
        button({classList:"btn btn-visit", onclick: () => window.open("https://" + site.url, "_blank")}, "Visit"),
    ),
    div({classList:"categories flex-list"},...site.categories.map(c => button({classList:"btn"},c))),
    div({classList: "readme"},
        h2("Readme"),
        () => site.readme ?
            div({classList: "readme-content",innerHTML: DOMPurify.sanitize(site.readme ?? "")}) :
            div("No Readme")
    ),
    div({classList:"references"},
        h2("References"),
        div({classList:"flex-list"},...site.refs.map(r => button({classList:"btn", onclick: () => openPageCallback(r)},r)))
    ),

)

export const showSitePage = (siteID:string,openPageCallback:(id:string) => void) => {

    const pageData = van.state<Site | null>(null);

    fetchSiteInfo(siteID).then((site) => {
        pageData.val = site
    })

    const modalOps = showModal(div(
        () => {
            if (pageData.val != null) {
                modalOps.setTitle(pageData.val.name)
                return renderSiteData(pageData.val,(id:string) => {
                    modalOps.remove();
                    openPageCallback(id);
                })
            } else {
                return div("Loading")
            }
        }
    ))
}