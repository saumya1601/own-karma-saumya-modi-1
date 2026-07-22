export interface ArchiveFacet {
    id: string;
    label: string;
    image: string;
}

export interface ArchiveEntry {
    id: string;
    code: string; // e.g. "OK / 001"
    title: string;
    facets: ArchiveFacet[];
}

export const archive: ArchiveEntry[] = [
    {
        id: "ok-001",
        code: "OK / 001",
        title: "THE INFINITE PATH",
        facets: [
            { id: "idea",    label: "THE IDEA",    image: "/section-9-images/the Idea.png" },
            { id: "symbol",  label: "THE SYMBOL",  image: "/section-9-images/the symbol.png" },
            { id: "story",   label: "THE STORY",   image: "/section-9-images/the story.png" },
            { id: "artwork", label: "THE ARTWORK", image: "/section-9-images/the artwork.png" },
            { id: "garment", label: "THE GARMENT", image: "/section-9-images/the garment.png" },
        ],
    },
];

export const featuredArchive = archive[0];
