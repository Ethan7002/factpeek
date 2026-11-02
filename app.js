const cases = [
  { id: 14, cat: "Campus", icon: "CN", title: "Universities will abolish final exams?", note: "Identify vague sourcing and missing primary documents", verdict: "Insufficient evidence", level: "Intermediate", time: 6 },
  { id: 27, cat: "Health & Science", icon: "HS", title: "New study says coffee can ‘cure’ anxiety", note: "Separate correlation, causation, and exaggerated claims", verdict: "Potentially misleading", level: "Intermediate", time: 8 },
  { id: 31, cat: "Technology", icon: "TC", title: "Company launches headphones that can ‘read minds’", note: "Trace a press release to the original research and limitations", verdict: "Insufficient evidence", level: "Beginner", time: 5 },
  { id: 42, cat: "Image Verification", icon: "IM", title: "Was this ‘flash flood’ photo taken yesterday?", note: "Use reverse-image search, dates, and landmarks", verdict: "Potentially misleading", level: "Advanced", time: 9 },
  { id: 53, cat: "Public Policy", icon: "PP", title: "City will ban all shared bikes next month?", note: "Check the policy document, scope, and effective date", verdict: "Insufficient evidence", level: "Intermediate", time: 7 },
  { id: 66, cat: "Health & Science", icon: "DT", title: "Does one chart prove this diet adds ten years to life?", note: "Inspect the sample, axes, and original data", verdict: "Potentially misleading", level: "Advanced", time: 10 }
];

const views = [...document.querySelectorAll("[data-view]")];
const routeButtons = [...document.querySelectorAll("[data-route]")];
const navButtons = [...document.querySelectorAll(".bottom-nav [data-route]")];
const toast = document.getElementById("toast");
let selectedAnswer = "";
let activeFilter = "All";

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("is-visible"), 2600);
}

function navigate(route) {
  const target = document.querySelector(`[data-view="${route}"]`);
  if (!target) return;
  views.forEach(view => view.classList.toggle("is-active", view === target));
  navButtons.forEach(button => button.classList.toggle("is-active", button.dataset.route === route));
  document.body.classList.toggle("login-active", route === "login");
  window.scrollTo({ top: 0, behavior: "smooth" });
  document.getElementById("main").focus({ preventScroll: true });
  history.replaceState(null, "", `#${route}`);
}

routeButtons.forEach(button => button.addEventListener("click", () => navigate(button.dataset.route)));
document.getElementById("startChallenge").addEventListener("click", () => navigate("case"));
document.getElementById("openDailyCase").addEventListener("click", () => navigate("case"));

function renderCases() {
  const query = document.getElementById("caseSearch").value.trim().toLowerCase();
  const result = cases.filter(item => {
    const matchesFilter = activeFilter === "All" || item.cat === activeFilter;
    const haystack = `${item.title} ${item.cat} ${item.note} ${item.verdict}`.toLowerCase();
    return matchesFilter && haystack.includes(query);
  });
  document.getElementById("caseGrid").innerHTML = result.map(item => `
    <article class="library-card" tabindex="0" role="button" aria-label="Open case: ${item.title}" data-case-id="${item.id}">
      <div class="card-art"><span>${item.cat}</span><b>${item.icon}</b></div>
      <div class="card-content">
        <h2>${item.title}</h2><p>${item.note}</p>
        <div class="card-footer"><span>${item.level} · ${item.time} min</span><span class="tag ${item.verdict === "Potentially misleading" ? "tag-coral" : ""}">${item.verdict}</span></div>
      </div>
    </article>`).join("");
  document.getElementById("emptyState").hidden = result.length > 0;
  document.querySelectorAll(".library-card").forEach(card => {
    const open = () => card.dataset.caseId === "14" ? navigate("case") : showToast("This case will open in the next version. Try Case 014 in this prototype.");
    card.addEventListener("click", open);
    card.addEventListener("keydown", event => { if (event.key === "Enter" || event.key === " ") open(); });
  });
}

