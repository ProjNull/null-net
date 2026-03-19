type SiteJSON = {
    name: string,
    categories: string[],
    description: string,
    readme?: string,
    refs:string[]
}

type Site = SiteJSON & {
    url: string,
    masterSite: string
}


type Refs = Record<string,string[]>


