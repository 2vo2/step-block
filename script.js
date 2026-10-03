/* ==================================================================
   НАЛАШТУВАННЯ — усе наповнення сторінок змінюється тут.

   Напрямок:  id, name, full (повна назва), logo (необов'язково)
   Рік:       title + масив sites (може бути порожнім [])
   Сайт:      id (унікальний у межах напрямку), name, desc, logo
              + АБО url (одне посилання), АБО links (кілька посилань):
                links: [ { id: "...", name: "...", url: "..." }, ... ]
   Колір картки призначається автоматично (синій → зелений → помаранчевий).
   За потреби можна задати свій: color: "var(--green)" або "#28A745".
   ================================================================== */
const DIRECTIONS = [
    {
        id: "pk", name: "ПК", full: "Перший Крок", logo: "", color: "var(--green)",
        years: [
            { title: "1 рік навчання", sites: [] },
            { title: "2 рік навчання", sites: [] }
        ]
    },
    {
        id: "mka-9-12", name: "МКА 9–12", full: "Мала Комп'ютерна Академія, 9–12 років", logo: "", color: "var(--blue)",
        years: [
            {
                title: "1 рік навчання", sites: [
                    { id: "vrlab", name: "VR LAB", desc: "3D-моделювання", logo: "", url: "https://www.tinkercad.com/" },
                    { id: "aidesign", name: "AI DESIGN", desc: "3D-моделювання", logo: "", links: [
                        { id: "canva", name: "Canva", url: "https://www.canva.com/" },
                        { id: "wix", name: "Wix", url: "https://uk.wix.com/" }
                    ]},
                    { id: "3dgamecreator", name: "3D GAME CREATOR", desc: "Розробка ігор в Kodu", logo: "", url: "https://www.kodugamelab.com/" },
                    { id: "arcadelab", name: "ARCADE LAB", desc: "Розробка ігор в Construct 3", logo: "", url: "https://editor.construct.net/" },
                    { id: "gamedesign", name: "ІГРОВИЙ ДИЗАЙН", desc: "Ігровий дизайн", logo: "", url: "https://www.photopea.com/" },
                    { id: "robotai", name: "РОБОТОТЕХНІКА AI", desc: "Робототехніка LEGO", logo: "", links: [
                        { id: "inst", name: "Інструкції", url: "https://www.lego.com/uk-ua/service/building-instructions/51515" },
                        { id: "vrvex", name: "VR VEX", url: "https://vr.vex.com/" }
                    ]}
                ]
            },
            {
                title: "2 рік навчання", sites: [
                    { id: "photolab", name: "PHOTO LAB", desc: "Фотолабораторія", logo: "", links: [
                        { id: "photopea", name: "Photopea", url: "https://www.photopea.com/" },
                        { id: "camerasim", name: "CameraSim", url: "https://www.camerasim.com/" }
                    ]},
                    { id: "designroom3d", name: "DESIGN ROOM 3D", desc: "Проєктування інтер'єру", logo: "", links: [
                        { id: "roomstyler", name: "Roomstyler", url: "https://roomstyler.com/" },
                        { id: "sweethome3d", name: "Sweet Home 3D", url: "https://www.sweethome3d.com/" },
                        { id: "planner5d", name: "Planner 5D", url: "https://planner5d.com/" }
                    ]},
                    { id: "webart", name: "WEB ART", desc: "Веб-дизайн(HTML-CSS-JS)", logo: "", url: "https://onecompiler.com/html" },
                    { id: "smartgadgetslab", name: "SMART GADGETS LAB", desc: "Робототехніка Micro:bit", logo: "", url: "https://makecode.microbit.org/#" },
                    { id: "minecraftai", name: "MINECRAFT AI", desc: "Minecraft Education", logo: "", url: "https://education.minecraft.net/en-us" },
                    { id: "pythonai", name: "PYTHON AI", desc: "Програмування Python Junior", logo: "", url: "https://onecompiler.com/python" }
                ]
            },
            {
                title: "3 рік навчання", sites: [
                    { id: "mobilear", name: "МОБІЛЬНІ ЗАСТОСУНКИ AR", desc: "Розробка мобільних застосунків", logo: "", links: [
                        { id: "kodular", name: "Kodular", url: "https://www.kodular.io/" },
                        { id: "thunkable", name: "Thunkable", url: "https://thunkable.com/" }
                    ]},
                    { id: "pythonlab", name: "PYTHON LAB", desc: "Програмування Python Middle", logo: "", url: "https://www.jetbrains.com/pycharm/download/?section=windows" },
                    { id: "roblox", name: "ROBLOX", desc: "Розробка ігор в Roblox Studio", logo: "", url: "https://create.roblox.com/landing" },
                    { id: "conceptart", name: "CONCEPT ART", desc: "Створення концепт-артів в Krita", logo: "", url: "https://krita.org/uk/" },
                    { id: "blogging", name: "БЛОГІНГ", desc: "Створення відео для соц.мереж", logo: "", links: [
                        { id: "capcut", name: "CapCut", url: "https://www.capcut.com/uk-ua/tools/online-video-editor" },
                        { id: "vnvideo", name: "VN Video", url: "https://vlognow.me/" },
                        { id: "flexclip", name: "FlexClip", url: "https://www.flexclip.com/" }
                    ]},
                    { id: "smarttechlab", name: "SMARTTECH LAB", desc: "Робототехніка Arduion UNO", logo: "", url: "https://www.tinkercad.com/" }
                ]
            },
            {
                title: "4 рік навчання", sites: [
                    { id: "unrealengine", name: "UNREAL ENGINE", desc: "Розробка ігор в Unreal Engine", logo: "", url: "https://www.unrealengine.com/" },
                    { id: "figma", name: "ВЕБДИЗАЙН", desc: "Вебдизайн в Figma", logo: "", url: "https://www.figma.com/" },
                    { id: "opentoonz", name: "АНІМАЦІЯ ТА МУЛЬТИПЛІКАЦІЯ", desc: "Анімація в OpenToonz", logo: "", url: "https://opentoonz.github.io/e/index.html" },
                    { id: "digitalart", name: "DIGITAL ART", desc: "Розробка бренд-стилю в векторній графіці", logo: "", url: "https://www.vectorpea.com/" },
                    { id: "videolab", name: "VIDEO LAB", desc: "Монтаж відео в DaVinci Resolve", logo: "", url: "https://www.blackmagicdesign.com/ua/products/davinciresolve" },
                    { id: "pythonprolab", name: "PYTHON PRO LAB", desc: "Програмування Python Senior", logo: "", links: [
                        { id: "pycharm", name: "PyCharm", url: "https://www.jetbrains.com/pycharm/download/?section=windows" },
                        { id: "github", name: "GitHub", url: "https://github.com/" }
                    ]}
                ]
            },
            {
                title: "5 рік навчання", sites: [
                    { id: "unity", name: "AI ГЕЙМПЛЕЙ", desc: "Розробка ігор в Unity", logo: "", url: "https://unity.com/" },
                    { id: "intech", name: "ІННОВАЦІЙНІ ТЕХНОЛОГІЇ", desc: "Робототехніка мікроконтролерів", logo: "", url: "https://www.tinkercad.com/" },
                    { id: "blenderpro", name: "BLENDER PRO", desc: "Моделювання в Blender", logo: "", url: "https://www.blender.org/" },
                    { id: "startup", name: "СТАРТАП І ФРІЛАНС", desc: "Створення стартапу", logo: "", links: [
                        { id: "googledocs", name: "Google Docs", url: "https://accounts.google.com/v3/signin/identifier?continue=https://docs.google.com/document/create?hl%3Duk&followup=https://docs.google.com/document/create?hl%3Duk&hl=uk&ltmpl=docs&osid=1&passive=1209600&service=wise&flowName=GlifWebSignIn&flowEntry=ServiceLogin&dsh=S1594020056:1791021852391644" },
                        { id: "googlesheets", name: "Google Sheets", url: "https://accounts.google.com/v3/signin/identifier?continue=https://docs.google.com/spreadsheets/create&followup=https://docs.google.com/spreadsheets/create&ltmpl=sheets&osid=1&passive=1209600&service=wise&flowName=GlifWebSignIn&flowEntry=ServiceLogin&dsh=S1694858396:1791021873973920" }
                    ]},
                    { id: "aiassistant", name: "AI ASSISTANT", desc: "Розробка ШІ-помічника", logo: "", url: "https://www.jetbrains.com/pycharm/download/?section=windows" }
                ]
            }
        ]
    },
    {
        id: "mka-13-14", name: "МКА 13–14", full: "Мала Комп'ютерна Академія, 13–14 років", logo: "", color: "var(--amber)",
        years: [
            {
                title: "1 рік навчання", sites: [
                    { id: "mobilear", name: "МОБІЛЬНІ ЗАСТОСУНКИ AR", desc: "Розробка мобільних застосунків", logo: "", links: [
                        { id: "kodular", name: "Kodular", url: "https://www.kodular.io/" },
                        { id: "thunkable", name: "Thunkable", url: "https://thunkable.com/" }
                    ]},
                    { id: "roblox", name: "ROBLOX", desc: "Розробка ігор в Roblox Studio", logo: "", url: "https://create.roblox.com/landing" },
                    { id: "blogging", name: "БЛОГІНГ", desc: "Створення відео для соц.мереж", logo: "", links: [
                        { id: "capcut", name: "CapCut", url: "https://www.capcut.com/uk-ua/tools/online-video-editor" },
                        { id: "vnvideo", name: "VN Video", url: "https://vlognow.me/" },
                        { id: "flexclip", name: "FlexClip", url: "https://www.flexclip.com/" }
                    ]},
                    { id: "pythonlab", name: "PYTHON LAB", desc: "Програмування Python Middle", logo: "", url: "https://www.jetbrains.com/pycharm/download/?section=windows" },
                    { id: "conceptart", name: "CONCEPT ART", desc: "Створення концепт-артів в Krita", logo: "", url: "https://krita.org/uk/" },
                    { id: "smarttechlab", name: "SMARTTECH LAB", desc: "Робототехніка Arduion UNO", logo: "", url: "https://www.tinkercad.com/" }
                ]
            },
            {
                title: "2 рік навчання", sites: [
                    { id: "unrealengine", name: "UNREAL ENGINE", desc: "Розробка ігор в Unreal Engine", logo: "", url: "https://www.unrealengine.com/" },
                    { id: "videolab", name: "VIDEO LAB", desc: "Монтаж відео в DaVinci Resolve", logo: "", url: "https://www.blackmagicdesign.com/ua/products/davinciresolve" },
                    { id: "opentoonz", name: "АНІМАЦІЯ ТА МУЛЬТИПЛІКАЦІЯ", desc: "Анімація в OpenToonz", logo: "", url: "https://opentoonz.github.io/e/index.html" },
                    { id: "digitalart", name: "DIGITAL ART", desc: "Розробка бренд-стилю в векторній графіці", logo: "", url: "https://www.vectorpea.com/" },
                    { id: "figma", name: "ВЕБДИЗАЙН", desc: "Вебдизайн в Figma", logo: "", url: "https://www.figma.com/" },
                    { id: "pythonprolab", name: "PYTHON PRO LAB", desc: "Програмування Python Senior", logo: "", links: [
                        { id: "pycharm", name: "PyCharm", url: "https://www.jetbrains.com/pycharm/download/?section=windows" },
                        { id: "github", name: "GitHub", url: "https://github.com/" }
                    ]}
                ]
            },
            {
                title: "3 рік навчання", sites: [
                    { id: "unity", name: "AI ГЕЙМПЛЕЙ", desc: "Розробка ігор в Unity", logo: "", url: "https://unity.com/" },
                    { id: "blenderpro", name: "BLENDER PRO", desc: "Моделювання в Blender", logo: "", url: "https://www.blender.org/" },
                    { id: "intech", name: "ІННОВАЦІЙНІ ТЕХНОЛОГІЇ", desc: "Робототехніка мікроконтролерів", logo: "", url: "https://www.tinkercad.com/" },
                    { id: "startup", name: "СТАРТАП І ФРІЛАНС", desc: "Створення стартапу", logo: "", links: [
                        { id: "googledocs", name: "Google Docs", url: "https://accounts.google.com/v3/signin/identifier?continue=https://docs.google.com/document/create?hl%3Duk&followup=https://docs.google.com/document/create?hl%3Duk&hl=uk&ltmpl=docs&osid=1&passive=1209600&service=wise&flowName=GlifWebSignIn&flowEntry=ServiceLogin&dsh=S1594020056:1791021852391644" },
                        { id: "googlesheets", name: "Google Sheets", url: "https://accounts.google.com/v3/signin/identifier?continue=https://docs.google.com/spreadsheets/create&followup=https://docs.google.com/spreadsheets/create&ltmpl=sheets&osid=1&passive=1209600&service=wise&flowName=GlifWebSignIn&flowEntry=ServiceLogin&dsh=S1694858396:1791021873973920" }
                    ]},
                    { id: "aiassistant", name: "AI ASSISTANT", desc: "Розробка ШІ-помічника", logo: "", url: "https://www.jetbrains.com/pycharm/download/?section=windows" }
                ]
            }
        ]
    }
];

