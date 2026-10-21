// node --test worker/: the copy guard (SOLUTIONS-SPEC §8 T3)
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { guard, stripMoney } from './guard.js';

test('Uzbek okina and tutuq', () => {
  assert.equal(guard("o'quv markazi", 'uz'), 'oʻquv markazi');
  assert.equal(guard('g‘alla', 'uz'), 'gʻalla');
  assert.equal(guard("ta'lim", 'uz'), 'taʼlim');
  assert.equal(guard('Oʼzbekiston', 'uz'), 'Oʻzbekiston');
});
test('yarat- becomes qur- in every language, keeping case and suffix', () => {
  assert.equal(guard('Biz yaratamiz', 'uz'), 'Biz quramiz');
  assert.equal(guard('Yaratilgan tizim', 'uz'), 'Qurilgan tizim');
  assert.equal(guard('yaratish', 'ru'), 'qurish');
  assert.equal(guard('яратиш', 'uz'), 'қуриш');
});
test('handles, links, t.me, emoji and other phone numbers are removed; Qilich’s own contact stays', () => {
  assert.equal(guard('Yozing @someone bugun', 'uz'), 'Yozing bugun');
  assert.equal(guard('Kanal t.me/x orqali', 'uz'), 'Kanal orqali');
  assert.equal(guard('Bot 🙂 tayyor', 'uz'), 'Bot tayyor');
  assert.equal(guard('see https://example.com now', 'en'), 'see now');
  assert.equal(guard('inbox@qilich.com yoki other@mail.ru', 'uz'), 'inbox@qilich.com yoki');
  assert.equal(guard('call +998 90 123 45 67', 'en'), 'call');
});
test('dashes: ru NBSP before —, en " — " → ", "', () => {
  assert.equal(guard('Бот — для заказов', 'ru'), 'Бот\u00a0— для заказов');
  assert.equal(guard('A bot — for orders', 'en'), 'A bot, for orders');
});
test('product names never pass; buzzwords are replaced in English', () => {
  const name = ['tl', 'goh'].map((x) => [...x].reverse().join('')).reverse().join('');
  assert.equal(guard(`like ${name} app`, 'en'), 'like app');
  assert.equal(guard('A seamless and innovative bot', 'en'), 'A smooth and new bot');
});
test('Japanese keeps kana and kanji; other pages drop them', () => {
  assert.equal(guard('予約ボットを開発します。', 'ja'), '予約ボットを開発します。');
  assert.equal(guard('bot 予約', 'en'), 'bot');
});
test('a sentence with money the visitor did not write is dropped', () => {
  assert.equal(stripMoney('Bot kerak. Narxi $1 boʻladi.', 'menga bot kerak'), 'Bot kerak.');
  assert.equal(stripMoney('Byudjet 40 mln. Bot kerak.', 'byudjet 40 mln'), 'Byudjet 40 mln. Bot kerak.');
});
test('the lint and the Worker share worker/copy-rules.js', () => {
  assert.match(readFileSync(new URL('../scripts/lint-copy.mjs', import.meta.url), 'utf8'), /from '\.\.\/worker\/copy-rules\.js'/);
  assert.match(readFileSync(new URL('./guard.js', import.meta.url), 'utf8'), /from '\.\/copy-rules\.js'/);
});
