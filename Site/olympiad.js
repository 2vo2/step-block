/* Сторінка олімпіади: реєстрація (ПІБ + пароль) → редактор OneCompiler з єдиним файлом tasks.py
   → автозбереження → таймер з автозавершенням → пауза за паролем адміністратора.
   Налаштування й задачі — olympiad_config.js, сервер — olympiad_backend.gs.
   Діагностика: ?debug=1 показує повідомлення редактора; ?tool=hash — хеш пароля адміністратора. */
(function () {
    "use strict";

    const SETTINGS = window.OLYMPIAD_SETTINGS || {};
    const params = new URLSearchParams(location.search);
    const OID = params.get("o") || "";
    const DEBUG = params.get("debug") === "1";
    const cfg = (window.OLYMPIADS || {})[OID];
    const app = document.getElementById("app");
    const EDITOR_ORIGIN = "https://onecompiler.com";
    const FILE = (cfg && cfg.fileName) || "tasks.py";
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

    // ---------- допоміжне ----------
    function h(tag, props, ...kids) {
        const node = document.createElement(tag);
        Object.entries(props || {}).forEach(([k, v]) => {
            if (k === "class") node.className = v;
            else if (k === "text") node.textContent = v;
            else if (k.startsWith("on")) node.addEventListener(k.slice(2), v);
            else node.setAttribute(k, v);
        });
        kids.flat().forEach((c) => { if (c != null) node.append(c); });
        return node;
    }
    function showMessage(title, text) {
        app.innerHTML = "";
        app.append(h("div", { class: "ol-card" }, h("h1", { text: title }), h("p", { text })));
    }
    async function sha256(text) {
        if (window.crypto && crypto.subtle) {
            const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
            return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
        }
        let a = 0x811c9dc5, b = 0x01000193 ^ 0xabcdef;      // запасний варіант без crypto.subtle (не криптостійкий)
        for (let i = 0; i < text.length; i++) {
            a = Math.imul(a ^ text.charCodeAt(i), 0x01000193) >>> 0;
            b = Math.imul(b ^ text.charCodeAt(i), 0x85ebca6b) >>> 0;
        }
        return (a.toString(16).padStart(8, "0") + b.toString(16).padStart(8, "0")).repeat(4);
    }

    // ---------- службова сторінка: хеш пароля адміністратора ----------
    if (params.get("tool") === "hash") {
        const input = h("input", { type: "text", placeholder: "Пароль адміністратора", autocomplete: "off" });
        const out = h("input", { type: "text", readonly: "readonly", placeholder: "Тут з'явиться хеш" });
        input.addEventListener("input", async () => { out.value = input.value ? await sha256("admin|" + input.value) : ""; });
        app.append(h("div", { class: "ol-card" },
            h("h1", { text: "Хеш пароля адміністратора" }),
            h("p", { text: "Потрібен лише для «режиму без сервера»: скопіюйте результат у adminPasswordHash в olympiad_config.js. З сервером пароль задається в olympiad_backend.gs (ADMIN_PASSWORD)." }),
            h("div", { class: "ol-field" }, input), h("div", { class: "ol-field" }, out)));
        return;
    }

    if (SETTINGS.requireSeb !== false && !/\bSEB\//i.test(navigator.userAgent)) {
        showMessage("Відкрийте через Safe Exam Browser", "Олімпіада працює лише в безпечному середовищі. Закрийте браузер і запустіть Safe Exam Browser.");
        return;
    }
    if (!cfg) { showMessage("Олімпіаду не знайдено", "Перевірте посилання (параметр ?o=...) і файл olympiad_config.js."); return; }
    if (cfg.active === false) { showMessage(cfg.title || "Олімпіада", "Олімпіада ще не відкрита. Зачекайте на вказівки вчителя."); return; }

    const brand = document.getElementById("olBrand");
    if (brand && brand.firstChild) brand.firstChild.textContent = cfg.title || "Олімпіада";
    document.title = cfg.title || "Олімпіада";
    const tasks = cfg.tasks || [];

    function normalizeName(s) { return String(s).trim().replace(/\s+/g, " ").toLowerCase().replace(/[’`ʼ]/g, "'"); }
    function validName(s) {
        const n = String(s).trim().replace(/\s+/g, " ");
        return n.length >= 5 && n.split(" ").length >= 2 && /^[\p{L}'’ʼ\-\s]+$/u.test(n);
    }
    function userError(msg) { const e = new Error(msg); e.userMessage = msg; return e; }

    // ---------- стан ----------
    const S = {
        name: "", pid: "", passHash: "", files: {}, serverTs: {}, dirty: new Set(),
        offline: false, finished: false, finishing: false, finishReason: "", synced: true,
        saving: false, again: false, saveTimer: null, populated: false, gotMessage: false, lastSaved: null,
        // таймер
        offset: 0, startedAt: 0, limitMs: 0, pausedTotalMs: 0, pausedAt: 0, paused: false, timeUp: false,
        tick: null, syncTimer: null, pushTimer: null,
    };
    let frame = null, statusEl = null, timerEl = null, overlay = null, overlayText = null, pauseBtn = null, layoutEl = null;

    // ---------- час ----------
    const nowS = () => Date.now() + S.offset;
    function remainingMs() {
        if (!S.limitMs) return Infinity;
        const effectiveNow = S.pausedAt || nowS();
        return S.limitMs - (effectiveNow - S.startedAt - S.pausedTotalMs);
    }
    function applyState(st) {
        if (!st) return;
        if (st.serverNow) S.offset = st.serverNow - Date.now();
        S.startedAt = st.startedAt || S.startedAt;
        S.limitMs = ((st.durationMin || 0) + (st.extraMin || 0)) * 60000;
        S.pausedTotalMs = st.pausedTotalMs || 0;
        S.pausedAt = st.pausedAt || 0;
    }
    function fmt(ms) {
        const s = Math.max(0, Math.ceil(ms / 1000));
        const hh = Math.floor(s / 3600), mm = Math.floor((s % 3600) / 60), ss = s % 60;
        const p = (n) => String(n).padStart(2, "0");
        return (hh ? hh + ":" : "") + p(mm) + ":" + p(ss);
    }

    // ---------- локальна копія ----------
    const lsKey = () => "ol:" + OID + ":" + S.pid;
    function loadLocal() { try { return JSON.parse(localStorage.getItem(lsKey()) || "null"); } catch (e) { return null; } }
    function saveLocal() {
        try {
            localStorage.setItem(lsKey(), JSON.stringify({
                files: S.files, ts: Date.now(), passHash: S.passHash, finished: S.finished, finishReason: S.finishReason,
                timing: { startedAt: S.startedAt, limitMs: S.limitMs, pausedTotalMs: S.pausedTotalMs, pausedAt: S.pausedAt },
            }));
        } catch (e) { /* ignore */ }
    }

    // ---------- сервер ----------
    async function api(action, extra) {
        if (!cfg.backendUrl) throw new Error("no_backend");
        const body = JSON.stringify(Object.assign(
            { action, token: cfg.token, oid: OID, pid: S.pid, name: S.name, passHash: S.passHash }, extra || {}));
        const ctrl = new AbortController();
        const timeout = setTimeout(() => ctrl.abort(), 20000);
        try {
            const resp = await fetch(cfg.backendUrl, {
                method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" }, body, signal: ctrl.signal,
            });
            const data = await resp.json();
            if (data && data.state) applyState(data.state);
            return data;
        } finally { clearTimeout(timeout); }
    }

    // ---------- єдиний файл tasks.py: лише розділювачі, умови — ліворуч ----------
    function buildStarter() {
        const bar = "# " + "=".repeat(58);
        const L = [bar, "# " + (cfg.title || "Олімпіада"), "# Учасник: " + S.name,
            "# Умови задач — у списку ліворуч. Розв'язок кожної задачі пишіть під її заголовком.", bar, ""];
        tasks.forEach((t, i) => {
            L.push("# ---------- Задача " + (i + 1) + ". " + (t.title || "") + " ----------",
                "# Нижче напишіть розв'язок Задачі " + (i + 1), "", "", "");
        });
        return L.join("\n");
    }

    // ---------- реєстрація ----------
    function renderLogin(prefillError) {
        const nameInput = h("input", { type: "text", id: "olName", autocomplete: "off", placeholder: "Прізвище Ім'я По батькові" });
        const passInput = h("input", { type: "password", id: "olPass", autocomplete: "off", placeholder: "Пароль (запам'ятайте його)" });
        const errorBox = h("div", { class: "ol-error", style: "display:none" });
        const startBtn = h("button", { type: "button", class: "btn btn-main", text: "Розпочати" });
        const limitNote = cfg.durationMinutes
            ? h("div", { class: "ol-note", text: "⏱ Тривалість: " + cfg.durationMinutes + " хв. Відлік починається одразу після входу." }) : null;
        const card = h("div", { class: "ol-card" },
            h("h1", { text: cfg.title }),
            h("p", { text: cfg.subtitle || "Введіть своє ПІБ і придумайте пароль." }),
            limitNote,
            h("div", { class: "ol-field" }, h("label", { for: "olName", text: "ПІБ" }), nameInput),
            h("div", { class: "ol-field" }, h("label", { for: "olPass", text: "Пароль" }), passInput),
            h("p", { text: "Якщо ви вже починали, введіть ті самі ПІБ і пароль, щоб продовжити з того місця, де зупинились." }),
            errorBox, h("div", { class: "ol-actions" }, startBtn));
        app.innerHTML = "";
        app.append(card);
        const fail = (msg) => { errorBox.textContent = msg; errorBox.style.display = ""; startBtn.disabled = false; startBtn.textContent = "Розпочати"; };
        if (prefillError) fail(prefillError);
        const submit = async () => {
            errorBox.style.display = "none";
            if (!validName(nameInput.value)) return fail("Введіть повне ПІБ (щонайменше прізвище та ім'я, лише літери).");
            if (passInput.value.length < 4) return fail("Пароль має містити щонайменше 4 символи.");
            startBtn.disabled = true; startBtn.textContent = "Зачекайте…";
            try { await startSession(nameInput.value, passInput.value); }
            catch (e) { fail(e && e.userMessage ? e.userMessage : "Не вдалося почати: " + (e && e.message ? e.message : e)); }
        };
        startBtn.addEventListener("click", submit);
        passInput.addEventListener("keydown", (e) => { if (e.key === "Enter") submit(); });
        nameInput.addEventListener("keydown", (e) => { if (e.key === "Enter") passInput.focus(); });
        nameInput.focus();
    }

    async function startSession(rawName, password) {
        S.name = String(rawName).trim().replace(/\s+/g, " ");
        S.pid = (await sha256(OID + "|" + normalizeName(rawName))).slice(0, 16);
        S.passHash = await sha256(OID + "|" + S.pid + "|" + password);

        let server = null;
        if (cfg.backendUrl) {
            try { server = await api("login", { durationMin: cfg.durationMinutes || 0 }); } catch (e) { server = null; }
            if (server && !server.ok) {
                if (server.error === "wrong_password") throw userError("Невірний пароль для цього ПІБ. Якщо це перший вхід, перевірте правильність написання ПІБ.");
                if (server.error === "bad_token") throw userError("Помилка налаштування сервера (токен). Повідомте вчителя.");
                server = null;
            }
        }
        const local = loadLocal();
        if (local && local.passHash && local.passHash !== S.passHash) throw userError("Невірний пароль для цього ПІБ.");

        if (cfg.backendUrl && !server) {
            // Сервер недоступний: новий учасник не може почати (час має йти за серверним годинником),
            // а той, хто вже починав на цьому ПК, продовжує за локальним відліком.
            if (!(local && local.timing && local.timing.startedAt)) {
                throw userError("Немає зв'язку із сервером. Перевірте мережу й спробуйте ще раз.");
            }
            S.offline = true;
        }

        // Час
        if (server && server.state) {
            applyState(server.state);
        } else if (local && local.timing && local.timing.startedAt) {
            S.startedAt = local.timing.startedAt; S.limitMs = local.timing.limitMs || 0;
            S.pausedTotalMs = local.timing.pausedTotalMs || 0; S.pausedAt = local.timing.pausedAt || 0;
        } else {
            S.startedAt = Date.now(); S.limitMs = (cfg.durationMinutes || 0) * 60000; S.pausedTotalMs = 0; S.pausedAt = 0;
        }

        // Файл: заготовка → поверх збережене (сервер / локальна копія, що новіша)
        const files = {};
        files[FILE] = buildStarter();
        S.dirty.clear(); S.serverTs = {};
        if (server && server.files && server.files[FILE]) {
            files[FILE] = server.files[FILE].content;
            S.serverTs[FILE] = Date.parse(server.files[FILE].updatedAt) || 0;
        }
        if (local && local.files && typeof local.files[FILE] === "string") {
            const serverTs = S.serverTs[FILE];
            if (serverTs === undefined || (local.ts || 0) > serverTs) {
                if (files[FILE] !== local.files[FILE]) { files[FILE] = local.files[FILE]; S.dirty.add(FILE); }
            }
        }
        S.files = files;
        S.finished = !!(server && server.finished) || !!(local && local.finished && !server);
        S.finishReason = (server && server.finishReason) || (local && local.finishReason) || "";
        saveLocal();

        if (S.finished) return renderDone(S.finishReason);
        renderWorkspace();
        if (S.dirty.size) scheduleFlush(1500);
    }

    // ---------- робочий екран ----------
    function setStatus(text, kind) {
        if (!statusEl) return;
        statusEl.textContent = text;
        statusEl.className = "ol-status" + (kind ? " " + kind : "");
    }
    const timeStr = (d) => d.toLocaleTimeString("uk-UA", { hour: "2-digit", minute: "2-digit", second: "2-digit" });

    function taskPanel(t, i) {
        const parts = [h("pre", { text: t.statement || "" })];
        if (t.input) parts.push(h("h4", { text: "Вхідні дані" }), h("pre", { text: t.input }));
        if (t.output) parts.push(h("h4", { text: "Вихідні дані" }), h("pre", { text: t.output }));
        (t.examples || []).forEach((ex, k) => {
            parts.push(h("h4", { text: "Приклад " + (k + 1) + " — вхід" }), h("pre", { text: ex.input }),
                h("h4", { text: "Приклад " + (k + 1) + " — вихід" }), h("pre", { text: ex.output }));
        });
        const d = h("details", { class: "ol-task" }, h("summary", { text: "Задача " + (i + 1) + ". " + (t.title || "") }), parts);
        if (i === 0) d.open = true;
        return d;
    }

    function editorUrl() {
        const q = new URLSearchParams({
            listenToEvents: "true", codeChangeEvent: "true", hideNew: "true", hideTitle: "true",
            hideLanguageSelection: "true", hideNewFileOption: "true", availableLanguages: "true",
            disableCopyPaste: String(cfg.disableCopyPaste !== false), theme: "light",
        });
        return EDITOR_ORIGIN + "/embed/python?" + q.toString();
    }

    function populate() {
        if (!frame || !frame.contentWindow) return;
        frame.contentWindow.postMessage({ eventType: "populateCode", language: "python", files: [{ name: FILE, content: S.files[FILE] }] }, "*");
        S.populated = true;
    }

    function renderWorkspace() {
        statusEl = h("span", { class: "ol-status", text: "" });
        timerEl = h("span", { class: "ol-timer", style: S.limitMs ? "" : "display:none" });
        pauseBtn = h("button", { type: "button", class: "btn btn-light", text: "⏸ Пауза", onclick: togglePause });
        if (cfg.allowPause === false) pauseBtn.style.display = "none";
        const downloadBtn = h("button", { type: "button", class: "btn btn-light", text: "⬇ Завантажити " + FILE, onclick: () => downloadFile() });
        const finishBtn = h("button", { type: "button", class: "btn btn-main", text: "Завершити роботу", onclick: finishWork });
        const bar = h("div", { class: "ol-bar" }, h("span", { class: "ol-who", text: "👤 " + S.name }), timerEl, statusEl, pauseBtn, downloadBtn, finishBtn);

        frame = h("iframe", { title: "Редактор Python", src: editorUrl(), allow: "clipboard-read; clipboard-write" });
        overlayText = h("p", { text: "" });
        const overlayTitle = h("h2", { text: "" });
        const resumeBtn = h("button", { type: "button", class: "btn btn-main", text: "▶ Продовжити (пароль адміністратора)", onclick: togglePause });
        overlay = h("div", { class: "ol-overlay" }, h("div", { class: "ol-overlay-box" }, overlayTitle, overlayText, resumeBtn));
        overlay._title = overlayTitle; overlay._resume = resumeBtn;
        layoutEl = h("div", { class: "ol-layout" },
            h("aside", { class: "ol-tasks" }, tasks.map(taskPanel)),
            h("section", { class: "ol-editor" }, frame), overlay);

        app.innerHTML = "";
        app.append(bar, layoutEl);
        if (DEBUG) app.append(h("div", { class: "ol-debug", id: "olDebug", text: "debug: очікуємо повідомлення редактора…" }));

        frame.addEventListener("load", () => {
            populate();
            setTimeout(() => { if (!S.gotMessage) populate(); }, 2500);
            setTimeout(() => { if (!S.gotMessage) populate(); }, 6000);
        });
        if (S.offline) setStatus("⚠ Немає зв'язку із сервером — працюємо локально, спробуємо надіслати пізніше", "warn");
        else if (!cfg.backendUrl) setStatus("Режим без сервера: файл зберігається лише на цьому комп'ютері", "warn");
        else setStatus("Готово до роботи", "ok");

        setPaused(!!S.pausedAt);
        startTimers();
    }

    // ---------- таймер ----------
    function startTimers() {
        stopTimers();
        updateTimer();
        S.tick = setInterval(updateTimer, 1000);
        if (cfg.backendUrl) S.syncTimer = setInterval(syncState, 30000);
    }
    function stopTimers() {
        [S.tick, S.syncTimer].forEach((t) => { if (t) clearInterval(t); });
        S.tick = S.syncTimer = null;
    }
    function updateTimer() {
        if (S.finished || S.finishing || !timerEl || !S.limitMs) return;
        const rem = remainingMs();
        timerEl.textContent = (S.pausedAt ? "⏸ " : "⏱ ") + fmt(rem);
        timerEl.className = "ol-timer" + (S.pausedAt ? " paused" : rem <= 60000 ? " bad" : rem <= 300000 ? " warn" : "");
        if (rem <= 0 && !S.pausedAt) onTimeUp();
    }
    async function syncState() {
        if (!cfg.backendUrl || S.finished || S.finishing) return;
        try {
            const r = await api("sync");
            if (!r || !r.ok) return;
            if (r.finished) {
                S.finished = true; S.finishReason = r.finishReason || ""; saveLocal();
                return renderDone(S.finishReason);
            }
            setPaused(!!S.pausedAt);
            updateTimer();
        } catch (e) { /* мережа тимчасово недоступна — спробуємо наступного разу */ }
    }

    // ---------- пауза ----------
    function setPaused(flag) {
        S.paused = flag;
        if (!overlay) return;
        if (flag) {
            overlay._title.textContent = "⏸ Пауза";
            overlayText.textContent = "Роботу призупинено. Очікуйте вказівок вчителя.";
            overlay._resume.style.display = "";
        }
        overlay.classList.toggle("show", flag || S.timeUp);
        if (frame) frame.style.visibility = (flag || S.timeUp) ? "hidden" : "";
        if (pauseBtn) pauseBtn.textContent = flag ? "▶ Продовжити" : "⏸ Пауза";
        updateTimer();
    }

    function adminDialog(title, action) {
        const input = h("input", { type: "password", placeholder: "Пароль адміністратора", autocomplete: "off" });
        const err = h("div", { class: "ol-error", style: "display:none" });
        const okBtn = h("button", { type: "button", class: "btn btn-main", text: "Підтвердити" });
        const cancel = h("button", { type: "button", class: "btn btn-light", text: "Скасувати" });
        const modal = h("div", { class: "ol-modal" }, h("div", { class: "ol-modal-box" },
            h("h2", { text: title }), h("p", { text: "Введіть пароль адміністратора (вчителя)." }), input, err,
            h("div", { class: "ol-actions" }, okBtn, cancel)));
        const close = () => modal.remove();
        const submit = async () => {
            if (!input.value) return;
            err.style.display = "none";
            if (!(window.crypto && crypto.subtle)) {      // без SHA-256 хеш не збігся б із серверним — кажемо про це прямо
                err.textContent = "Пауза недоступна: браузер не підтримує безпечне хешування (потрібне HTTPS-з'єднання).";
                err.style.display = ""; return;
            }
            okBtn.disabled = true;
            try {
                const adminHash = await sha256("admin|" + input.value);
                const res = await action(adminHash);
                if (res && res.ok) return close();
                err.textContent = (res && res.message) || "Не вдалося виконати дію";
            } catch (e) { err.textContent = "Немає зв'язку із сервером. Спробуйте ще раз."; }
            err.style.display = ""; okBtn.disabled = false; input.value = ""; input.focus();
            await sleep(800);                              // невелика затримка проти підбору пароля
        };
        okBtn.addEventListener("click", submit);
        cancel.addEventListener("click", close);
        input.addEventListener("keydown", (e) => { if (e.key === "Enter") submit(); if (e.key === "Escape") close(); });
        document.body.append(modal);
        input.focus();
    }

    function togglePause() {
        if (S.finished || S.finishing || S.timeUp) return;
        const resuming = S.paused;
        adminDialog(resuming ? "Продовжити роботу" : "Поставити на паузу", async (adminHash) => {
            if (!resuming) await flush();                                    // зберігаємо перед паузою
            if (cfg.backendUrl) {
                const r = await api(resuming ? "resume" : "pause", { adminHash });
                if (!r) return { ok: false, message: "Сервер не відповів" };
                if (r.ok) { setPaused(!!S.pausedAt); return { ok: true }; }
                if (r.error === "bad_admin") return { ok: false, message: "Невірний пароль адміністратора" };
                if (r.error === "finished") { S.finished = true; renderDone(r.finishReason); return { ok: true }; }
                return { ok: false, message: "Помилка сервера: " + r.error };
            }
            if (!cfg.adminPasswordHash) return { ok: false, message: "Пауза недоступна: у конфігурації не задано adminPasswordHash" };
            if (adminHash !== cfg.adminPasswordHash) return { ok: false, message: "Невірний пароль адміністратора" };
            if (resuming) { S.pausedTotalMs += Date.now() - S.pausedAt; S.pausedAt = 0; } else { S.pausedAt = Date.now(); }
            saveLocal(); setPaused(!!S.pausedAt);
            return { ok: true };
        });
    }

    // ---------- повідомлення від редактора ----------
    function extractFile(d) {
        if (!d || typeof d !== "object") return null;
        let list = null;
        if (Array.isArray(d.files)) {
            list = d.files.filter((f) => f && typeof f.content === "string").map((f) => ({ name: String(f.name || ""), content: f.content }));
        } else if (typeof d.code === "string") list = [{ name: String(d.name || d.fileName || ""), content: d.code }];
        else if (typeof d.content === "string") list = [{ name: String(d.name || ""), content: d.content }];
        if (!list || !list.length) return null;
        const exact = list.find((f) => f.name === FILE);
        if (exact) return exact.content;
        return list.length === 1 ? list[0].content : null;       // редактор міг перейменувати єдиний файл
    }

    window.addEventListener("message", (ev) => {
        if (!frame || ev.source !== frame.contentWindow) return;
        if (DEBUG) {
            const box = document.getElementById("olDebug");
            if (box) box.textContent = "останнє повідомлення:\n" + JSON.stringify(ev.data, null, 1).slice(0, 1500);
        }
        if (S.finished || S.finishing || S.paused || S.timeUp || !S.populated) return;
        const content = extractFile(ev.data);
        if (content === null) return;
        S.gotMessage = true;
        if (S.files[FILE] !== content) { S.files[FILE] = content; S.dirty.add(FILE); onChanged(); }
    });

    // ---------- автозбереження ----------
    function onChanged() {
        saveLocal();
        setStatus("● Є незбережені зміни…", "warn");
        scheduleFlush((cfg.autosaveSeconds || 10) * 1000);
    }
    function scheduleFlush(ms) {
        if (S.saveTimer) return;
        S.saveTimer = setTimeout(() => { S.saveTimer = null; flush(); }, ms);
    }
    async function flush() {
        if (S.saveTimer) { clearTimeout(S.saveTimer); S.saveTimer = null; }
        if (S.finished || !S.dirty.size) return true;
        if (!cfg.backendUrl) {
            setStatus("Режим без сервера: збережено на цьому комп'ютері. Наприкінці файл завантажиться автоматично.", "warn");
            return true;
        }
        if (S.saving) { S.again = true; return false; }
        const names = Array.from(S.dirty), sent = {};
        names.forEach((n) => { sent[n] = S.files[n]; });
        S.saving = true;
        setStatus("Зберігаємо…");
        let ok = false;
        try {
            const res = await api("save", { files: names.map((n) => ({ name: n, content: sent[n] })) });
            if (res && res.ok) {
                names.forEach((n) => { if (S.files[n] === sent[n]) S.dirty.delete(n); });
                S.lastSaved = new Date(); S.offline = false; ok = true;
                setStatus("✓ Збережено о " + timeStr(S.lastSaved), "ok");
            } else if (res && res.error === "finished") {
                S.serverClosed = true;
                if (!S.finishing) { S.finished = true; S.finishReason = res.finishReason || ""; saveLocal(); renderDone(S.finishReason); }
                ok = true;
            } else if (res && res.error === "paused") {
                setStatus("⏸ Пауза: збереження відкладено", "warn");
            } else if (res && res.error === "too_long") {
                setStatus("⚠ Файл завеликий для збереження на сервері", "bad");
            } else {
                throw new Error((res && res.error) || "bad_response");
            }
        } catch (e) {
            S.offline = true;
            setStatus("⚠ Не вдалося зберегти на сервер — код у безпеці на цьому ПК, повторюємо…", "warn");
            if (S.dirty.size) scheduleFlush(10000);
        } finally {
            S.saving = false;
            if (S.again) { S.again = false; if (S.dirty.size) scheduleFlush(500); }
        }
        return ok;
    }
    function beaconFlush() {
        if (!cfg.backendUrl || S.finished || !S.dirty.size || !navigator.sendBeacon) return;
        try {
            const payload = JSON.stringify({
                action: "save", token: cfg.token, oid: OID, pid: S.pid, name: S.name, passHash: S.passHash,
                files: Array.from(S.dirty).map((n) => ({ name: n, content: S.files[n] })),
            });
            navigator.sendBeacon(cfg.backendUrl, new Blob([payload], { type: "text/plain;charset=UTF-8" }));
        } catch (e) { /* ignore */ }
    }
    document.addEventListener("visibilitychange", () => { if (document.visibilityState === "hidden") { saveLocal(); beaconFlush(); } });
    window.addEventListener("pagehide", () => { saveLocal(); beaconFlush(); });
    window.addEventListener("blur", () => { if (S.dirty.size && frame) flush(); });

    // ---------- файл ----------
    function downloadName() {
        const base = S.name.replace(/[^\p{L}\p{N}]+/gu, "_").replace(/^_+|_+$/g, "");
        return FILE.replace(/\.py$/i, "") + "_" + base + ".py";
    }
    function downloadFile() {
        try {
            const url = URL.createObjectURL(new Blob([S.files[FILE] || ""], { type: "text/x-python;charset=utf-8" }));
            const a = h("a", { href: url, download: downloadName() });
            document.body.append(a); a.click(); a.remove();
            setTimeout(() => URL.revokeObjectURL(url), 2000);
        } catch (e) { /* ignore */ }
    }

    // ---------- завершення (вручну або за часом) ----------
    async function onTimeUp() {
        if (S.timeUp || S.finished || S.finishing) return;
        S.timeUp = true;
        overlay._title.textContent = "⏱ Час вичерпано";
        overlayText.textContent = "Зберігаємо результат. Не закривайте вікно…";
        overlay._resume.style.display = "none";
        overlay.classList.add("show");
        if (frame) frame.style.visibility = "hidden";
        await finalizeAttempt("time");
    }

    async function finalizeAttempt(reason) {
        S.finishing = true; S.finishReason = reason;
        if (S.saveTimer) { clearTimeout(S.saveTimer); S.saveTimer = null; }
        let saved = !cfg.backendUrl;
        for (let i = 0; i < 3 && !saved; i++) { saved = await flush(); if (!saved) await sleep(1500); }
        let finished = !cfg.backendUrl;
        for (let i = 0; i < 3 && !finished; i++) {
            try { const r = await api("finish", { reason }); finished = !!(r && r.ok); } catch (e) { finished = false; }
            if (!finished) await sleep(1500);
        }
        S.finished = true;
        S.synced = (saved && finished && !S.dirty.size) || !cfg.backendUrl;
        saveLocal();
        if (cfg.autoDownload !== false) downloadFile();
        renderDone(reason);
        if (cfg.backendUrl && !S.synced) startFinalPush();
    }

    async function finishWork() {
        if (S.finishing || S.finished) return;
        if (!window.confirm("Завершити роботу? Після цього змінювати розв'язки буде неможливо.")) return;
        setStatus("Завершуємо…");
        await finalizeAttempt("manual");
    }

    // фонове дозавантаження результату, якщо в момент завершення не було зв'язку
    function startFinalPush() {
        if (S.pushTimer) return;
        const setSync = (kind, text) => { const el = document.getElementById("olSync"); if (el) { el.className = "ol-sync " + kind; el.textContent = text; } };
        const tick = async () => {
            try {
                if (S.dirty.size) {
                    const r = await api("save", { files: Array.from(S.dirty).map((n) => ({ name: n, content: S.files[n] })) });
                    if (r && r.ok) S.dirty.clear();
                    else if (r && (r.error === "finished" || r.error === "paused")) {
                        clearInterval(S.pushTimer); S.pushTimer = null;
                        setSync("warn", "Сервер уже закрив спробу. Завантажений файл збережено на цьому комп'ютері — передайте його вчителю.");
                        return;
                    } else throw new Error("save");
                }
                const f = await api("finish", { reason: S.finishReason });
                if (f && f.ok) {
                    clearInterval(S.pushTimer); S.pushTimer = null; S.synced = true;
                    setSync("ok", "✓ Результат збережено на сервері.");
                    return;
                }
            } catch (e) { /* повторимо */ }
            setSync("warn", "⚠ Немає зв'язку із сервером. Файл збережено на цьому ПК; повторюємо відправлення…");
        };
        S.pushTimer = setInterval(tick, 15000);
        tick();
    }

    function renderDone(reason) {
        stopTimers();
        frame = null; statusEl = null; timerEl = null; overlay = null; pauseBtn = null;
        const byTime = reason === "time";
        const syncLine = !cfg.backendUrl ? "Завантажте файл і передайте його вчителю."
            : S.synced ? "✓ Результат збережено на сервері." : "Надсилаємо результат на сервер…";
        app.innerHTML = "";
        app.append(h("div", { class: "ol-card" },
            h("h1", { text: byTime ? "Час вийшов — роботу завершено" : "Роботу завершено" }),
            h("p", { text: "Дякуємо, " + S.name + "! Ваш розв'язок збережено в файлі " + FILE + " на цьому комп'ютері" + (cfg.autoDownload !== false ? " і завантажено автоматично." : ".") }),
            h("div", { class: "ol-sync " + (S.synced ? "ok" : "warn"), id: "olSync", text: syncLine }),
            h("div", { class: "ol-actions" }, h("button", { type: "button", class: "btn btn-main", text: "⬇ Завантажити " + FILE, onclick: () => downloadFile() }))));
    }

    renderLogin();
})();