/* ==================== Код (зазвичай не чіпати) ==================== */
const $ = (id) => document.getElementById(id);
const frame = $("frame");
let currentSite = null, currentFrameUrl = "";

// Автоматичні кольори карток: синій → зелений → помаранчевий (з палітри в style.css)
const ACCENTS = ["var(--blue)", "var(--green)", "var(--amber)"];

function pluralYears(n) { return n === 1 ? "рік" : (n >= 2 && n <= 4 ? "роки" : "років"); }

function logoBox(item) {
    const box = document.createElement("div");
    box.className = "logo";
    const mono = () => { const m = document.createElement("span"); m.className = "mono"; m.textContent = item.name.charAt(0); return m; };
    if (item.logo) {
        const img = document.createElement("img");
        img.src = item.logo; img.alt = "";
        img.onerror = () => { box.innerHTML = ""; box.append(mono()); };
        box.append(img);
    } else box.append(mono());
    return box;
}

function makeCard(item, titleText, descText, goText, onClick, metaText) {
    const card = document.createElement("button");
    card.type = "button"; card.className = "card";
    if (item.color) card.style.setProperty("--accent", item.color);
    const h = document.createElement("h2"); h.textContent = titleText;
    card.append(logoBox(item), h);
    if (metaText) { const m = document.createElement("div"); m.className = "meta"; m.textContent = metaText; card.append(m); }
    if (descText) { const p = document.createElement("p"); p.textContent = descText; card.append(p); }
    const go = document.createElement("span"); go.className = "go"; go.textContent = goText;
    card.append(go);
    card.addEventListener("click", onClick);
    return card;
}

