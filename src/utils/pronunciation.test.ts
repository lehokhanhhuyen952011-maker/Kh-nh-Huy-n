import { describe, it } from 'node:test';
import assert from 'node:assert';
import { getVietnamesePronunciationText } from './pronunciation.ts';

describe('Vietnamese Pronunciation Adapter for TTS', () => {
  it('correctly adapts organelles to clear Vietnamese phonetics', () => {
    const input = 'Bộ máy Golgi đóng gói sản phẩm, còn Lysosome và Ribosome phụ trách các việc khác.';
    const result = getVietnamesePronunciationText(input);
    assert.strictEqual(
      result,
      'Bộ máy Gôn-gi đóng gói sản phẩm, còn Ly-xô-xôm và Ri-bô-xôm phụ trách các việc khác.'
    );
  });

  it('correctly adapts biological terms like ATP and ADN', () => {
    const input = 'Ti thể hô hấp tạo ATP, còn nhân chứa ADN mang thông tin di truyền.';
    const result = getVietnamesePronunciationText(input);
    assert.strictEqual(
      result,
      'Ti thể hô hấp tạo A Tê Pê, còn nhân chứa A Đê En mang thông tin di truyền.'
    );
  });

  it('correctly adapts chemical constituents: phospholipid, cellulose, chitin', () => {
    const input = 'Màng sinh chất gồm phospholipid, còn thành tế bào chứa cellulose hoặc chitin.';
    const result = getVietnamesePronunciationText(input);
    assert.strictEqual(
      result,
      'Màng sinh chất gồm phốt-pho-li-pít, còn thành tế bào chứa xen-lu-lô-zơ hoặc ki-tin.'
    );
  });

  it('correctly adapts 20/11 celebration date and Bài 8', () => {
    const input = 'Bài 8 Tế bào nhân thực chúc mừng ngày 20/11!';
    const result = getVietnamesePronunciationText(input);
    assert.strictEqual(
      result,
      'Bài tám Tế bào nhân thực chúc mừng ngày hai mươi tháng mười một!'
    );
  });
});
