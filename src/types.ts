export type SectionId = 'opening' | 'message' | 'onyer' | 'film';

export const SECTION_ORDER: SectionId[] = ['opening', 'message', 'onyer', 'film'];

export const SECTION_LABELS: Record<SectionId, string> = {
  opening: '01',
  message: '02',
  onyer: '03',
  film: '04',
};

export const TOTAL_SECTIONS = 4;
