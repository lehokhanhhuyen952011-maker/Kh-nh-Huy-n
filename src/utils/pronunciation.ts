/**
 * Phonetic pronunciation adapter for Vietnamese Text-To-Speech engines.
 * Converts scientific terminology written in standard textbook form (SGK Kết nối tri thức)
 * into phonetically clear Vietnamese syllables for SpeechSynthesisUtterance so the speech
 * is completely intelligible, natural, and never garbled or mispronounced.
 */

export function getVietnamesePronunciationText(text: string): string {
  let spoken = text;

  // Exact whole-word replacements
  const replacements: Array<[RegExp, string]> = [
    // Teacher's Day & Numbers
    [/\b20\/11\b/g, 'hai mươi tháng mười một'],
    [/\bBài 8\b/gi, 'Bài tám'],

    // Nucleic acids & energy currency
    [/\bADN\b/g, 'A Đê En'],
    [/\bATP\b/g, 'A Tê Pê'],

    // Organelles & Cellular structures (SGK Kết nối tri thức terms)
    [/\bBộ máy Golgi\b/gi, 'Bộ máy Gôn-gi'],
    [/\bGolgi\b/gi, 'Gôn-gi'],
    [/\bLysosome\b/gi, 'Ly-xô-xôm'],
    [/\bLysosomes\b/gi, 'Ly-xô-xôm'],
    [/\bRibosome\b/gi, 'Ri-bô-xôm'],
    [/\bRibosomes\b/gi, 'Ri-bô-xôm'],
    [/\bPeroxisome\b/gi, 'Pe-rốc-xi-xôm'],
    [/\bPeroxisomes\b/gi, 'Pe-rốc-xi-xôm'],

    // Biomolecules & Chemical constituents
    [/\bphospholipid\b/gi, 'phốt-pho-li-pít'],
    [/\bphospholipids\b/gi, 'phốt-pho-li-pít'],
    [/\bcholesterol\b/gi, 'cô-le-xtê-rôn'],
    [/\bcellulose\b/gi, 'xen-lu-lô-zơ'],
    [/\bchitin\b/gi, 'ki-tin'],
    [/\bpolypeptide\b/gi, 'pô-li-pép-tít'],
    [/\bprotein\b/gi, 'prô-tê-in'],
    [/\bproteins\b/gi, 'prô-tê-in'],
    [/\blipid\b/gi, 'li-pít'],
    [/\blipids\b/gi, 'li-pít'],
    [/\bhistone\b/gi, 'hít-xtôn'],

    // General abbreviations
    [/\bSGK\b/g, 'sách giáo khoa'],
  ];

  for (const [pattern, replacement] of replacements) {
    spoken = spoken.replace(pattern, replacement);
  }

  return spoken;
}
