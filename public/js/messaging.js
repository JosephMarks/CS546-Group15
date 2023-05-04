// public/js/messaging.js

async function loadConversation(targetUserId) {
  const userId = document.body.dataset.userId;
  const dropDown = document.querySelector("#userConnections");
  dropDown.value = targetUserId;
  console.log(dropDown);
  const response = await fetch(`/profile/${userId}/messaging/${targetUserId}`);
  const messages = await response.json();
  updateMessages(messages);
}

function updateMessages(messages) {
  const messagesContainer = document.querySelector("#messages-container");
  messagesContainer.innerHTML = "";
  for (const message of messages) {
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message");
    const messageSubject = document.createElement("h3");
    messageSubject.textContent = message.subject;
    messageDiv.appendChild(messageSubject);
    const messageContent = document.createElement("p");
    messageContent.textContent = message.message;
    messageDiv.appendChild(messageContent);
    messagesContainer.appendChild(messageDiv);
  }
}

window.addEventListener("DOMContentLoaded", () => {
  const firstConversationUser = document.querySelector(".list-group-item");
  if (firstConversationUser) {
    firstConversationUser.click();
  }
});
