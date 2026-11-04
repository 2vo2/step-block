/* Сторінка олімпіади: реєстрація (ПІБ + пароль) → редактор OneCompiler із задачами → автозбереження.
   Налаштування й задачі — у olympiad_config.js, сервер — olympiad_backend.gs.
   Для діагностики відкрийте сторінку з ?debug=1 (покаже повідомлення редактора). */
(function () {
    "use strict";

    const SETTINGS = window.OLYMPIAD_SETTINGS || {};
    const params = new URLSearchParams(location.search);
    const OID = params.get("o") || "";
    const DEBUG = params.get("debug") === "1";
    const cfg = (window.OLYMPIADS || {})[OID];
    const app = document.getElementById("app");
    const EDITOR_ORIGIN = "https://onecompiler.com";

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
    const fileName = (t, i) => t.file || ("task" + (i + 1) + ".py");

    // ---------- хешування ----------
    async function sha256(text) {
        if (window.crypto && crypto.subtle) {
            const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
            return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
        }
        // запасний варіант без crypto.subtle (не криптостійкий): два 32-бітні FNV-хеші
        let a = 0x811c9dc5, b = 0x01000193 ^ 0xabcdef;
        for (let i = 0; i < text.length; i++) {
            a = Math.imul(a ^ text.charCodeAt(i), 0x01000193) >>> 0;
            b = Math.imul(b ^ text.charCodeAt(i), 0x85ebca6b) >>> 0;
        }
        return (a.toString(16).padStart(8, "0") + b.toString(16).padStart(8, "0")).repeat(4);
    }

    function normalizeName(s) {
        return String(s).trim().replace(/\s+/g, " ").toLowerCase().replace(/[’`ʼ]/g, "'");
    }
    function validName(s) {
        const n = String(s).trim().replace(/\s+/g, " ");
        return n.length >= 5 && n.split(" ").length >= 2 && /^[\p{L}'’ʼ\-\s]+$/u.test(n);
    }

    // ---------- стан ----------
    const S = {
        name: "", pid: "", passHash: "", files: {}, serverTs: {},
        dirty: new Set(), offline: false, finished: false,
        saving: false, again: false, timer: null, populated: false, gotMessage: false, lastSaved: null,
    };
    let frame = null;
    let statusEl = null;

    // ---------- локальна копія ----------
    const lsKey = () => "ol:" + OID + ":" + S.pid;
    function loadLocal() {
        try { return JSON.parse(localStorage.getItem(lsKey()) || "null"); } catch (e) { return null; }
    }
    function saveLocal() {
        try { localStorage.setItem(lsKey(), JSON.stringify({ files: S.files, ts: Date.now(), passHash: S.passHash, finished: S.finished })); } catch (e) { /* ignore */ }
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
            return await resp.json();
        } finally { clearTimeout(timeout); }
    }

    // ---------- заготовка файлу із задачею (умова — закоментований текст) ----------
    function commentLines(text) {
        return String(text || "").split("\n").map((l) => (l ? "# " + l : "#"));
    }
    function buildStarter(t, i) {
        const L = ["# Задача " + (i + 1) + ". " + (t.title || ""), "#"];
        L.push(...commentLines(t.statement));
        if (t.input) L.push("#", "# Вхідні дані:", ...commentLines(t.input));
        if (t.output) L.push("#", "# Вихідні дані:", ...commentLines(t.output));
        (t.examples || []).forEach((ex, k) => {
            L.push("#", "# Приклад " + (k + 1) + ":", "#   Вхід:", ...String(ex.input).split("\n").map((l) => "#     " + l),
                "#   Вихід:", ...String(ex.output).split("\n").map((l) => "#     " + l));
        });
        L.push("#", "# ---------- Пишіть розв'язок нижче ----------", "", "");
        return L.join("\n");
    }

    // ---------- екран реєстрації ----------
    function renderLogin(prefillError) {
        document.title = cfg.title;
        const nameInput = h("input", { type: "text", id: "olName", autocomplete: "off", placeholder: "Прізвище Ім'я По батькові" });
        const passInput = h("input", { type: "password", id: "olPass", autocomplete: "off", placeholder: "Пароль (запам'ятайте його)" });
        const errorBox = h("div", { class: "ol-error", style: "display:none" });
        const startBtn = h("button", { type: "button", class: "btn btn-main", text: "Розпочати" });
        const card = h("div", { class: "ol-card" },
            h("h1", { text: cfg.title }),
            h("p", { text: cfg.subtitle || "Введіть своє ПІБ і придумайте пароль." }),
            h("div", { class: "ol-field" }, h("label", { for: "olName", text: "ПІБ" }), nameInput),
            h("div", { class: "ol-field" }, h("label", { for: "olPass", text: "Пароль" }), passInput),
            h("p", { text: "Якщо ви вже починали, введіть ті самі ПІБ і пароль, щоб продовжити з того місця, де зупинились." }),
            errorBox,
            h("div", { class: "ol-actions" }, startBtn));
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

    function userError(msg) { const e = new Error(msg); e.userMessage = msg; return e; }

    async function startSession(rawName, password) {
        S.name = String(rawName).trim().replace(/\s+/g, " ");
        S.pid = (await sha256(OID + "|" + normalizeName(rawName))).slice(0, 16);
        S.passHash = await sha256(OID + "|" + S.pid + "|" + password);

        let server = null;
        if (cfg.backendUrl) {
            try { server = await api("login"); }
            catch (e) { S.offline = true; }
            if (server && !server.ok) {
                if (server.error === "wrong_password") throw userError("Невірний пароль для цього ПІБ. Якщо це перший вхід, перевірте правильність написання ПІБ.");
                if (server.error === "bad_token") throw userError("Помилка налаштування сервера (токен). Повідомте вчителя.");
                S.offline = true;           // інша помилка сервера: працюємо локально
                server = null;
            }
        } else {
            S.offline = true;
        }

        const local = loadLocal();
        if (local && local.passHash && local.passHash !== S.passHash) {
            throw userError("Невірний пароль для цього ПІБ.");
        }

        // Початкові файли = задачі; потім поверх — збережене (сервер/локальна копія, що новіша)
        const files = {};
        tasks.forEach((t, i) => { files[fileName(t, i)] = buildStarter(t, i); });
        S.dirty.clear();
        if (server && server.files) {
            Object.entries(server.files).forEach(([name, f]) => {
                files[name] = f.content;
                S.serverTs[name] = Date.parse(f.updatedAt) || 0;
            });
        }
        if (local && local.files) {
            Object.entries(local.files).forEach(([name, content]) => {
                const serverTs = S.serverTs[name];
                if (serverTs === undefined || (local.ts || 0) > serverTs) {
                    if (files[name] !== content) { files[name] = content; S.dirty.add(name); }
                }
            });
        }
        S.files = files;
        S.finished = !!(server && server.finished) || !!(local && local.finished && S.offline);
        saveLocal();

        if (S.finished) return renderDone();
        renderWorkspace();
        if (S.dirty.size) scheduleFlush(1500);       // дозалити те, що було лише локально
    }

    // ---------- робочий екран ----------
    function setStatus(text, kind) {
        if (!statusEl) return;
        statusEl.textContent = text;
        statusEl.className = "ol-status" + (kind ? " " + kind : "");
    }
    function timeStr(d) { return d.toLocaleTimeString("uk-UA", { hour: "2-digit", minute: "2-digit", second: "2-digit" }); }

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
        const files = tasks.map((t, i) => ({ name: fileName(t, i), content: S.files[fileName(t, i)] }));
        // файли, яких немає серед задач (наприклад, збережені раніше), теж передаємо
        Object.keys(S.files).forEach((n) => { if (!files.some((f) => f.name === n)) files.push({ name: n, content: S.files[n] }); });
        frame.contentWindow.postMessage({ eventType: "populateCode", language: "python", files }, "*");
        S.populated = true;
    }

    function renderWorkspace() {
        statusEl = h("span", { class: "ol-status", text: "" });
        const downloadBtn = h("button", { type: "button", class: "btn btn-light", text: "⬇ Завантажити файли", onclick: downloadAll });
        const finishBtn = h("button", { type: "button", class: "btn btn-main", text: "Завершити роботу", onclick: finishWork });
        const bar = h("div", { class: "ol-bar" }, h("span", { class: "ol-who", text: "👤 " + S.name }), statusEl, downloadBtn, finishBtn);

        frame = h("iframe", { title: "Редактор Python", src: editorUrl(), allow: "clipboard-read; clipboard-write" });
        const layout = h("div", { class: "ol-layout" },
            h("aside", { class: "ol-tasks" }, tasks.map(taskPanel)),
            h("section", { class: "ol-editor" }, frame));

        app.innerHTML = "";
        app.append(bar, layout);
        if (DEBUG) app.append(h("div", { class: "ol-debug", id: "olDebug", text: "debug: очікуємо повідомлення редактора…" }));

        frame.addEventListener("load", () => {
            populate();
            setTimeout(() => { if (!S.gotMessage) populate(); }, 2500);     // редактор міг ще не підняти слухач
            setTimeout(() => { if (!S.gotMessage) populate(); }, 6000);
        });
        if (S.offline) {
            setStatus(cfg.backendUrl ? "⚠ Немає зв'язку із сервером — працюємо локально, спробуємо надіслати пізніше" : "Режим без сервера: файли зберігаються лише на цьому комп'ютері", "warn");
        } else {
            setStatus("Готово до роботи", "ok");
        }
    }

    // ---------- повідомлення від редактора ----------
    function extractFiles(d) {
        if (!d || typeof d !== "object") return null;
        if (Array.isArray(d.files)) {
            const list = d.files.filter((f) => f && typeof f.content === "string")
                .map((f) => ({ name: String(f.name || "main.py"), content: f.content }));
            return list.length ? list : null;
        }
        if (typeof d.code === "string") return [{ name: String(d.name || d.fileName || "main.py"), content: d.code }];
        if (typeof d.content === "string") return [{ name: String(d.name || "main.py"), content: d.content }];
        return null;
    }

    window.addEventListener("message", (ev) => {
        if (!frame || ev.source !== frame.contentWindow) return;            // лише від нашого редактора
        if (DEBUG) {
            const box = document.getElementById("olDebug");
            if (box) box.textContent = "останнє повідомлення:\n" + JSON.stringify(ev.data, null, 1).slice(0, 1500);
        }
        if (S.finished || !S.populated) return;
        const files = extractFiles(ev.data);
        if (!files) return;
        S.gotMessage = true;
        let changed = false;
        files.forEach((f) => {
            if (S.files[f.name] !== f.content) { S.files[f.name] = f.content; S.dirty.add(f.name); changed = true; }
        });
        if (changed) onChanged();
    });

    // ---------- автозбереження ----------
    function onChanged() {
        saveLocal();
        setStatus("● Є незбережені зміни…", "warn");
        scheduleFlush((cfg.autosaveSeconds || 10) * 1000);
    }
    function scheduleFlush(ms) {
        if (S.timer) return;                                  // не скидаємо таймер: зберігаємо регулярно
        S.timer = setTimeout(() => { S.timer = null; flush(); }, ms);
    }

    async function flush() {
        if (S.timer) { clearTimeout(S.timer); S.timer = null; }
        if (S.finished || !S.dirty.size) return true;
        if (!cfg.backendUrl) {
            setStatus("Режим без сервера: збережено на цьому комп'ютері. Наприкінці натисніть «Завантажити файли».", "warn");
            return true;
        }
        if (S.saving) { S.again = true; return false; }
        const names = Array.from(S.dirty);
        const sent = {};
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
                S.finished = true; saveLocal(); renderDone(); return true;
            } else if (res && res.error === "too_long") {
                setStatus("⚠ Один із файлів завеликий для збереження на сервері", "bad");
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

    // зберігаємо, коли вкладка/вікно втрачає видимість або закривається
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

    // ---------- завантаження файлів ----------
    function downloadFile(name, content) {
        const url = URL.createObjectURL(new Blob([content], { type: "text/x-python;charset=utf-8" }));
        const a = h("a", { href: url, download: name });
        document.body.append(a); a.click(); a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 2000);
    }
    function downloadAll() {
        Object.keys(S.files).forEach((n, i) => setTimeout(() => downloadFile(n, S.files[n]), i * 400));
    }

    // ---------- завершення ----------
    async function finishWork() {
        if (!window.confirm("Завершити роботу? Після цього змінювати розв'язки буде неможливо.")) return;
        setStatus("Завершуємо…");
        const saved = await flush();
        if (cfg.backendUrl && (!saved || S.dirty.size)) {
            window.alert("Не вдалося зберегти останні зміни на сервер. Перевірте зв'язок і спробуйте ще раз.");
            setStatus("⚠ Не завершено: зміни не збережено на сервер", "bad");
            return;
        }
        if (cfg.backendUrl) {
            try {
                const res = await api("finish");
                if (!res || !res.ok) throw new Error((res && res.error) || "bad_response");
            } catch (e) {
                window.alert("Не вдалося завершити роботу на сервері. Спробуйте ще раз.");
                setStatus("⚠ Не завершено: помилка сервера", "bad");
                return;
            }
        }
        S.finished = true;
        saveLocal();
        renderDone();
    }

    function renderDone() {
        frame = null; statusEl = null;
        const names = Object.keys(S.files);
        app.innerHTML = "";
        app.append(h("div", { class: "ol-card" },
            h("h1", { text: "Роботу завершено" }),
            h("p", { text: "Дякуємо, " + S.name + "! Ваші розв'язки збережено." + (cfg.backendUrl ? "" : " Завантажте файли та передайте їх вчителю.") }),
            h("div", { class: "ol-actions" },
                h("button", { type: "button", class: "btn btn-main", text: "⬇ Завантажити файли (" + names.length + ")", onclick: downloadAll }))));
    }

    renderLogin();
})();
