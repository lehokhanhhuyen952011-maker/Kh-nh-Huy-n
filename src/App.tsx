import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Video,
  Play,
  Pause,
  BookOpen,
  Sparkles,
  Heart,
  Download,
  School,
} from 'lucide-react';

import { SCENES, Organelle } from './data/cellData';
import {
  getTotalDuration,
  getPlaybackStateAtTime,
  getSceneStartTime,
  getDialogueStartTime,
} from './utils/timeline';
import { getVietnamesePronunciationText } from './utils/pronunciation';
import { soundEffects } from './utils/audioEffects';

import { CellVisualizer } from './components/CellVisualizer';
import { FullBodyCharacters } from './components/FullBodyCharacters';
import { SubtitleBar } from './components/SubtitleBar';
import { VideoPlayerControls } from './components/VideoPlayerControls';
import { AIVideoGenerator } from './components/AIVideoGenerator';
import { CellKnowledgeExplorer } from './components/CellKnowledgeExplorer';
import { TeacherDayTributeModal } from './components/TeacherDayTributeModal';
import { VideoExporterModal } from './components/VideoExporterModal';
import { CelebrationOverlay } from './components/CelebrationOverlay';

export default function App() {
  const [activeTab, setActiveTab] = useState<'video' | 'aigen' | 'explorer'>('video');
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [voiceEnabled, setVoiceEnabled] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [selectedOrganelleModal, setSelectedOrganelleModal] = useState<Organelle | null>(null);
  const [isTeacherDayModalOpen, setIsTeacherDayModalOpen] = useState<boolean>(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const lastSpokenDialogueIdRef = useRef<string>('');
  const isUtteranceActiveRef = useRef<boolean>(false);
  const totalDuration = getTotalDuration(SCENES);

  // Derive playback state from current time
  const playbackState = getPlaybackStateAtTime(SCENES, currentTime);
  const {
    currentScene,
    sceneIndex,
    currentDialogue,
    dialogueProgress,
    camera,
    activeHighlightId,
  } = playbackState;

  // Handle Autostart URL parameter ?autostart=1
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('autostart') === '1') {
      setIsPlaying(true);
    }
  }, []);

  // Text-to-Speech speaking function with Vietnamese voice and phonetic pronunciation
  const speakDialogue = useCallback((text: string, speaker: string) => {
    if (!('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();

      // Convert scientific terminology (Golgi, Lysosome, Ribosome, ATP, Phospholipid, etc.)
      // to clear Vietnamese phonetic syllables so pronunciation is crystal clear
      const phoneticText = getVietnamesePronunciationText(text);
      const utterance = new SpeechSynthesisUtterance(phoneticText);
      utterance.lang = 'vi-VN';

      // Pitch adjustment based on student speaker
      if (speaker === 'Khang') {
        utterance.pitch = 1.05;
        utterance.rate = 0.96 * playbackSpeed;
      } else if (speaker === 'Trọng') {
        utterance.pitch = 0.95;
        utterance.rate = 0.94 * playbackSpeed;
      } else {
        utterance.pitch = 1.0;
        utterance.rate = 0.95 * playbackSpeed;
      }

      const voices = window.speechSynthesis.getVoices();
      const viVoice = voices.find(v => v.lang.includes('vi') || v.lang.includes('VN'));
      if (viVoice) {
        utterance.voice = viVoice;
      }

      isUtteranceActiveRef.current = true;

      utterance.onend = () => {
        isUtteranceActiveRef.current = false;
      };

      utterance.onerror = () => {
        isUtteranceActiveRef.current = false;
      };

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('SpeechSynthesis error:', e);
      isUtteranceActiveRef.current = false;
    }
  }, [playbackSpeed]);

  // Synchronized Voice Trigger: Trigger speech only once per dialogue line
  useEffect(() => {
    if (isPlaying && voiceEnabled && currentDialogue.id !== lastSpokenDialogueIdRef.current) {
      lastSpokenDialogueIdRef.current = currentDialogue.id;
      speakDialogue(currentDialogue.text, currentDialogue.speaker);
    }
  }, [currentDialogue.id, currentDialogue.text, currentDialogue.speaker, isPlaying, voiceEnabled, speakDialogue]);

  // Main playback tick timer with Anti-Cutoff hold logic:
  // Ensures the current character finishes speaking their complete sentence before transitioning to next scene!
  useEffect(() => {
    if (!isPlaying) {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.pause();
      }
      return;
    }

    if ('speechSynthesis' in window && window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }

    const intervalMs = 60;
    const interval = setInterval(() => {
      // Browser SpeechSynthesis keep-alive
      if ('speechSynthesis' in window && window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }

      setCurrentTime((prev) => {
        const step = (intervalMs / 1000) * playbackSpeed;
        const nextTime = prev + step;

        // Check dialogue bounds
        const stateNow = getPlaybackStateAtTime(SCENES, prev);
        const dStart = getDialogueStartTime(SCENES, stateNow.sceneIndex, stateNow.dialogueIndex);
        const dEnd = dStart + stateNow.currentDialogue.duration;

        // If voice is enabled and character is actively speaking, wait at end of line
        // until utterance finishes speaking, preventing mid-sentence abrupt cutoffs!
        if (voiceEnabled && isUtteranceActiveRef.current && nextTime >= dEnd - 0.05) {
          return dEnd - 0.05;
        }

        if (nextTime >= totalDuration) {
          setIsPlaying(false);
          setIsTeacherDayModalOpen(true);
          return totalDuration;
        }
        return nextTime;
      });
    }, intervalMs);

    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed, totalDuration, voiceEnabled]);

  // Video playback control handlers
  const handleTogglePlay = () => {
    if (currentTime >= totalDuration) {
      setCurrentTime(0);
      lastSpokenDialogueIdRef.current = '';
      setIsPlaying(true);
    } else {
      setIsPlaying((prev) => !prev);
    }
  };

  const handleSeek = (time: number) => {
    setCurrentTime(time);
    lastSpokenDialogueIdRef.current = '';
    isUtteranceActiveRef.current = false;
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  const handleRestart = () => {
    setCurrentTime(0);
    setIsPlaying(true);
    lastSpokenDialogueIdRef.current = '';
    isUtteranceActiveRef.current = false;
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  const handleNextScene = () => {
    if (sceneIndex < SCENES.length - 1) {
      const nextTime = getSceneStartTime(SCENES, sceneIndex + 1);
      handleSeek(nextTime);
    }
  };

  const handlePrevScene = () => {
    if (sceneIndex > 0) {
      const prevTime = getSceneStartTime(SCENES, sceneIndex - 1);
      handleSeek(prevTime);
    } else {
      handleSeek(0);
    }
  };

  const handleSelectScene = (index: number) => {
    const targetTime = getSceneStartTime(SCENES, index);
    handleSeek(targetTime);
  };

  const handleToggleVoice = () => {
    setVoiceEnabled((prev) => {
      const next = !prev;
      if (!next && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        isUtteranceActiveRef.current = false;
      }
      return next;
    });
  };

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-sky-500 selection:text-white"
    >
      {/* 1. TOP APP HEADER */}
      <header className="border-b border-slate-800/80 bg-slate-900/90 backdrop-blur-md sticky top-0 z-40 px-3 md:px-8 py-2.5 md:py-3 flex flex-wrap items-center justify-between gap-2 md:gap-4">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-gradient-to-tr from-sky-500 via-indigo-500 to-rose-500 p-0.5 shadow-lg shadow-sky-500/20 shrink-0 flex items-center justify-center">
            <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
              <School className="w-4 h-4 md:w-5 md:h-5 text-sky-400" />
            </div>
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-xs md:text-base font-bold text-white tracking-tight truncate">
                Khang & Trọng: Tế Bào Nhân Thực
              </h1>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 text-[10px] font-mono border border-sky-500/30 font-semibold">
                Bài 8 Kết Nối Tri Thức
              </span>
            </div>
            <p className="text-[10px] md:text-[11px] text-slate-400 truncate">
              Mô hình 3 thành phần chính • Hội giảng 20/11 • Tải file video MP4
            </p>
          </div>
        </div>

        {/* Tab Switcher & Export MP4 Quick Button */}
        <div className="flex items-center gap-1.5 ml-auto">
          <button
            onClick={() => setIsExportModalOpen(true)}
            aria-label="Tải file video MP4 HD"
            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-600/30 transition active:scale-95"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Tải Video MP4 HD</span>
            <span className="xs:hidden">MP4 HD</span>
          </button>

          <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700/60">
            <button
              onClick={() => setActiveTab('video')}
              aria-label="Xem Video & Tế bào 3D"
              className={`px-2.5 md:px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
                activeTab === 'video'
                  ? 'bg-sky-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Video & Tế bào 3D</span>
              <span className="sm:hidden">Video</span>
            </button>

            <button
              onClick={() => setActiveTab('aigen')}
              aria-label="Tạo video AI bằng Gemini Omni Flash"
              className={`px-2.5 md:px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
                activeTab === 'aigen'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
              <span className="hidden sm:inline">Tạo Video AI</span>
              <span className="sm:hidden">Video AI</span>
            </button>

            <button
              onClick={() => setActiveTab('explorer')}
              aria-label="Khám phá kiến thức sách giáo khoa Bài 8"
              className={`px-2.5 md:px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
                activeTab === 'explorer'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Kiến Thức Bài 8</span>
              <span className="sm:hidden">Bài 8</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. MAIN BODY CONTENT */}
      <main className="flex-1 flex flex-col">
        {/* TAB 1: INTERACTIVE CINEMATIC VIDEO THEATER */}
        {activeTab === 'video' && (
          <div className="flex-1 flex flex-col">
            {/* STAGE SCREEN (Unobstructed view of model, pointer & characters) */}
            <div className="relative flex-1 min-h-[460px] md:min-h-[520px] flex flex-col justify-between overflow-hidden">
              {/* Biological Cell Model in Center with Camera Zoom */}
              <div className="absolute inset-0 z-0">
                <CellVisualizer
                  camera={camera}
                  activeHighlightId={activeHighlightId}
                  onSelectOrganelle={(org) => setSelectedOrganelleModal(org)}
                />
              </div>

              {/* Full Body Characters (Khang & Trọng standing & interacting with speech balloons above) */}
              <FullBodyCharacters
                currentDialogue={currentDialogue}
                isPlaying={isPlaying}
                sceneId={currentScene.id}
              />

              {/* Celebration Overlay on Scene 8 with falling petals, fanfare & crowd applause */}
              <CelebrationOverlay
                isVisible={currentScene.id === 8}
                onOpenModal={() => setIsTeacherDayModalOpen(true)}
              />

              {/* Top Right Celebration Button (Non-intrusive, no scene title banner) */}
              <div className="relative z-10 p-3 md:p-4 pointer-events-none flex items-center justify-end">
                <button
                  onClick={() => setIsTeacherDayModalOpen(true)}
                  aria-label="Xem lời chúc 20/11 hội giảng"
                  className="pointer-events-auto px-3.5 py-1.5 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-semibold flex items-center gap-1.5 hover:bg-rose-500/30 transition shadow-lg active:scale-95 shrink-0"
                >
                  <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
                  <span>Chúc mừng 20/11</span>
                </button>
              </div>
            </div>

            {/* Subtitles Bar Docked Below the Stage (Completely outside visual canvas) */}
            <SubtitleBar
              currentDialogue={currentDialogue}
              dialogueProgress={dialogueProgress}
            />

            {/* Video Controls Timeline at bottom */}
            <VideoPlayerControls
              currentTime={currentTime}
              totalDuration={totalDuration}
              isPlaying={isPlaying}
              onTogglePlay={handleTogglePlay}
              onSeek={handleSeek}
              onRestart={handleRestart}
              onNextScene={handleNextScene}
              onPrevScene={handlePrevScene}
              scenes={SCENES}
              currentSceneIndex={sceneIndex}
              onSelectScene={handleSelectScene}
              playbackSpeed={playbackSpeed}
              onChangeSpeed={setPlaybackSpeed}
              isFullscreen={isFullscreen}
              onToggleFullscreen={handleToggleFullscreen}
              voiceEnabled={voiceEnabled}
              onToggleVoice={handleToggleVoice}
              onOpenTeacherDayModal={() => setIsTeacherDayModalOpen(true)}
              onOpenExportModal={() => setIsExportModalOpen(true)}
            />
          </div>
        )}

        {/* TAB 2: AI VIDEO GENERATOR (GEMINI OMNI FLASH 1.2 VIA INTERACTIONS API) */}
        {activeTab === 'aigen' && (
          <div className="flex-1 py-6">
            <AIVideoGenerator />
          </div>
        )}

        {/* TAB 3: CELL KNOWLEDGE EXPLORER (TEXTBOOK ALIGNED) */}
        {activeTab === 'explorer' && (
          <div className="flex-1 py-6">
            <CellKnowledgeExplorer
              onSelectOrganelle={(org) => setSelectedOrganelleModal(org)}
            />
          </div>
        )}
      </main>

      {/* ORGANELLE DETAILS MODAL */}
      {selectedOrganelleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <span
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: selectedOrganelleModal.color }}
                />
                <h3 className="text-base font-bold text-white">
                  {selectedOrganelleModal.name}
                </h3>
              </div>

              <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                {selectedOrganelleModal.membraneType === 'double'
                  ? 'Màng kép'
                  : selectedOrganelleModal.membraneType === 'single'
                  ? 'Màng đơn'
                  : 'Không màng'}
              </span>
            </div>

            <div className="space-y-3 text-xs md:text-sm text-slate-300">
              <p>
                <strong className="text-white">Cấu tạo: </strong>
                {selectedOrganelleModal.structure}
              </p>
              <p>
                <strong className="text-white">Chức năng sinh học: </strong>
                {selectedOrganelleModal.functionDesc}
              </p>
              <p>
                <strong className="text-white">Vị trí: </strong>
                {selectedOrganelleModal.location}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
              <button
                onClick={() => {
                  setSelectedOrganelleModal(null);
                  setActiveTab('video');
                }}
                className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs transition"
              >
                Xem trên mô hình
              </button>
              <button
                onClick={() => setSelectedOrganelleModal(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SPECIAL 20/11 TEACHER'S DAY CELEBRATION MODAL */}
      <TeacherDayTributeModal
        isOpen={isTeacherDayModalOpen}
        onClose={() => setIsTeacherDayModalOpen(false)}
        onPlayGreetingVoice={() => {
          speakDialogue(
            'Nhân ngày Nhà giáo Việt Nam 20/11, chúng em xin kính chúc tất cả quý thầy cô có mặt trong buổi hội giảng hôm nay luôn dồi dào sức khỏe, thật nhiều niềm vui, luôn hạnh phúc và gặt hái nhiều thành công rực rỡ trong sự nghiệp trồng người cao quý!',
            'Cả hai'
          );
        }}
      />

      {/* VIDEO MP4 EXPORTER MODAL */}
      <VideoExporterModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
      />
    </div>
  );
}
