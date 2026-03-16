type SiteJSON = {
    name: string,
    categories: string[],
    description: string,
    detailedDescription: string,
    refs:string[]
}

type Site = SiteJSON & {
    url: string
}


type Refs = Record<string,string[]>


