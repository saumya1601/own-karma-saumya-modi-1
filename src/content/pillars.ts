export interface Pillar {
    id: string;
    numeral: string;
    title: string;
    principle: string;
    body: string;
}

export const pillars: Pillar[] = [
    {
        id: "pillar-1",
        numeral: "PILLAR I",
        title: "PURPOSE",
        principle: "Design with intent.",
        body: "Every creation begins with a purpose beyond appearance. We design to express meaning, not just style.",
    },
    {
        id: "pillar-2",
        numeral: "PILLAR II",
        title: "SYMBOL",
        principle: "Meaning carried in form.",
        body: "Symbols are our language. Each mark holds an idea distilled to its most elemental shape.",
    },
    {
        id: "pillar-3",
        numeral: "PILLAR III",
        title: "STORY",
        principle: "Every piece is a chapter.",
        body: "A garment is not an object but a passage. Wearing it is stepping into the narrative it holds.",
    },
    {
        id: "pillar-4",
        numeral: "PILLAR IV",
        title: "UNBOUND",
        principle: "Free of era, place or tribe.",
        body: "We refuse borders — cultural, temporal, geographic. Everything is a source; nothing is a cage.",
    },
];
