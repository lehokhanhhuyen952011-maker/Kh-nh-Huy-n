import { Scene, DialogueLine, ORGANELLES, Organelle } from '../data/cellData';

export interface CameraState {
  x: number;
  y: number;
  scale: number;
  focusName: string;
}

export function getSceneDuration(scene: Scene): number {
  return scene.dialogues.reduce((acc, d) => acc + d.duration, 0);
}

export function getTotalDuration(scenes: Scene[]): number {
  return scenes.reduce((acc, scene) => acc + getSceneDuration(scene), 0);
}

export function formatTime(seconds: number): string {
  const rounded = Math.max(0, Math.floor(seconds));
  const mins = Math.floor(rounded / 60);
  const secs = rounded % 60;
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

export function calculateProgress(currentTime: number, totalDuration: number): number {
  if (totalDuration <= 0) return 0;
  const clamped = Math.max(0, Math.min(currentTime, totalDuration));
  return Math.round((clamped / totalDuration) * 1000) / 10;
}

export interface PlaybackState {
  sceneIndex: number;
  currentScene: Scene;
  dialogueIndex: number;
  currentDialogue: DialogueLine;
  sceneTime: number;
  dialogueProgress: number; // 0 to 1 for the current line
  camera: CameraState;
  activeHighlightId?: string;
  isEnd: boolean;
}

export function getPlaybackStateAtTime(scenes: Scene[], currentTime: number): PlaybackState {
  if (!scenes.length) {
    throw new Error('Scenes array cannot be empty');
  }

  let accumulated = 0;

  for (let sIdx = 0; sIdx < scenes.length; sIdx++) {
    const scene = scenes[sIdx];
    const sDuration = getSceneDuration(scene);
    const sceneEnd = accumulated + sDuration;

    if (currentTime < sceneEnd || sIdx === scenes.length - 1) {
      let dAccum = accumulated;
      let dIdx = 0;
      let targetDialogue = scene.dialogues[0];

      for (let i = 0; i < scene.dialogues.length; i++) {
        const d = scene.dialogues[i];
        const dEnd = dAccum + d.duration;
        if (currentTime < dEnd || i === scene.dialogues.length - 1) {
          dIdx = i;
          targetDialogue = d;
          break;
        }
        dAccum = dEnd;
      }

      const dialogueElapsed = Math.max(0, currentTime - dAccum);
      const dialogueProgress = Math.min(1, dialogueElapsed / targetDialogue.duration);
      const sceneTime = Math.max(0, currentTime - accumulated);

      return {
        sceneIndex: sIdx,
        currentScene: scene,
        dialogueIndex: dIdx,
        currentDialogue: targetDialogue,
        sceneTime,
        dialogueProgress,
        camera: targetDialogue.camera,
        activeHighlightId: targetDialogue.highlightPartId,
        isEnd: currentTime >= getTotalDuration(scenes)
      };
    }

    accumulated = sceneEnd;
  }

  const lastScene = scenes[scenes.length - 1];
  const lastDialogue = lastScene.dialogues[lastScene.dialogues.length - 1];
  return {
    sceneIndex: scenes.length - 1,
    currentScene: lastScene,
    dialogueIndex: lastScene.dialogues.length - 1,
    currentDialogue: lastDialogue,
    sceneTime: getSceneDuration(lastScene),
    dialogueProgress: 1,
    camera: lastDialogue.camera,
    activeHighlightId: lastDialogue.highlightPartId,
    isEnd: true
  };
}

export function findOrganelleById(id: string): Organelle | undefined {
  return ORGANELLES.find(o => o.id === id);
}

export function filterOrganellesByCategory(category: Organelle['category']): Organelle[] {
  return ORGANELLES.filter(o => o.category === category);
}

export function getSceneStartTime(scenes: Scene[], targetSceneIndex: number): number {
  let time = 0;
  for (let i = 0; i < Math.min(targetSceneIndex, scenes.length); i++) {
    time += getSceneDuration(scenes[i]);
  }
  return time;
}

export function getDialogueStartTime(scenes: Scene[], sceneIndex: number, dialogueIndex: number): number {
  let time = getSceneStartTime(scenes, sceneIndex);
  const targetScene = scenes[sceneIndex];
  if (targetScene) {
    for (let i = 0; i < Math.min(dialogueIndex, targetScene.dialogues.length); i++) {
      time += targetScene.dialogues[i].duration;
    }
  }
  return time;
}
