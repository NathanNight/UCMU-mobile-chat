const chatListEl = document.getElementById("chatList");
const messagesEl = document.getElementById("messages");

export function renderChatList(chats) {
  chatListEl.innerHTML = chats.map((chat) => (
    `<button class="chat-tab" type="button" data-chat-id="${chat.id}">${escapeHtml(chat.title)}</button>`
  )).join("");
}

export function renderMessages(messages, handlers) {
  messagesEl.innerHTML = messages.map((message) => {
    const time = new Date(message.createdAt).toLocaleTimeString("ru-RU", {
      hour: "2-digit",
      minute: "2-digit"
    });

    return `
      <article class="message ${message.pendingDelete ? "pending-delete" : ""}" data-message-id="${message.id}">
        <div>${escapeHtml(message.text)}</div>
        <div class="meta">
          ${time}
          ${
            message.pendingDelete
              ? `<button class="undo-delete" data-action="undo" data-id="${message.id}" type="button">вернуть</button><span class="delete-bar"></span>`
              : `<button class="undo-delete" data-action="delete" data-id="${message.id}" type="button">удалить</button>`
          }
        </div>
      </article>
    `;
  }).join("");

  messagesEl.querySelectorAll("[data-action='delete']").forEach((button) => {
    button.addEventListener("click", () => handlers.onDelete(button.dataset.id));
  });

  messagesEl.querySelectorAll("[data-action='undo']").forEach((button) => {
    button.addEventListener("click", () => handlers.onUndoDelete(button.dataset.id));
  });

  messagesEl.scrollTop = messagesEl.scrollHeight;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
