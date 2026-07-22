/**
 * OWN KARMA copy — kept in a plain TS module so all text renders on the server
 * and stays fully SEO-indexable (creative brief priority 3).
 */

export const brand = {
    name: "OWN KARMA",
    tagline: "NOT BOUND. UNBOUND.",
    wordmark: {
        top: "OWN",
        bottom: "KARMA",
    },
};

export const cta = {
    enterCollection: {
        label: "ENTER THE COLLECTION",
        href: "#collection",
    },
    exploreUniverse: {
        label: "EXPLORE THE UNIVERSE",
        href: "#universe",
    },
    enterVoid: {
        label: "ENTER",
        href: "#the-portal",
    },
};

export const sectionMeta = [
    { id: "the-void", index: "01", label: "THE VOID" },
    { id: "the-portal", index: "02", label: "THE PORTAL" },
    { id: "what-is-own-karma", index: "03", label: "WHAT IS OWN KARMA?" },
    { id: "the-unbound", index: "04", label: "THE UNBOUND" },
    { id: "the-design-universe", index: "05", label: "THE DESIGN UNIVERSE" },
    { id: "the-four-pillars", index: "06", label: "THE FOUR PILLARS" },
    { id: "philosophy-to-garment", index: "07", label: "FROM PHILOSOPHY TO GARMENT" },
    { id: "the-first-product", index: "08", label: "THE FIRST PRODUCT" },
    { id: "the-karma-archive", index: "09", label: "THE KARMA ARCHIVE" },
    { id: "the-final-question", index: "10", label: "THE FINAL QUESTION" },
] as const;

export const voidCopy = {
    eyebrowTop: "EVERY ACTION LEAVES A TRACE.",
    eyebrowBottom: "EVERY CHOICE CREATES A PATH.",
};

export const portalCopy = {
    lines: [
        { text: "YOU ARE NOT" },
        { text: "ENTERING A BRAND." },
        { text: "YOU ARE" },
        { text: "ENTERING", gold: false, trailing: " " },
        { text: "AN IDEA.", gold: true },
    ],
};

export const whatIsCopy = {
    eyebrow: "OWN YOUR KARMA.",
    paragraphs: [
        { plain: "OWN KARMA is a philosophy expressed through design." },
        { plain: "Every piece begins with an ", gold: "idea", trail: "." },
        { plain: "Every symbol carries ", gold: "meaning", trail: "." },
        { plain: "Every design tells a ", gold: "story", trail: "." },
    ],
};

export const unboundCopy = {
    eyebrow: "WE ARE NOT",
    bound: "BOUND.",
    unbound: "UNBOUND.",
    list: [
        "Not bound by culture.",
        "Not bound by mythology.",
        "Not bound by geography.",
        "Not bound by time.",
    ],
    closing: [
        { plain: "Inspired by ", gold: "everything", trail: "." },
        { plain: "Defined by ", gold: "nothing", trail: "." },
    ],
};

export const philosophyStages = [
    { index: "01", label: "THOUGHT" },
    { index: "02", label: "PHILOSOPHY" },
    { index: "03", label: "SYMBOL" },
    { index: "04", label: "DESIGN" },
    { index: "05", label: "GARMENT" },
] as const;

export const philosophyCaption = {
    line1: "WE DON'T DECORATE CLOTHING.",
    line2Prefix: "WE ",
    line2Gold: "TRANSFORM IDEAS",
    line2Suffix: " INTO SOMETHING YOU CAN WEAR.",
};

export const productCopy = {
    facets: ["360° VIEW", "FABRIC", "EMBROIDERY", "STITCHING", "ARTWORK", "LABELS"],
    meaningTitle: ["DISCOVER", "THE MEANING"],
    meaningHint: "Every artwork carries a story. Open the meaning behind this design.",
};

export const finalQuestion = {
    question: ["WHAT WILL", "YOU LEAVE BEHIND?"],
    lines: ["YOUR ACTIONS.", "YOUR CHOICES.", "YOUR STORY."],
    gold: "YOUR KARMA.",
};

export const footerCopy = {
    mark: "✦",
    text: `© ${new Date().getFullYear()} OWN KARMA. ALL RIGHTS RESERVED.`,
};
