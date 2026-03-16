const toURL = (url:string) => new URL((url.startsWith("http") ? "" : "https://") + url + (url.endsWith("/") ? "site.json" : "/site.json"));
async function fetchSite(url: string): Promise<Site | false> {
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
                refs.push(toURL(r).hostname)
            } catch (e) {
                return
            }
        })

        return {
            url: finalURL.hostname,
            name: data.name,
            description: data.description,
            detailedDescription: data.detailedDescription ?? "",
            refs: refs,
            categories: data.categories ?? []
        }
    } catch (e) {
        return false;
    }
}




export async function getAllSites(startUrl: string): Promise<Site[]> {
    const sites: Site[] = [];
    const tovisit: (Site | false)[] = [];

    tovisit.push(await fetchSite(startUrl))
    while (tovisit.length > 0) {
        var site = tovisit.shift() ?? false
        if (site !== false) {
            if (site)
                sites.push(site)
            var newSites = site.refs.filter(r => sites.findIndex(s => s.url == r) == -1);
            for (let i = 0; i < newSites.length; i++) {
                const url = newSites[i]!;
                tovisit.push(await fetchSite(url))
            }
        }
    }

    return sites;
}