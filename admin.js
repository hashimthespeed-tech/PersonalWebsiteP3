const adminState = { messages: [], filter: "all" };

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.querySelector("#adminLogin");
  const dashboard = document.querySelector("#dashboard");
  const loginView = document.querySelector("#loginView");
  const loginMessage = document.querySelector("#loginMessage");

  loginForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    loginMessage.textContent = "Checking…";
    const password = new FormData(loginForm).get("password");
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password })
    });
    const data = await response.json();
    if (!response.ok) {
      loginMessage.className = "form-message error";
      loginMessage.textContent = data.error || "Login failed.";
      return;
    }
    loginView.hidden = true;
    dashboard.hidden = false;
    loadMessages();
  });

  document.querySelector("#logoutButton")?.addEventListener("click", async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    dashboard.hidden = true;
    loginView.hidden = false;
    loginForm?.reset();
  });

  document.querySelectorAll(".filter-button").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".filter-button").forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      adminState.filter = button.dataset.filter;
      renderMessages();
    });
  });

  async function loadMessages() {
    const response = await fetch("/api/admin/messages");
    if (response.status === 401) {
      dashboard.hidden = true;
      loginView.hidden = false;
      return;
    }
    const data = await response.json();
    if (!response.ok) {
      document.querySelector("#messageList").innerHTML = `<p class="empty-state">${data.error}</p>`;
      return;
    }
    adminState.messages = data.messages;
    renderMessages();
  }

  function renderMessages() {
    const messages = adminState.messages.filter((item) => adminState.filter === "all" || (adminState.filter === "new" ? !item.replied : item.replied));
    const counts = {
      total: adminState.messages.length,
      newCount: adminState.messages.filter((item) => !item.replied).length,
      replied: adminState.messages.filter((item) => item.replied).length
    };
    document.querySelector("#totalMessages").textContent = counts.total;
    document.querySelector("#newMessages").textContent = counts.newCount;
    document.querySelector("#repliedMessages").textContent = counts.replied;
    document.querySelector("#replyRate").textContent = counts.total ? `${Math.round((counts.replied / counts.total) * 100)}%` : "0%";
    document.querySelector("#messageList").innerHTML = messages.length ? messages.map(messageTemplate).join("") : `<p class="empty-state">No messages in this view.</p>`;
    drawChart(adminState.messages);
    document.querySelectorAll("[data-reply-id]").forEach((button) => {
      button.addEventListener("click", () => markReplied(button.dataset.replyId));
    });
  }

  function messageTemplate(message) {
    const date = new Date(message.submittedAt).toLocaleString([], { dateStyle: "medium", timeStyle: "short" });
    return `<article class="message-item">
      <div class="message-head"><div><strong>${escapeHtml(message.firstName)} ${escapeHtml(message.lastName)}</strong><span class="message-meta">${escapeHtml(message.email)} · ${escapeHtml(message.reason)} · ${date}</span></div><span class="status ${message.replied ? "replied" : "new"}">${message.replied ? "Replied" : "New"}</span></div>
      <p>${escapeHtml(message.message)}</p>
      ${message.replied ? "" : `<button class="button" type="button" data-reply-id="${message.id}">Mark as replied</button>`}
    </article>`;
  }

  async function markReplied(id) {
    const response = await fetch(`/api/admin/messages/${id}/replied`, { method: "PATCH" });
    if (response.ok) {
      const data = await response.json();
      adminState.messages = adminState.messages.map((item) => item.id === id ? data.record : item);
      renderMessages();
    }
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[char]);
  }

  function drawChart(messages) {
    const canvas = document.querySelector("#reasonChart");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const width = canvas.clientWidth || 500;
    const height = 260;
    const ratio = window.devicePixelRatio || 1;
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    ctx.scale(ratio, ratio);
    const reasons = ["Comment", "Question", "Partnership", "Opportunity", "Other"];
    const values = reasons.map((reason) => messages.filter((item) => item.reason === reason).length);
    const max = Math.max(1, ...values);
    ctx.clearRect(0, 0, width, height);
    ctx.font = "12px -apple-system, BlinkMacSystemFont, sans-serif";
    values.forEach((value, index) => {
      const x = 18 + index * ((width - 36) / reasons.length);
      const barHeight = (value / max) * 175;
      const y = 208 - barHeight;
      ctx.fillStyle = "#5ad2f4";
      ctx.beginPath();
      ctx.roundRect(x, y, 38, barHeight, 8);
      ctx.fill();
      ctx.fillStyle = "#afd0dc";
      ctx.textAlign = "center";
      ctx.fillText(String(value), x + 19, y - 9);
      ctx.fillText(reasons[index], x + 19, 232);
    });
  }
});