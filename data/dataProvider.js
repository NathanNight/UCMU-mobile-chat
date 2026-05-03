import * as core from "../core/chatCore.js";

export function createLocalChat(chatId, title) {
  core.createLocalChat(chatId, title);
}

export function sendMessage(chatId, payload) {
  core.sendMessage(chatId, payload);
}

export function subscribeMessages(chatId, callback) {
  return core.subscribeMessages(chatId, callback);
}

export function requestDeleteMessage(chatId, messageId) {
  core.requestDeleteMessage(chatId, messageId);
}

export function undoDeleteMessage(chatId, messageId) {
  core.undoDeleteMessage(chatId, messageId);
}
