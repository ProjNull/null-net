import { getAllSites } from "./mapper/main"
import FS from 'fs/promises'
import Path from 'path'
const baseSite = "https://projnull.eu/"
const outputDir = "dist/"

const sites = await getAllSites(baseSite)

const sitesDir = Path.join(outputDir,"sites")

if (await FS.exists(outputDir)) {
    await FS.rm(outputDir,{recursive:true})
}


var siteRefs:Record<string,string[]> = {};

sites.forEach(site => {
    siteRefs[site.url] = site.refs
})

await Bun.build({
    "entrypoints": [
        "index.html",
    ],
    files: {
        "./refs.json": JSON.stringify(siteRefs)
    },
    outdir: outputDir
})

await FS.mkdir(sitesDir, {recursive: true})

sites.forEach(async site => {
    await FS.writeFile(Path.join(sitesDir,site.url+".json"), JSON.stringify(site))
})