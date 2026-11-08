export interface Organelle {
  id: string;
  name: string;
  category: 'main' | 'sub_membrane' | 'sub_cytoplasm' | 'sub_non_membrane';
  membraneType: 'none' | 'single' | 'double';
  structure: string;
  functionDesc: string;
  location: string;
  color: string;
  zoomTarget: { x: number; y: number; scale: number };
  calloutTitle: string;
  calloutDetails: string[];
}

export interface DialogueLine {
  id: string;
  speaker: 'Khang' | 'Trọng' | 'Khang & Trọng';
  text: string;
  highlightPartId?: string;
  camera: { x: number; y: number; scale: number; focusName: string };
  duration: number; // Duration in seconds for natural speech synchronization
  khangPose: 'idle' | 'pointing' | 'explaining' | 'talking_to_camera' | 'celebrating';
  trongPose: 'confused' | 'listening' | 'excited' | 'smiling' | 'celebrating';
}

export interface Scene {
  id: number;
  title: string;
  dialogues: DialogueLine[];
}

export const MAIN_PARTS_SUMMARY = [
  {
    id: 'plasma_membrane',
    name: 'Màng sinh chất',
    type: 'Thành phần chính 1',
    description: 'Ranh giới ngăn cách tế bào với môi trường ngoài, cấu trúc khảm động gồm lớp kép phospholipid và protein.',
    keyFunction: 'Bảo vệ tế bào, trao đổi chất có chọn lọc, tiếp nhận thông tin và nhận biết tế bào.',
    subNotes: 'Ở tế bào thực vật có thành tế bào bằng cellulose, ở nấm bằng chitin bao bọc bên ngoài màng sinh chất.'
  },
  {
    id: 'cytoplasm',
    name: 'Tế bào chất',
    type: 'Thành phần chính 2',
    description: 'Vùng nằm giữa màng sinh chất và nhân, gồm dịch keo bào tương và hệ thống các bào quan phong phú.',
    keyFunction: 'Nơi diễn ra hầu hết các hoạt động chuyển hóa vật chất và năng lượng của tế bào.',
    subNotes: 'Chứa ti thể, lục lạp (ở thực vật), lưới nội chất hạt & trơn, bộ máy Golgi, lysosome, không bào, ribosome và khung xương tế bào.'
  },
  {
    id: 'nucleus',
    name: 'Nhân tế bào',
    type: 'Thành phần chính 3',
    description: 'Bao bọc bởi màng kép có lỗ nhân, bên trong chứa chất nhiễm sắc (ADN kết hợp protein histone) và nhân con (hạch nhân).',
    keyFunction: 'Trung tâm điều khiển mọi hoạt động sống của tế bào, lưu giữ và truyền đạt thông tin di truyền.',
    subNotes: 'Được ví như bộ não chỉ đạo tổng hợp protein và phân chia tế bào.'
  }
];

