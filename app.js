import { createLocalChat, sendMessage, subscribeMessages, requestDeleteMessage, undoDeleteMessage } from "./data/dataProvider.js";
import { renderChatList, renderMessages } from "./ui/ui.js";

const state = {
  currentChatId: "local-chat-1",
  messages: []
};

const form = document.getElementById("composer");
const input = document.getElementById("messageInput");

createLocalChat(state.currentChatId, "Prototype Chat");
renderChatList([{ id: state.currentChatId, title: "P" }]);

subscribeMessages(state.currentChatId, (messages) => {
  state.messages = messages;
  renderMessages(messages, {
    onDelete: (id) => requestDeleteMessage(state.currentChatId, id),
    onUndoDelete: (id) => undoDeleteMessage(state.currentChatId, id)
  });
});

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const text = input.value.trim();
  if (!text) return;

  sendMessage(state.currentChatId, {
    type: "text",
    text
  });

  input.value = "";
});