document.getElementById("caseSearch").addEventListener("input", renderCases);
document.querySelectorAll(".filter-chip").forEach(button => button.addEventListener("click", () => {
  activeFilter = button.dataset.filter;
  document.querySelectorAll(".filter-chip").forEach(item => item.classList.toggle("is-selected", item === button));
  renderCases();
}));
renderCases();

document.getElementById("globalSearch").addEventListener("keydown", event => {
  if (event.key !== "Enter") return;
  document.getElementById("caseSearch").value = event.currentTarget.value;
  navigate("library");
  renderCases();
});

document.querySelectorAll("#articleBody p:not(:last-child)").forEach(p => p.addEventListener("click", () => {
  p.classList.toggle("is-highlighted");
  showToast(p.classList.contains("is-highlighted") ? "Suspicious clue marked" : "Clue unmarked");
}));

document.querySelectorAll("#quizOptions button").forEach(button => button.addEventListener("click", () => {
  selectedAnswer = button.dataset.answer;
  document.querySelectorAll("#quizOptions button").forEach(item => item.classList.toggle("is-selected", item === button));
  document.getElementById("submitQuiz").disabled = false;
}));

document.getElementById("submitQuiz").addEventListener("click", () => {
  document.getElementById("selectedResult").textContent = selectedAnswer;
  navigate("feedback");
});

const analysisInput = document.getElementById("analysisInput");
analysisInput.addEventListener("input", () => {
  if (analysisInput.value.length > 2000) analysisInput.value = analysisInput.value.slice(0, 2000);
  document.getElementById("charCount").textContent = `${analysisInput.value.length} / 2000`;
});
document.getElementById("uploadDemo").addEventListener("click", () => showToast("Screenshot upload is reserved in this prototype. Format and safety checks will be connected in the full version."));
document.getElementById("runAnalysis").addEventListener("click", () => {
  if (!analysisInput.value.trim()) { showToast("Paste story text or a link first"); analysisInput.focus(); return; }
  const panel = document.getElementById("analysisPanel");
  panel.innerHTML = `<div class="analysis-empty"><div class="radar"><i></i><i></i><span></span></div><h2>Breaking the story into key claims</h2><p>Checking sources, dates, language, and verifiable evidence…</p></div>`;
  setTimeout(() => {
    panel.innerHTML = `<div class="analysis-result">
      <div class="analysis-head"><div><p>FIXED EDUCATIONAL DEMO</p><h2>Preliminary analysis</h2></div><span class="verdict">Insufficient evidence</span></div>
      <div class="confidence"><span>Evidence strength</span><div><i></i></div><b>72</b></div>
      <div class="reason-grid"><article><strong>Source</strong><p>No directly verifiable original publisher was found in the text.</p></article><article><strong>Language</strong><p>Absolute language appears and its scope needs checking.</p></article><article><strong>Evidence</strong><p>Independent reporting, documents, or inspectable data are missing.</p></article></div>
      <p class="analysis-warning">This is a fixed prototype demo, not a real fact-check of your input. Continue by finding the original source and cross-checking it.</p>
    </div>`;
  }, 900);
});

document.getElementById("themeToggle").addEventListener("click", () => {
  document.body.classList.toggle("dark");
  showToast(document.body.classList.contains("dark") ? "Dark mode on" : "Light mode on");
});

document.getElementById("loginForm").addEventListener("submit", event => {
  event.preventDefault();
  navigate("home");
  showToast("Welcome to FactPeek");
});
document.getElementById("forgotPassword").addEventListener("click", () => showToast("Password recovery will be connected in the next build."));
document.getElementById("createAccount").addEventListener("click", () => showToast("Account creation will be connected in the next build."));

const initialRoute = location.hash.replace("#", "");
if (["login", "home", "library", "case", "feedback", "analyze", "profile"].includes(initialRoute)) navigate(initialRoute);
else navigate("login");