export const ORGANELLES: Organelle[] = [
  {
    id: 'plasma_membrane',
    name: 'Màng sinh chất',
    category: 'main',
    membraneType: 'double',
    structure: 'Lớp kép phospholipid với các đầu ưa nước quay ra ngoài và đuôi kị nước quay vào nhau. Khảm các phân tử protein xuyên màng, protein bám màng và cholesterol.',
    functionDesc: 'Bảo vệ tế bào, kiểm soát chọn lọc sự vận chuyển các chất (thấm chọn lọc), tiếp nhận và truyền tín hiệu.',
    location: 'Ranh giới ngoài cùng của tế bào động vật; nằm ngay bên trong thành tế bào ở thực vật.',
    color: '#38bdf8',
    zoomTarget: { x: 50, y: 15, scale: 2.3 },
    calloutTitle: 'Cấu Trúc Màng Sinh Chất',
    calloutDetails: [
      'Lớp kép phospholipid (đầu ưa nước, đuôi kị nước)',
      'Protein xuyên màng & protein bám màng',
      'Cholesterol xen kẽ tăng tính linh hoạt',
      'Thấm chọn lọc & thụ thể tiếp nhận tín hiệu'
    ]
  },
  {
    id: 'cell_wall',
    name: 'Thành tế bào',
    category: 'sub_membrane',
    membraneType: 'none',
    structure: 'Nằm bên ngoài màng sinh chất. Ở tế bào thực vật cấu tạo từ các sợi cellulose; ở nấm cấu tạo từ chitin.',
    functionDesc: 'Bảo vệ tế bào, quy định và duy trì hình dạng ổn định cho tế bào, ngăn ngừa tế bào hút nước quá nhiều gây vỡ.',
    location: 'Bao bọc bên ngoài màng sinh chất ở thực vật và nấm.',
    color: '#4ade80',
    zoomTarget: { x: 50, y: 8, scale: 2.4 },
    calloutTitle: 'Thành Tế Bào (Thực Vật & Nấm)',
    calloutDetails: [
      'Ở thực vật: Cấu tạo từ sợi cellulose liên kết bền vững',
      'Ở nấm: Cấu tạo từ chất chitin',
      'Chức năng: Bảo vệ, định hình khung tế bào'
    ]
  },
  {
    id: 'cytoplasm',
    name: 'Tế bào chất & Bào tương',
    category: 'main',
    membraneType: 'none',
    structure: 'Gồm bào tương (dịch keo chứa nước, ion khoáng, enzym, các hợp chất hữu cơ) và khung xương tế bào.',
    functionDesc: 'Môi trường đệm chứa các bào quan, nơi diễn ra hầu hết các phản ứng chuyển hóa vật chất nội bào.',
    location: 'Khoảng không gian giữa màng sinh chất và màng nhân.',
    color: '#818cf8',
    zoomTarget: { x: 50, y: 50, scale: 1.5 },
    calloutTitle: 'Tế Bào Chất & Bào Tương',
    calloutDetails: [
      'Bào tương: Dịch keo lỏng chứa ion, enzyme và phân tử hữu cơ',
      'Hệ thống bào quan có màng và không màng',
      'Nơi diễn ra các phản ứng sinh hóa của tế bào'
    ]
  },
  {
    id: 'mitochondria',
    name: 'Ti thể',
    category: 'sub_cytoplasm',
    membraneType: 'double',
    structure: 'Màng kép: màng ngoài trơn nhẵn, màng trong gấp nếp thành các mào (cristae) chứa enzyme hô hấp; chất nền có ADN vòng và ribosome riêng.',
    functionDesc: 'Nhà máy năng lượng của tế bào: thực hiện hô hấp tế bào phân giải chất hữu cơ để tổng hợp phân tử ATP.',
    location: 'Phân bố tự do trong bào tương.',
    color: '#f97316',
    zoomTarget: { x: 26, y: 64, scale: 2.7 },
    calloutTitle: 'Ti Thể (Màng kép)',
    calloutDetails: [
      'Màng ngoài trơn, màng trong gấp nếp thành các mào (cristae)',
      'Chất nền chứa enzyme hô hấp tế bào',
      'Có ADN vòng và ribosome riêng',
      'Chức năng: Tổng hợp ATP - Năng lượng cho tế bào'
    ]
  },
  {
    id: 'chloroplast',
    name: 'Lục lạp',
    category: 'sub_cytoplasm',
    membraneType: 'double',
    structure: 'Màng kép bao bọc khối chất nền stroma. Bên trong chứa các hạt grana (tập hợp các túi thylakoid chứa sắc tố diệp lục, ADN và ribosome riêng).',
    functionDesc: 'Thực hiện quang hợp: chuyển hóa năng lượng ánh sáng thành năng lượng hóa học trong hợp chất hữu cơ.',
    location: 'Có trong tế bào quang hợp của thực vật và tảo.',
    color: '#22c55e',
    zoomTarget: { x: 74, y: 35, scale: 2.7 },
    calloutTitle: 'Lục Lạp (Ở Thực Vật)',
    calloutDetails: [
      'Bào quan có màng kép chứa chất nền stroma',
      'Hạt grana cấu tạo từ các túi thylakoid',
      'Chứa sắc tố diệp lục hấp thụ ánh sáng',
      'Chức năng: Quang hợp tổng hợp glucose'
    ]
  },
  {
    id: 'endoplasmic_reticulum',
    name: 'Lưới nội chất',
    category: 'sub_cytoplasm',
    membraneType: 'single',
    structure: 'Hệ thống xoang dẹp và mạng ống thông suốt từ màng nhân ra tế bào chất. Gồm lưới nội chất hạt (có đính ribosome) và lưới nội chất trơn (không đính ribosome).',
    functionDesc: 'Lưới nội chất hạt tổng hợp protein bài xuất và protein màng. Lưới nội chất trơn tổng hợp lipid, chuyển hóa đường và giải độc tế bào.',
    location: 'Tiếp giáp trực tiếp với màng ngoài của nhân.',
    color: '#ec4899',
    zoomTarget: { x: 38, y: 45, scale: 2.4 },
    calloutTitle: 'Lưới Nội Chất (Hạt & Trơn)',
    calloutDetails: [
      'Lưới nội chất hạt: Đính ribosome, tổng hợp protein',
      'Lưới nội chất trơn: Không có ribosome, tổng hợp lipid & giải độc',
      'Hệ thống xoang màng đơn thông nhau'
    ]
  },
  {
    id: 'golgi_apparatus',
    name: 'Bộ máy Golgi',
    category: 'sub_cytoplasm',
    membraneType: 'single',
    structure: 'Chồng túi màng dẹp hình cung xếp song song nhưng tách rời nhau. Phát sinh các túi tiết vận chuyển.',
    functionDesc: 'Thu nhận protein và lipid từ lưới nội chất, tiếp tục biến đổi, hoàn thiện, đóng gói và phân phối đến các đích đến nội bào hoặc xuất bào.',
    location: 'Nằm gần lưới nội chất và nhân tế bào.',
    color: '#eab308',
    zoomTarget: { x: 68, y: 66, scale: 2.6 },
    calloutTitle: 'Bộ Máy Golgi (Màng đơn)',
    calloutDetails: [
      'Chồng túi màng dẹp hình cung tách rời nhau',
      'Tiếp nhận sản phẩm từ lưới nội chất',
      'Sửa đổi, đóng gói và xuất các túi tiết'
    ]
  },
  {
    id: 'lysosome',
    name: 'Lysosome & Không bào',
    category: 'sub_cytoplasm',
    membraneType: 'single',
    structure: 'Lysosome là túi màng đơn chứa enzyme thủy phân (pH axit). Ở thực vật có không bào trung tâm lớn chứa dịch tế bào.',
    functionDesc: 'Lysosome tiêu hóa nội bào: phân giải chất hữu cơ ngoại bào và dọn dẹp bào quan già. Không bào điều hòa áp suất thẩm thấu và dự trữ.',
    location: 'Nằm rải rác trong tế bào chất.',
    color: '#06b6d4',
    zoomTarget: { x: 28, y: 34, scale: 2.6 },
    calloutTitle: 'Lysosome & Không Bào',
    calloutDetails: [
      'Lysosome: Chứa enzyme thủy phân tiêu hóa nội bào',
      'Không bào ở thực vật: Điều hòa áp suất thẩm thấu & dự trữ'
    ]
  },
  {
    id: 'ribosome',
    name: 'Ribosome',
    category: 'sub_non_membrane',
    membraneType: 'none',
    structure: 'Cấu trúc không có màng bao bọc. Cấu tạo gồm 2 tiểu phần lớn và nhỏ từ rARN và protein.',
    functionDesc: 'Nơi diễn ra quá trình dịch mã, tổng hợp chuỗi polypeptide (protein) theo khuôn mARN.',
    location: 'Đính trên màng lưới nội chất hạt và trôi nổi tự do trong bào tương.',
    color: '#a855f7',
    zoomTarget: { x: 42, y: 38, scale: 2.8 },
    calloutTitle: 'Ribosome (Cấu trúc không màng)',
    calloutDetails: [
      'Cấu tạo từ rARN và protein, gồm 2 tiểu phần lớn và bé',
      'Nơi sinh tổng hợp chuỗi polypeptide (protein)'
    ]
  },
  {
    id: 'cytoskeleton',
    name: 'Khung xương tế bào',
    category: 'sub_non_membrane',
    membraneType: 'none',
    structure: 'Mạng lưới phức tạp gồm ba loại sợi protein: vi ống, vi sợi và sợi trung gian.',
    functionDesc: 'Làm giá đỡ cơ học duy trì hình dạng tế bào, neo giữ các bào quan và tham gia vận chuyển nội bào.',
    location: 'Đan xen khắp tế bào chất.',
    color: '#14b8a6',
    zoomTarget: { x: 50, y: 55, scale: 1.8 },
    calloutTitle: 'Khung Xương Tế Bào',
    calloutDetails: [
      'Gồm vi ống, vi sợi và sợi trung gian',
      'Duy trì hình dạng tế bào & neo giữ bào quan'
    ]
  },
  {
    id: 'nucleus',
    name: 'Nhân tế bào',
    category: 'main',
    membraneType: 'double',
    structure: 'Màng nhân kép với lớp màng ngoài đính ribosome; trên màng có nhiều lỗ nhân. Bên trong chứa chất nhiễm sắc (ADN kết hợp protein histone) và nhân con (hạch nhân).',
    functionDesc: 'Trung tâm chỉ huy cao nhất của tế bào: lưu trữ, bảo quản và truyền đạt thông tin di truyền; điều khiển mọi hoạt động sống và phân chia tế bào.',
    location: 'Vị trí trung tâm của tế bào.',
    color: '#f43f5e',
    zoomTarget: { x: 50, y: 50, scale: 2.6 },
    calloutTitle: 'Nhân Tế Bào (Trung tâm chỉ huy)',
    calloutDetails: [
      'Màng kép có các lỗ nhân trao đổi chất',
      'Chất nhiễm sắc chứa ADN lưu giữ thông tin di truyền',
      'Nhân con (hạch nhân) tổng hợp ribosome',
      'Điều khiển mọi hoạt động sống của tế bào'
    ]
  }
];

