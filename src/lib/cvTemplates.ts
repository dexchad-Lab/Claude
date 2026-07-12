export type CvTemplateMeta = {
  id: string;
  name: string;
  description: string;
  bestFor: string;
};

export const CV_TEMPLATES: CvTemplateMeta[] = [
  {
    id: "modern",
    name: "Modern",
    description:
      "A colored sidebar for contact info and skills, with a clean main column for experience. Reads well on screen and in ATS parsers.",
    bestFor: "Tech, product, and design roles",
  },
  {
    id: "minimal",
    name: "Minimal",
    description:
      "Single column, no color, generous whitespace. The safest choice for conservative industries or strict ATS systems.",
    bestFor: "Finance, legal, and academic roles",
  },
  {
    id: "classic",
    name: "Classic",
    description:
      "A traditional serif header with a centered name and a clear section-by-section layout recruiters have seen a thousand times — in a good way.",
    bestFor: "Corporate and enterprise roles",
  },
];

export function getCvTemplate(id: string): CvTemplateMeta | undefined {
  return CV_TEMPLATES.find((t) => t.id === id);
}
