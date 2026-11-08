import React, { useState } from 'react';
import {
  BookOpen,
  CheckCircle,
  HelpCircle,
  Sparkles,
  Layers,
  Search,
  ChevronRight,
  Shield,
  Zap,
  Cpu
} from 'lucide-react';
import { ORGANELLES, MAIN_PARTS_SUMMARY, Organelle } from '../data/cellData';

interface CellKnowledgeExplorerProps {
  onSelectOrganelle?: (organelle: Organelle) => void;
}

export const CellKnowledgeExplorer: React.FC<CellKnowledgeExplorerProps> = ({
  onSelectOrganelle,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'components' | 'comparison' | 'quiz'>('components');

  // Quiz state
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  const QUIZ_QUESTIONS = [
    {
      question: 'Tế bào nhân thực gồm những thành phần chính nào?',
      options: [
        'A. Vỏ nhầy, thành tế bào và vùng nhân',
        'B. Màng sinh chất, tế bào chất và nhân tế bào',
        'C. Màng sinh chất, chất tế bào và vùng nhân chưa có màng',
        'D. Thành tế bào, lục lạp và không bào lớn'
      ],
      correct: 1,
      explanation: 'Tế bào nhân thực luôn có 3 thành phần chính: Màng sinh chất, Tế bào chất và Nhân tế bào (đã có màng nhân bao bọc hoàn chỉnh).'
    },
    {
      question: 'Ở tế bào thực vật và nấm, bên ngoài màng sinh chất còn có thêm cấu trúc nào?',
      options: [
        'A. Chất nền ngoại bào',
        'B. Lớp vỏ nhầy',
        'C. Thành tế bào (cấu tạo từ xenlulôzơ hoặc kitin)',
        'D. Màng nhân kép'
      ],
      correct: 2,
      explanation: 'Ở tế bào thực vật có thành tế bào bằng xenlulôzơ, còn ở nấm là kitin giúp bảo vệ và duy trì hình dạng ổn định cho tế bào.'
    },
    {
      question: 'Bào quan nào được ví như "nhà máy năng lượng" tổng hợp phần lớn phân tử ATP của tế bào?',
      options: [
        'A. Bộ máy Gôn-gi',
        'B. Lưới nội chất trơn',
        'C. Ti thể',
        'D. Ri-bô-xôm'
      ],
      correct: 2,
      explanation: 'Ti thể có màng kép với màng trong gấp nếp chứa các enzym hô hấp tế bào, phân giải chất hữu cơ tổng hợp ATP cung cấp năng lượng.'
    },
    {
      question: 'Cấu trúc nào trong tế bào nhân thực KHÔNG có màng bao bọc?',
      options: [
        'A. Ri-bô-xôm và Khung xương tế bào',
        'B. Ti thể và Lục lạp',
        'C. Li-xô-xôm và Bộ máy Gôn-gi',
        'D. Lưới nội chất hạt và trơn'
      ],
      correct: 0,
      explanation: 'Ri-bô-xôm (cấu tạo từ rARN + prôtêin) và khung xương tế bào (vi ống, vi sợi) là các cấu trúc không có màng bao bọc.'
    },
    {
      question: 'Chức năng cốt lõi của Nhân tế bào là gì?',
      options: [
        'A. Hấp thụ năng lượng mặt trời để quang hợp',
        'B. Đóng gói và xuất khẩu các chất tiết ra ngoài',
        'C. Trung tâm chỉ huy điều khiển mọi hoạt động sống và lưu trữ, truyền đạt thông tin di truyền',
        'D. Tiêu hóa nội bào và phân hủy bào quan già'
      ],
      correct: 2,
      explanation: 'Nhân chứa chất nhiễm sắc mang phân tử ADN, đóng vai trò là "bộ não" điều khiển mọi hoạt động trao đổi chất và duy trì di truyền.'
    }
  ];

  const filteredOrganelles = ORGANELLES.filter((item) => {
    const matchesCategory =
      selectedCategory === 'all' ||
      (selectedCategory === 'main' && item.category === 'main') ||
      (selectedCategory === 'double' && item.membraneType === 'double') ||
      (selectedCategory === 'single' && item.membraneType === 'single') ||
      (selectedCategory === 'none' && item.membraneType === 'none');

    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.functionDesc.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.structure.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const handleAnswer = (idx: number) => {
    if (showAnswer) return;
    setSelectedAnswer(idx);
    setShowAnswer(true);
    if (idx === QUIZ_QUESTIONS[currentQuestionIdx].correct) {
      setQuizScore((prev) => prev + 1);
    }
  };

  const nextQuestion = () => {
    setSelectedAnswer(null);
    setShowAnswer(false);
    if (currentQuestionIdx < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestionIdx((prev) => prev + 1);
    } else {
      setCurrentQuestionIdx(0);
      setQuizScore(0);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4 md:p-6 space-y-6 text-slate-100">
      {/* 3 THÀNH PHẦN CHÍNH HIGHLIGHT BANNER */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {MAIN_PARTS_SUMMARY.map((part, idx) => (
          <div
            key={part.id}
            className={`p-4 rounded-2xl border transition-all backdrop-blur-md shadow-lg ${
              idx === 0
                ? 'bg-sky-950/40 border-sky-500/30 hover:border-sky-500/60'
                : idx === 1
                ? 'bg-indigo-950/40 border-indigo-500/30 hover:border-indigo-500/60'
                : 'bg-rose-950/40 border-rose-500/30 hover:border-rose-500/60'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                {part.type}
              </span>
              {idx === 0 && <Shield className="w-4 h-4 text-sky-400" />}
              {idx === 1 && <Zap className="w-4 h-4 text-indigo-400" />}
              {idx === 2 && <Cpu className="w-4 h-4 text-rose-400" />}
            </div>
            <h3 className="text-base font-bold text-white mb-2">
              {part.name}
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-3">
              {part.description}
            </p>
            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300">
              <strong className="text-white">Chức năng:</strong> {part.keyFunction}
            </div>
            <p className="mt-2 text-[11px] text-slate-400 italic">
              📌 {part.subNotes}
            </p>
          </div>
        ))}
      </div>

      {/* NAVIGATION TABS */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('components')}
          aria-label="Danh mục bào quan và cấu trúc"
          className={`px-4 py-2 rounded-xl text-xs md:text-sm font-semibold transition flex items-center gap-2 ${
            activeTab === 'components'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Hệ Thống Bào Quan Bài 8</span>
        </button>

        <button
          onClick={() => setActiveTab('comparison')}
          aria-label="So sánh tế bào thực vật và động vật"
          className={`px-4 py-2 rounded-xl text-xs md:text-sm font-semibold transition flex items-center gap-2 ${
            activeTab === 'comparison'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>So Sánh Tế Bào Thực Vật & Động Vật</span>
        </button>

        <button
          onClick={() => setActiveTab('quiz')}
          aria-label="Câu hỏi trắc nghiệm củng cố bài 8"
          className={`px-4 py-2 rounded-xl text-xs md:text-sm font-semibold transition flex items-center gap-2 ${
            activeTab === 'quiz'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>Củng Cố Kiến Thức (Trắc nghiệm)</span>
        </button>
      </div>

      {/* TAB 1: BÀO QUAN EXPLORER */}
      {activeTab === 'components' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm kiếm cấu trúc (Ti thể, Nhân, Ri-bô-xôm, Gôn-gi...)"
                aria-label="Tìm kiếm bào quan"
                className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              {[
                { id: 'all', label: 'Tất cả' },
                { id: 'main', label: '3 Phần chính' },
                { id: 'double', label: 'Màng kép' },
                { id: 'single', label: 'Màng đơn' },
                { id: 'none', label: 'Không màng' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  aria-label={`Lọc theo ${cat.label}`}
                  className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition ${
                    selectedCategory === cat.id
                      ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                      : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredOrganelles.map((organelle) => (
              <div
                key={organelle.id}
                onClick={() => onSelectOrganelle?.(organelle)}
                className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 hover:bg-slate-900/90 transition cursor-pointer space-y-2 group shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: organelle.color }}
                    />
                    <h4 className="text-sm font-bold text-white group-hover:text-sky-300 transition">
                      {organelle.name}
                    </h4>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    {organelle.membraneType === 'double'
                      ? 'Màng kép'
                      : organelle.membraneType === 'single'
                      ? 'Màng đơn'
                      : 'Không màng'}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  <strong className="text-slate-200">Cấu tạo: </strong> {organelle.structure}
                </p>

                <p className="text-xs text-slate-300 leading-relaxed">
                  <strong className="text-slate-200">Chức năng: </strong> {organelle.functionDesc}
                </p>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Vị trí: {organelle.location}</span>
                  <span className="text-sky-400 flex items-center gap-1 group-hover:translate-x-0.5 transition font-medium">
                    Xem mô hình <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: SO SÁNH THỰC VẬT & ĐỘNG VẬT */}
      {activeTab === 'comparison' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 overflow-x-auto shadow-xl">
          <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-400" />
            Bảng Phân Biệt Tế Bào Động Vật & Tế Bào Thực Vật (SGK Sinh học 10)
          </h3>
          <p className="text-xs text-slate-400 mb-4">
            Cả hai đều là tế bào nhân thực nhưng có những đặc điểm thích nghi chuyên hóa riêng biệt.
          </p>

          <table className="w-full text-left text-xs text-slate-300 border-collapse min-w-[550px]">
            <thead>
              <tr className="border-b border-slate-700 bg-slate-800/50">
                <th className="p-3 font-bold text-white">Đặc Điểm So Sánh</th>
                <th className="p-3 font-bold text-emerald-300">Tế Bào Thực Vật</th>
                <th className="p-3 font-bold text-amber-300">Tế Bào Động Vật</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              <tr>
                <td className="p-3 font-semibold text-slate-200">Thành tế bào</td>
                <td className="p-3 text-emerald-400">Có (cấu tạo từ sợi xenlulôzơ)</td>
                <td className="p-3 text-slate-500">Không có (có chất nền ngoại bào)</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-slate-200">Lục lạp</td>
                <td className="p-3 text-emerald-400">Có (chứa diệp lục để quang hợp)</td>
                <td className="p-3 text-slate-500">Không có</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-slate-200">Không bào trung tâm</td>
                <td className="p-3 text-emerald-400">Có 1 không bào lớn ở trung tâm</td>
                <td className="p-3 text-slate-300">Không có hoặc chỉ có các không bào nhỏ tạm thời</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-slate-200">Trung thể</td>
                <td className="p-3 text-slate-500">Không có (trừ thực vật bậc thấp)</td>
                <td className="p-3 text-amber-400">Có (gồm 2 trung tử hình thành thoi phân bào)</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-slate-200">Li-xô-xôm</td>
                <td className="p-3 text-slate-500">Hiếm gặp (không bào đảm nhiệm chức năng này)</td>
                <td className="p-3 text-amber-400">Phổ biến (tiêu hóa nội bào)</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-slate-200">Hình dạng tế bào</td>
                <td className="p-3 text-slate-300">Cố định, thường có hình đa giác hoặc chữ nhật</td>
                <td className="p-3 text-slate-300">Mềm dẻo, thay đổi theo chức năng</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 3: QUIZ CỦNG CỐ BÀI 8 */}
      {activeTab === 'quiz' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 md:p-6 shadow-xl max-w-2xl mx-auto space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
              Câu hỏi {currentQuestionIdx + 1} / {QUIZ_QUESTIONS.length}
            </span>
            <span className="text-xs font-mono bg-slate-800 px-2.5 py-1 rounded-lg text-slate-300">
              Điểm số: {quizScore}
            </span>
          </div>

          <h4 className="text-base font-bold text-white leading-snug">
            {QUIZ_QUESTIONS[currentQuestionIdx].question}
          </h4>

          <div className="space-y-2 pt-2">
            {QUIZ_QUESTIONS[currentQuestionIdx].options.map((option, idx) => {
              const isSelected = selectedAnswer === idx;
              const isCorrect = idx === QUIZ_QUESTIONS[currentQuestionIdx].correct;

              let btnClass = 'bg-slate-800/60 border-slate-700 text-slate-200 hover:bg-slate-800';
              if (showAnswer) {
                if (isCorrect) {
                  btnClass = 'bg-emerald-950/60 border-emerald-500 text-emerald-200 font-semibold';
                } else if (isSelected) {
                  btnClass = 'bg-red-950/60 border-red-500 text-red-200';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleAnswer(idx)}
                  disabled={showAnswer}
                  aria-label={option}
                  className={`w-full p-3 rounded-xl border text-left text-xs md:text-sm transition flex items-center justify-between ${btnClass}`}
                >
                  <span>{option}</span>
                  {showAnswer && isCorrect && <CheckCircle className="w-4 h-4 text-emerald-400" />}
                </button>
              );
            })}
          </div>

          {showAnswer && (
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-1.5 animate-fadeIn">
              <strong className="text-indigo-300">Giải thích chi tiết:</strong>
              <p>{QUIZ_QUESTIONS[currentQuestionIdx].explanation}</p>
              <button
                onClick={nextQuestion}
                aria-label="Chuyển câu tiếp theo"
                className="mt-3 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition"
              >
                {currentQuestionIdx < QUIZ_QUESTIONS.length - 1 ? 'Câu tiếp theo' : 'Làm lại từ đầu'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