export const SCENES: Scene[] = [
  {
    id: 1,
    title: 'Trọng băn khoăn trước mô hình tế bào',
    dialogues: [
      {
        id: 'd1_1',
        speaker: 'Trọng',
        text: 'Khang ơi, vừa học xong Bài 8 Tế bào nhân thực trong sách Kết nối tri thức mà mình nhìn vào mô hình này vẫn thấy bối rối quá. Nhiều cấu trúc thế này thì làm sao nhớ hết được?',
        camera: { x: 50, y: 50, scale: 1.0, focusName: 'Toàn cảnh mô hình tế bào' },
        duration: 9.0,
        khangPose: 'idle',
        trongPose: 'confused'
      },
      {
        id: 'd1_2',
        speaker: 'Trọng',
        text: 'Cậu chỉ giúp mình xem tế bào nhân thực có những thành phần chính nào và chức năng của từng thành phần ra sao với!',
        camera: { x: 50, y: 50, scale: 1.1, focusName: 'Trọng đặt câu hỏi' },
        duration: 7.5,
        khangPose: 'idle',
        trongPose: 'confused'
      }
    ]
  },
  {
    id: 2,
    title: 'Khang tới gần & Phóng to mô hình',
    dialogues: [
      {
        id: 'd2_1',
        speaker: 'Khang',
        text: 'Đừng lo Trọng ơi! Bài này nhìn chi tiết vậy thôi chứ nắm vững kiến thức trọng tâm thì rất mạch lạc. Để mình phóng to mô hình này lên rồi cùng xem nhé.',
        camera: { x: 50, y: 50, scale: 1.25, focusName: 'Khang phóng to mô hình' },
        duration: 8.5,
        khangPose: 'explaining',
        trongPose: 'listening'
      },
      {
        id: 'd2_2',
        speaker: 'Khang',
        text: 'Cậu nhìn này, cấu tạo tế bào nhân thực về cơ bản gồm đúng 3 thành phần chính: Màng sinh chất, Tế bào chất và Nhân tế bào. Giờ mình sẽ chỉ chi tiết từng phần cho cậu nhé!',
        camera: { x: 50, y: 50, scale: 1.45, focusName: '3 Thành phần chính' },
        duration: 9.5,
        khangPose: 'pointing',
        trongPose: 'listening'
      }
    ]
  },
  {
    id: 3,
    title: 'Màng sinh chất & Thành tế bào',
    dialogues: [
      {
        id: 'd3_1',
        speaker: 'Khang',
        text: 'Đầu tiên, cậu quan sát lớp ngoài cùng này nhé: Màng sinh chất. Màng có cấu trúc khảm động, gồm lớp kép phospholipid xen kẽ các phân tử protein và cholesterol.',
        highlightPartId: 'plasma_membrane',
        camera: { x: 50, y: 15, scale: 2.3, focusName: 'Màng sinh chất' },
        duration: 10.0,
        khangPose: 'pointing',
        trongPose: 'listening'
      },
      {
        id: 'd3_2',
        speaker: 'Khang',
        text: 'Chức năng chính của màng sinh chất là bao bọc tế bào, kiểm soát chọn lọc sự trao đổi chất với môi trường bên ngoài, đồng thời tiếp nhận và truyền tín hiệu.',
        highlightPartId: 'plasma_membrane',
        camera: { x: 50, y: 15, scale: 2.3, focusName: 'Chức năng trao đổi chất có chọn lọc' },
        duration: 9.5,
        khangPose: 'explaining',
        trongPose: 'listening'
      },
      {
        id: 'd3_3',
        speaker: 'Khang',
        text: 'Cậu lưu ý thêm chi tiết này: Ở tế bào thực vật và nấm, bên ngoài màng sinh chất còn có thêm thành tế bào. Ở thực vật thì được cấu tạo từ cellulose, còn ở nấm là chitin giúp bảo vệ và giữ hình dạng tế bào luôn ổn định.',
        highlightPartId: 'cell_wall',
        camera: { x: 50, y: 8, scale: 2.4, focusName: 'Thành tế bào ở Thực vật & Nấm' },
        duration: 11.5,
        khangPose: 'pointing',
        trongPose: 'listening'
      },
      {
        id: 'd3_4',
        speaker: 'Trọng',
        text: 'À mình hiểu rồi! Tế bào động vật chỉ có màng sinh chất mềm dẻo, còn thực vật và nấm thì có thêm lớp thành tế bào cứng cáp bao bọc bên ngoài đúng không Khang?',
        highlightPartId: 'cell_wall',
        camera: { x: 50, y: 12, scale: 2.0, focusName: 'Trọng ghi nhớ Màng sinh chất' },
        duration: 9.5,
        khangPose: 'idle',
        trongPose: 'excited'
      }
    ]
  },
  {
    id: 4,
    title: 'Tế bào chất & Hệ thống các bào quan',
    dialogues: [
      {
        id: 'd4_1',
        speaker: 'Khang',
        text: 'Chính xác! Giờ chúng ta sang thành phần chính thứ hai: Tế bào chất. Đây là toàn bộ vùng nằm giữa màng sinh chất và nhân, gồm dịch keo bào tương và hệ thống rất nhiều bào quan phong phú.',
        highlightPartId: 'cytoplasm',
        camera: { x: 50, y: 50, scale: 1.5, focusName: 'Tế bào chất & Bào tương' },
        duration: 10.5,
        khangPose: 'explaining',
        trongPose: 'listening'
      },
      {
        id: 'd4_2',
        speaker: 'Khang',
        text: 'Trước hết là các bào quan có màng kép: Cậu nhìn chỗ tay mình chỉ nhé, đây là Ti thể - nhà máy năng lượng của tế bào, chuyên hô hấp để tạo ATP. Còn ở tế bào thực vật thì có thêm Lục lạp chứa diệp lục để thực hiện quang hợp.',
        highlightPartId: 'mitochondria',
        camera: { x: 30, y: 60, scale: 2.5, focusName: 'Ti thể & Lục lạp (Màng kép)' },
        duration: 12.0,
        khangPose: 'pointing',
        trongPose: 'listening'
      },
      {
        id: 'd4_3',
        speaker: 'Khang',
        text: 'Tiếp theo là nhóm bào quan có màng đơn: Lưới nội chất gồm hạt tổng hợp protein và trơn tổng hợp lipid; Bộ máy Golgi đóng gói và phân phối sản phẩm; còn Lysosome thì phụ trách tiêu hóa nội bào và dọn dẹp chất thải.',
        highlightPartId: 'endoplasmic_reticulum',
        camera: { x: 60, y: 60, scale: 2.3, focusName: 'Lưới nội chất, Golgi, Lysosome' },
        duration: 12.5,
        khangPose: 'pointing',
        trongPose: 'listening'
      },
      {
        id: 'd4_4',
        speaker: 'Khang',
        text: 'Bên cạnh đó là các cấu trúc không có màng bao bọc: Ribosome là nơi tổng hợp chuỗi polypeptide, và Khung xương tế bào gồm các vi ống, vi sợi giúp nâng đỡ, giữ vững hình dạng tế bào.',
        highlightPartId: 'ribosome',
        camera: { x: 45, y: 40, scale: 2.5, focusName: 'Ribosome & Khung xương tế bào' },
        duration: 11.5,
        khangPose: 'pointing',
        trongPose: 'listening'
      },
      {
        id: 'd4_5',
        speaker: 'Trọng',
        text: 'Hay quá! Hóa ra tế bào chất giống như một khu công nghiệp thu nhỏ, mỗi bào quan đảm đương một dây chuyền làm việc rất nhịp nhàng!',
        camera: { x: 50, y: 50, scale: 1.6, focusName: 'Trọng liên tưởng khu công nghiệp sinh học' },
        duration: 8.5,
        khangPose: 'idle',
        trongPose: 'excited'
      }
    ]
  },
  {
    id: 5,
    title: 'Nhân tế bào - Bộ não chỉ huy',
    dialogues: [
      {
        id: 'd5_1',
        speaker: 'Khang',
        text: 'Đúng thế Trọng ạ! Và bây giờ là thành phần chính thứ ba quan trọng nhất: Nhân tế bào. Cậu nhìn mình zoom thẳng vào trung tâm mô hình này.',
        highlightPartId: 'nucleus',
        camera: { x: 50, y: 50, scale: 2.6, focusName: 'Nhân tế bào' },
        duration: 9.5,
        khangPose: 'pointing',
        trongPose: 'listening'
      },
      {
        id: 'd5_2',
        speaker: 'Khang',
        text: 'Nhân được bao bọc bởi màng kép có các lỗ nhân để trao đổi chất. Bên trong chứa chất nhiễm sắc mang phân tử ADN lưu giữ thông tin di truyền, cùng nhân con để tổng hợp ribosome.',
        highlightPartId: 'nucleus',
        camera: { x: 50, y: 50, scale: 2.6, focusName: 'Màng nhân, ADN & Nhân con' },
        duration: 11.0,
        khangPose: 'explaining',
        trongPose: 'listening'
      },
      {
        id: 'd5_3',
        speaker: 'Khang',
        text: 'Về chức năng, nhân chính là trung tâm chỉ huy điều khiển mọi hoạt động trao đổi chất, sinh trưởng và truyền đạt đặc tính di truyền cho thế hệ sau của tế bào.',
        highlightPartId: 'nucleus',
        camera: { x: 50, y: 50, scale: 2.5, focusName: 'Chức năng điều khiển mọi hoạt động sống' },
        duration: 10.0,
        khangPose: 'pointing',
        trongPose: 'listening'
      }
    ]
  },
  {
    id: 6,
    title: 'Trọng hiểu bài & Cảm ơn Khang',
    dialogues: [
      {
        id: 'd6_1',
        speaker: 'Trọng',
        text: 'Nhờ cậu vừa chỉ trên mô hình vừa giải thích thế này mà mình đã nhớ rõ rồi: 3 phần chính gồm Màng sinh chất bảo vệ chọn lọc, Tế bào chất chứa các bào quan chuyển hóa, và Nhân tế bào là cơ quan chỉ huy di truyền!',
        camera: { x: 50, y: 50, scale: 1.3, focusName: 'Trọng tóm tắt 3 thành phần chính' },
        duration: 11.0,
        khangPose: 'idle',
        trongPose: 'excited'
      },
      {
        id: 'd6_2',
        speaker: 'Trọng',
        text: 'Cảm ơn Khang nhiều nhé! Có được bài giải thích trực quan này, mình thấy rất tự tin trong buổi hội giảng môn Sinh học hôm nay rồi.',
        camera: { x: 50, y: 50, scale: 1.2, focusName: 'Trọng cảm ơn bạn Khang' },
        duration: 8.5,
        khangPose: 'explaining',
        trongPose: 'smiling'
      }
    ]
  },
  {
    id: 7,
    title: 'Khang nhìn vào ống kính tổng kết bài học',
    dialogues: [
      {
        id: 'd7_1',
        speaker: 'Khang',
        text: 'Kính thưa quý thầy cô và các bạn, vừa rồi nhóm chúng em đã hoàn thành phần tóm tắt các kiến thức trọng tâm của Bài 8: Tế bào nhân thực trong sách giáo khoa Sinh học 10 bộ Kết nối tri thức với cuộc sống.',
        camera: { x: 50, y: 50, scale: 1.1, focusName: 'Khang hướng về ống kính' },
        duration: 10.5,
        khangPose: 'talking_to_camera',
        trongPose: 'smiling'
      },
      {
        id: 'd7_2',
        speaker: 'Trọng',
        text: 'Hôm nay được tham gia buổi hội giảng đặc biệt này, chúng em thực sự cảm thấy rất vinh dự và biết ơn sự dìu dắt, tận tụy của các thầy cô giáo.',
        camera: { x: 50, y: 50, scale: 1.1, focusName: 'Trọng tiếp lời chia sẻ' },
        duration: 8.5,
        khangPose: 'talking_to_camera',
        trongPose: 'smiling'
      }
    ]
  },
  {
    id: 8,
    title: 'Khang và Trọng đồng thanh chúc mừng ngày 20/11',
    dialogues: [
      {
        id: 'd8_1',
        speaker: 'Khang & Trọng',
        text: 'Hòa chung không khí tri ân của ngày Nhà giáo Việt Nam 20/11, chúng em xin kính chúc tất cả quý thầy cô có mặt trong buổi hội giảng hôm nay luôn dồi dào sức khỏe, ngập tràn niềm vui, hạnh phúc và luôn giữ trọn ngọn lửa nhiệt huyết trong sự nghiệp trồng người cao quý!',
        camera: { x: 50, y: 50, scale: 1.0, focusName: 'Khang & Trọng kính chúc thầy cô 20/11' },
        duration: 14.0,
        khangPose: 'celebrating',
        trongPose: 'celebrating'
      }
    ]
  }
];