// Картка предмета з кількома посиланнями
function makeMultiCard(item, d) {
    const card = document.createElement("div");
    card.className = "card multi";
    if (item.color) card.style.setProperty("--accent", item.color);
    const h = document.createElement("h2"); h.textContent = item.name;
    const p = document.createElement("p"); p.textContent = item.desc || "";
    const box = document.createElement("div"); box.className = "links";
    item.links.forEach((l) => {
        const b = document.createElement("button");
        b.type = "button"; b.className = "btn btn-main";
        b.textContent = l.name;
        b.addEventListener("click", () => { location.hash = "#" + d.id + "/" + item.id + "/" + l.id; });
        box.append(b);
    });
    card.append(logoBox(item), h, p, box);
    return card;
}

// --- Кнопки в шапці (відкриваються в новому вікні) ---
const HEADER_LINKS = [
    { name: "MyStat", url: "https://mystat.itstep.org/" },
    { name: "Teams", url: "https://teams.microsoft.com/" }
];
document.querySelectorAll(".top-inner").forEach((inner) => {
    const nav = document.createElement("nav");
    nav.className = "top-links";
    HEADER_LINKS.forEach((l) => {
        const a = document.createElement("a");
        a.href = l.url; a.target = "_blank"; a.rel = "noopener";
        a.className = "btn btn-top"; a.textContent = l.name + " ↗";
        nav.append(a);
    });
    inner.append(nav);
});

