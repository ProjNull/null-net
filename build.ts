import { argv, listen } from "bun"
import { getAllSites } from "./mapper/main"
import FS from 'fs/promises'
import Path from 'path'
import { watch } from "fs"
const baseSite = "projnull.eu"
const outputDir = "dist/"

const sites = await getAllSites(baseSite)

const sitesDir = Path.join(outputDir, "sites")

async function build() {
    console.log("Build")
    if (await FS.exists(outputDir)) {
        await FS.rm(outputDir, { recursive: true })
    }


    var siteRefs: Record<string, string[]> = {};

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

    await FS.mkdir(sitesDir, { recursive: true })

    sites.forEach(async site => {
        await FS.writeFile(Path.join(sitesDir, site.url + ".json"), JSON.stringify(site))
    })

}

if (argv.includes("--watch")) {
    await build()
    watch("src/", {recursive:true},async ()=> {
        try {
            console.log("Update")
            await build()
        } catch (e) {
            console.error("Error", e)
        }
    })
} else {
    await build();
}