export const AI_VIDEO_PROMPT_PRESETS = [
  {
    id: 'preset_scene_full',
    title: 'Kịch bản toàn cảnh: Khang & Trọng giảng giải Bài 8 Tế bào nhân thực',
    aspect: '16:9' as const,
    duration: '10s' as const,
    prompt: 'A cinematic high school biology classroom in Vietnam. Two neat Asian 10th-grade students named Khang and Trọng standing next to an illuminated 3D eukaryotic cell biological model on a science lab table. Khang enthusiastically gestures and points at the cell nucleus, cytoplasm, and cell membrane while explaining concepts to Trọng who nods with clear realization. Modern educational anime/3D realistic style, warm daylight streaming through classroom windows, high visual clarity, 4k detail.'
  },
  {
    id: 'preset_cell_zoom',
    title: 'Thu phóng cận cảnh: 3D Mô hình Tế bào nhân thực Bài 8',
    aspect: '16:9' as const,
    duration: '10s' as const,
    prompt: 'Hyper-detailed 3D scientific animation zooming smoothly into a cutaway eukaryotic cell. First showing the glowing plasma membrane bilayer, then sweeping into the cytoplasm with mitochondria producing ATP glow, green chloroplasts, endoplasmic reticulum, Golgi stacks, and ending at the large spherical double-membrane nucleus with chromatin fibers inside. Beautiful volumetric lighting, scientific documentary BBC quality, ultra-sharp 4K.'
  },
  {
    id: 'preset_tribute_2011',
    title: 'Cảnh kết: Khang & Trọng đồng thanh chúc mừng ngày 20/11',
    aspect: '16:9' as const,
    duration: '10s' as const,
    prompt: 'Two cheerful Vietnamese high school students, a boy named Khang and a boy named Trọng wearing crisp white school uniforms with red scarves or school badges, standing side-by-side in a decorated Vietnamese high school classroom. On the chalkboard behind them is written in beautiful chalk handwriting: "CHÚC MỪNG NGÀY NHÀ GIÁO VIỆT NAM 20/11 - HỘI GIẢNG SINH HỌC 10". Both students smile brightly at the camera, bow respectfully with hands together, festive colorful confetti and fresh flower bouquets on the teacher podium, bright joyful celebratory atmosphere.'
  },
  {
    id: 'preset_mobile_tiktok',
    title: 'Video dọc ngắn (9:16) Khang & Trọng giải thích nhanh',
    aspect: '9:16' as const,
    duration: '10s' as const,
    prompt: 'Vertical 9:16 format educational video clip. Two smart Vietnamese high school students Khang and Trọng presenting a biology lesson. In front of them floats a holographic 3D eukaryotic cell showing nucleus, mitochondria, and cell membrane. Friendly lively gestures, energetic teaching style, high quality studio lighting, crisp modern vertical aesthetic.'
  }
];