// --- Сторінка 1: напрямки ---
DIRECTIONS.forEach((d, i) => {
    if (!d.color) d.color = ACCENTS[i % ACCENTS.length];
    const n = d.years.length;
    $("dirGrid").append(makeCard(d, d.name, d.full, "Обрати", () => { location.hash = "#" + d.id; }, n + " " + pluralYears(n) + " навчання"));
});

// --- Сторінка 2: роки та предмети ---
function renderDirection(d) {
    $("dirTitle").textContent = d.name;
    $("dirLead").textContent = d.full + ". Оберіть свій рік навчання та предмет.";
    $("dirCrumb").textContent = d.full;
    const wrap = $("years"); wrap.innerHTML = "";
    d.years.forEach((y) => {
        const sec = document.createElement("section"); sec.className = "year";
        const t = document.createElement("div"); t.className = "year-title"; t.textContent = y.title;
        sec.append(t);
        if (y.sites.length) {
            const g = document.createElement("div"); g.className = "grid";
            y.sites.forEach((s, i) => {
                if (!s.color) s.color = ACCENTS[i % ACCENTS.length];
                g.append(s.links
                    ? makeMultiCard(s, d)
                    : makeCard(s, s.name, s.desc, "Відкрити", () => { location.hash = "#" + d.id + "/" + s.id; }));
            });
            sec.append(g);
        } else {
            const e = document.createElement("div"); e.className = "empty"; e.textContent = "Предмети для цього року ще не додано.";
            sec.append(e);
        }
        wrap.append(sec);
    });
}

