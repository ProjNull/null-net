import DOMPurify from 'isomorphic-dompurify';
import { marked } from 'marked';

const toURL = (url:string,file:string = "site.json") => new URL("https://" + url + `/${file}`);
const validReadmePattern = /^[a-zA-Z-_]+\.md$/;
const validDomainPattern = /^[a-z-\.]+\.[a-z]+$/;

async function fetchSite(url: string,masterSite:string): Promise<Site | false> {
    const finalURL = toURL(url);
    console.log("Fetching: ", finalURL.hostname)
    try {
        const res = await fetch(finalURL);

        const data: Partial<SiteJSON> = await res.json() as Partial<SiteJSON>;

        if (!data.name) return false;
        if (!data.description) return false;

        var refs:string[] = []

        data.refs?.forEach(r => {
            try {
                if (validDomainPattern.test(r) && !refs.includes(r)) {
                    refs.push(r)
                }
            } catch (e) {
                return
            }
        })

        var readmefile:string | undefined = undefined
        if (data.readme && validReadmePattern.test(data.readme)) {
            const readmeRes = await fetch(toURL(url,data.readme));
            const readmeText = await readmeRes.text()
            if(readmeText.trim().length <= 100) {
                readmefile = DOMPurify.sanitize(await marked.parse(readmeText.trim()));
            }
        }

        return {
            url: finalURL.hostname,
            masterSite: masterSite,
            name: data.name,
            description: data.description,
            readme: readmefile,
            refs: refs,
            categories: data.categories ?? []
        }
    } catch (e) {
        return false;
    }
}




export async function getAllSites(startUrl: string): Promise<Site[]> {
    const sites: Site[] = [];
    const visited: string[] = [];
    const tovisit: (Site | false)[] = [];
    if (!validDomainPattern.test(startUrl)) return [];
    tovisit.push(await fetchSite(startUrl,startUrl))
    while (tovisit.length > 0) {
        var site = tovisit.shift() ?? false
        if (site !== false) {
            sites.push(site)
            var newSites = site.refs.filter(r => !visited.includes(r));
            for (let i = 0; i < newSites.length; i++) {
                const url = newSites[i]!;
                if (validDomainPattern.test(url)) {
                    visited.push(url)
                    tovisit.push(await fetchSite(url,startUrl))
                };
            }
        }
    }

    return sites;
}