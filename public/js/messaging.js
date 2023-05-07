// public/js/messaging.js

async function loadConversation(targetUserId) {
  const userId = document
    .querySelector("#profileMessage")
    .getAttribute("data-user-id");
  //const userId = document.body.dataset.userId;
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
    const messageContent = document.createElement("div");
    messageContent.classList = "messageLine";
    let { firstName, lastName } = message.senderFullName;
    messageContent.innerHTML = `<strong>${firstName} ${lastName}:</strong> <span>${message.message}</span>`;

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

document
  .querySelector("#send-message")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    let errorEl = document.querySelector("#error");
    errorEl.textContent = "";
    let { id, connection, messageInput } = e.target;

    let valid = false;

    console.log(id.value, connection.value, messageInput.value);
    ///validate

    if (messageInput.value !== "") {
      valid = true;
    } else {
      console.log("Please enter something");
      errorEl.textContent = "Please enter something";
    }

    //send the form data
    //action="/profile/{{_id}}/messaging"
    //method="POST"

    if (valid) {
      console.log("send form");
      document.querySelector("#send-message").submit();
    }

    /*
    const result = fetch(`/profile/${id.value}/messaging`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        connection: connection.value,
        messageInput: messageInput.value,
      }),
    });

    console.log(result);*/
  });
