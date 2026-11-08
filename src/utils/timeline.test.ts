import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getTotalDuration,
  getSceneDuration,
  formatTime,
  calculateProgress,
  getPlaybackStateAtTime,
  findOrganelleById,
  filterOrganellesByCategory,
  getSceneStartTime,
  getDialogueStartTime
} from './timeline';
import { SCENES } from '../data/cellData';

test('getTotalDuration sums all dialogues accurately', () => {
  const total = getTotalDuration(SCENES);
  assert.equal(typeof total, 'number');
  assert.ok(total > 100, 'Total video duration should be greater than 100s');

  const scene0Duration = getSceneDuration(SCENES[0]);
  assert.equal(scene0Duration, SCENES[0].dialogues[0].duration + SCENES[0].dialogues[1].duration);
});

test('formatTime formats seconds into mm:ss accurately', () => {
  assert.equal(formatTime(0), '0:00');
  assert.equal(formatTime(9), '0:09');
  assert.equal(formatTime(65), '1:05');
  assert.equal(formatTime(130), '2:10');
  assert.equal(formatTime(-5), '0:00');
});

test('calculateProgress calculates accurate percentage clamped between 0 and 100', () => {
  assert.equal(calculateProgress(0, 100), 0);
  assert.equal(calculateProgress(50, 100), 50);
  assert.equal(calculateProgress(100, 100), 100);
  assert.equal(calculateProgress(150, 100), 100);
  assert.equal(calculateProgress(-10, 100), 0);
});

test('getPlaybackStateAtTime tracks dialogue-level progression and character poses', () => {
  const state0 = getPlaybackStateAtTime(SCENES, 0);
  assert.equal(state0.sceneIndex, 0);
  assert.equal(state0.dialogueIndex, 0);
  assert.equal(state0.currentDialogue.speaker, 'Trọng');
  assert.equal(state0.currentDialogue.trongPose, 'confused');

  // Advance time past dialogue 1
  const tD2 = SCENES[0].dialogues[0].duration + 1;
  const state1 = getPlaybackStateAtTime(SCENES, tD2);
  assert.equal(state1.sceneIndex, 0);
  assert.equal(state1.dialogueIndex, 1);
  assert.equal(state1.currentDialogue.speaker, 'Trọng');
});

test('getDialogueStartTime and getSceneStartTime return monotonic timestamps', () => {
  const s0 = getSceneStartTime(SCENES, 0);
  const s1 = getSceneStartTime(SCENES, 1);
  assert.equal(s0, 0);
  assert.ok(s1 > 0);

  const d0 = getDialogueStartTime(SCENES, 0, 0);
  const d1 = getDialogueStartTime(SCENES, 0, 1);
  assert.equal(d0, 0);
  assert.equal(d1, SCENES[0].dialogues[0].duration);
});

test('findOrganelleById returns Vietnamese structure and function without foreign names', () => {
  const nucleus = findOrganelleById('nucleus');
  assert.ok(nucleus);
  assert.equal(nucleus?.name, 'Nhân tế bào');
  assert.equal(nucleus?.category, 'main');
  assert.equal((nucleus as any).latinName, undefined);

  const mito = findOrganelleById('mitochondria');
  assert.ok(mito);
  assert.equal(mito?.name, 'Ti thể');
  assert.equal((mito as any).latinName, undefined);
});
