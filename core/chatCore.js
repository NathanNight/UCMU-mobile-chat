const chats = new Map();
const listeners = new Map();
const deleteTimers = new Map();

export function createLocalChat(chatId, title) {
  if (chats.has(chatId)) return;

  chats.set(chatId, {
    id: chatId,
    title,
    messages: []
  });
}

export function sendMessage(chatId, payload) {
  const chat = chats.get(chatId);
  if (!chat) throw new Error("Chat not found");

  const message = {
    id: crypto.randomUUID(),
    type: payload.type || "text",
    text: payload.text || "",
    createdAt: Date.now(),
    pendingDelete: false
  };

  chat.messages.push(message);
  emit(chatId);
}

export function subscribeMessages(chatId, callback) {
  if (!listeners.has(chatId)) listeners.set(chatId, new Set());

  listeners.get(chatId).add(callback);
  callback(getMessages(chatId));

  return () => listeners.get(chatId)?.delete(callback);
}

export function requestDeleteMessage(chatId, messageId) {
  const chat = chats.get(chatId);
  if (!chat) return;

  const message = chat.messages.find((item) => item.id === messageId);
  if (!message || message.pendingDelete) return;

  message.pendingDelete = true;
  emit(chatId);

  const key = `${chatId}:${messageId}`;
  const timer = setTimeout(() => {
    hardDeleteMessage(chatId, messageId);
    deleteTimers.delete(key);
  }, 3000);

  deleteTimers.set(key, timer);
}

export function undoDeleteMessage(chatId, messageId) {
  const key = `${chatId}:${messageId}`;
  const timer = deleteTimers.get(key);

  if (timer) {
    clearTimeout(timer);
    deleteTimers.delete(key);
  }

  const chat = chats.get(chatId);
  if (!chat) return;

  const message = chat.messages.find((item) => item.id === messageId);
  if (!message) return;

  message.pendingDelete = false;
  emit(chatId);
}

function hardDeleteMessage(chatId, messageId) {
  const chat = chats.get(chatId);
  if (!chat) return;

  chat.messages = chat.messages.filter((item) => item.id !== messageId);
  emit(chatId);
}

function getMessages(chatId) {
  return [...(chats.get(chatId)?.messages || [])];
}

function emit(chatId) {
  const snapshot = getMessages(chatId);
  listeners.get(chatId)?.forEach((callback) => callback(snapshot));
}