// --- Маршрутизація через #hash (працює кнопка «назад» у SEB) ---
function route() {
    const [dirId, siteId, linkId] = location.hash.slice(1).split("/");
    const d = DIRECTIONS.find((x) => x.id === dirId);
    if (!d) { show("home"); document.title = "StepBlock"; return; }

    if (siteId) {
        const s = d.years.flatMap((y) => y.sites).find((x) => x.id === siteId);
        const target = s && (s.links ? s.links.find((l) => l.id === linkId) : s);
        if (target) {
            currentSite = target;
            $("barTitle").textContent = d.name + " · " + s.name + (s.links ? " · " + target.name : "");
            if (currentFrameUrl !== target.url) { frame.src = target.url; currentFrameUrl = target.url; }
            document.title = target.name + " — StepBlock";
            show("viewer"); return;
        }
    }
    renderDirection(d);
    document.title = d.name + " — StepBlock";
    show("direction");
}

function show(view) {
    document.body.dataset.view = view;
    if (view !== "viewer") { frame.src = "about:blank"; currentFrameUrl = ""; currentSite = null; }
    window.scrollTo(0, 0);
}

$("toHome").addEventListener("click", () => { location.hash = ""; });
// Назад з сайту → на сторінку напрямку
$("backBtn").addEventListener("click", () => { location.hash = "#" + location.hash.slice(1).split("/")[0]; });
$("reloadBtn").addEventListener("click", () => { if (currentSite) frame.src = currentSite.url; });
// Запасний варіант, якщо сайт забороняє вбудовування
$("directBtn").addEventListener("click", () => { if (currentSite) location.href = currentSite.url; });

window.addEventListener("hashchange", route);
route();