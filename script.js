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
    },
    {
        id: "useful", name: "Корисні посилання", full: "Підбірка корисних сервісів за категоріями", logo: "", color: "var(--blue-light)",
        categories: true,   // замість років навчання — категорії
        newWindow: true,    // сервіси відкриваються в новому вікні + випадаюче меню в обгортці
        years: [
            {
                title: "Ігри з дітьми", sites: [
                    { id: "kahoot", name: "Kahoot!", desc: "Вікторини та інтерактивні опитування", logo: "", url: "https://kahoot.it/" },
                    { id: "wordwall", name: "Wordwall", desc: "Ігри та вправи для закріплення матеріалу", logo: "", url: "https://wordwall.net/" },
                    { id: "blooket", name: "Blooket", desc: "Ігрові вікторини для класу", logo: "", url: "https://www.blooket.com/" },
                    { id: "learningapps", name: "LearningApps", desc: "Інтерактивні навчальні вправи", logo: "", url: "https://learningapps.org/" }
                ]
            },
            {
                title: "Додаткове програмування", sites: [
                    { id: "codeorg2", name: "Code.org", desc: "Курси та «Година коду»", logo: "", url: "https://code.org/" },
                    { id: "khanacademy", name: "Khan Academy", desc: "Безкоштовні курси з програмування", logo: "", url: "https://www.khanacademy.org/" },
                    { id: "freecodecamp", name: "freeCodeCamp", desc: "Практика з веброзробки", logo: "", url: "https://www.freecodecamp.org/" },
                    { id: "w3schools2", name: "W3Schools", desc: "Довідник з HTML, CSS, JavaScript", logo: "", url: "https://www.w3schools.com/" }
                ]
            },
            {
                title: "Дизайн і графіка", sites: [
                    { id: "canva2", name: "Canva", desc: "Дизайн презентацій, постерів, відео", logo: "", url: "https://www.canva.com/" },
                    { id: "coolors", name: "Coolors", desc: "Підбір кольорових палітр", logo: "", url: "https://coolors.co/" },
                    { id: "figma2", name: "Figma", desc: "Макети інтерфейсів та вебдизайн", logo: "", url: "https://www.figma.com/" }
                ]
            },
            {
                title: "Робота в команді", sites: [
                    { id: "miro", name: "Miro", desc: "Онлайн-дошка для ідей і схем", logo: "", url: "https://miro.com/" },
                    { id: "padlet", name: "Padlet", desc: "Дошка для спільних нотаток і ідей", logo: "", url: "https://padlet.com/" }
                ]
            }
        ]
    }
];

/* ==================================================================
   StepSchool: клас → предмет → сайти
   Клас:    id (унікальний, з префіксом school-), name, full (підпис),
            school: true, years: ПРЕДМЕТИ класу (title = назва предмета, sites = сайти)
   Сайт:    так само, як в академії (id, name, desc, logo, url або links)
   Приклад заповнено лише для «5 клас», решту класів додайте так само.
   ================================================================== */
const SCHOOL_CLASSES = [
    { id: "school-1", name: "1 клас", full: "StepSchool · 1 клас", school: true, years: [] },
    { id: "school-2", name: "2 клас", full: "StepSchool · 2 клас", school: true, years: [] },
    { id: "school-3", name: "3 клас", full: "StepSchool · 3 клас", school: true, years: [] },
    { id: "school-4", name: "4 клас", full: "StepSchool · 4 клас", school: true, years: [] },
    {
        id: "school-5", name: "5 клас", full: "StepSchool · 5 клас", school: true,
        years: [
            {
                title: "Інформатика", sites: [
                    { id: "codeorg", name: "Code.org", desc: "Курси та «Година коду»", logo: "", url: "https://code.org/" },
                    { id: "tinkercad", name: "TinkerCAD", desc: "3D-моделювання", logo: "", url: "https://www.tinkercad.com/" }
                ]
            },
            {
                title: "Математика", sites: [
                    { id: "khan", name: "Khan Academy", desc: "Відеоуроки та вправи", logo: "", url: "https://www.khanacademy.org/" }
                ]
            },
            {
                title: "Творчість", sites: [
                    { id: "canva", name: "Canva", desc: "Дизайн презентацій і постерів", logo: "", url: "https://www.canva.com/" }
                ]
            }
        ]
    },
    { id: "school-6", name: "6 клас", full: "StepSchool · 6 клас", school: true, years: [] },
    { id: "school-7", name: "7 клас", full: "StepSchool · 7 клас", school: true, years: [] },
    { id: "school-8", name: "8 клас", full: "StepSchool · 8 клас", school: true, years: [] },
    { id: "school-9", name: "9 клас", full: "StepSchool · 9 клас", school: true, years: [] },
    { id: "school-10", name: "10 клас", full: "StepSchool · 10 клас", school: true, years: [] },
    { id: "school-11", name: "11 клас", full: "StepSchool · 11 клас", school: true, years: [] }
];

// «Корисні посилання» StepSchool: сервіси відкриваються в новому вікні, є меню в обгортці.
// Зараз використовується той самий список, що й в академії. Щоб зробити власний —
// замініть years на свій масив категорій (title + sites).
const SCHOOL_USEFUL = {
    id: "school-useful", name: "Корисні посилання", full: "Підбірка корисних сервісів за категоріями",
    school: true, categories: true, newWindow: true,
    years: DIRECTIONS.find((d) => d.id === "useful").years
};

const ALL_DIRECTIONS = DIRECTIONS.concat(SCHOOL_CLASSES, [SCHOOL_USEFUL]);

/* ==================== Перевірка: сторінку відкрито в SEB ====================
   SEB додає до user agent рядок "SEB/версія". Для тестів у звичайному
   браузері поставте REQUIRE_SEB = false (перед роздачею поверніть true).
   Це проста перевірка: вона відсікає випадкове відкриття сайту, але
   НЕ захищає від навмисної підміни user agent. */
const REQUIRE_SEB = true;

if (REQUIRE_SEB && !/\bSEB\//i.test(navigator.userAgent)) {
    document.title = "Потрібен Safe Exam Browser";
    document.body.className = "gate-page";
    document.body.innerHTML =
        '<div class="gate"><div class="gate-mark">IT</div>' +
        '<h1>Відкрийте сторінку через Safe Exam Browser</h1>' +
        '<p>Цей сайт працює лише в безпечному середовищі. ' +
        'Закрийте браузер і запустіть Safe Exam Browser.</p></div>';
    throw new Error("Сторінку відкрито не в Safe Exam Browser");
}

/* ==================== Код (зазвичай не чіпати) ==================== */
const $ = (id) => document.getElementById(id);
const frame = $("frame");
let currentSite = null, currentFrameUrl = "";
let parentHash = "#academy";   // куди веде «До вибору …» зі сторінки напряму/класу

// Автоматичні кольори карток: синій → зелений → помаранчевий (з палітри в style.css)
const ACCENTS = ["var(--blue)", "var(--green)", "var(--amber)"];

function pluralCats(n) { return n === 1 ? "категорія" : (n >= 2 && n <= 4 ? "категорії" : "категорій"); }
function pluralSubj(n) { return n === 1 ? "предмет" : (n >= 2 && n <= 4 ? "предмети" : "предметів"); }
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

function makeCard(item, titleText, descText, goText, onClick, metaText, href) {
    const card = document.createElement(href ? "a" : "button");
    card.className = "card";
    if (href) { card.href = href; card.target = "_blank"; card.rel = "noopener"; } else card.type = "button";
    if (item.color) card.style.setProperty("--accent", item.color);
    if (item.color === "var(--amber)") card.classList.add("on-light");   // темний текст на жовтій/помаранчевій плашці
    const h = document.createElement("h2"); h.textContent = titleText;
    card.append(logoBox(item), h);
    if (metaText) { const m = document.createElement("div"); m.className = "meta"; m.textContent = metaText; card.append(m); }
    if (descText) { const p = document.createElement("p"); p.textContent = descText; card.append(p); }
    const go = document.createElement("span"); go.className = "go"; go.textContent = goText;
    card.append(go);
    if (!href) card.addEventListener("click", onClick);
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
        const b = document.createElement(d.newWindow ? "a" : "button");
        b.className = "btn btn-main";
        b.textContent = l.name;
        if (d.newWindow) { b.href = l.url; b.target = "_blank"; b.rel = "noopener"; b.textContent += " ↗"; }
        else { b.type = "button"; b.addEventListener("click", () => { location.hash = "#" + d.id + "/" + item.id + "/" + l.id; }); }
        box.append(b);
    });
    card.append(logoBox(item), h, p, box);
    return card;
}

// --- Нова головна: вибір розділу (StepSchool / ITSTEP Academy) ---
// Змінюйте назви, описи, логотипи (шлях у logo) та кольори тут
const LANDING_CARDS = [
    { name: "StepSchool", desc: "Класи, предмети та корисні посилання", logo: "", color: "var(--green)", hash: "#school" },
    { name: "ITSTEP Academy", desc: "Курси, напрями та корисні посилання", logo: "", color: "var(--blue)", hash: "#academy" }
];

function makeHeader(title = "StepBlock", mark = "IT") {
    const header = document.createElement("header");
    header.className = "top";
    header.innerHTML = '<div class="top-inner"><div class="brand"><div class="brand-mark">' + mark + '</div>' +
        '<div class="brand-name">' + title + '<span>Безпечне середовище для занять</span></div></div></div>';
    return header;
}

// Головна
const landing = document.createElement("div");
landing.className = "view"; landing.id = "landing";
landing.append(makeHeader());
const landingMain = document.createElement("main");
landingMain.className = "landing-main";
landingMain.innerHTML = '<h1>Оберіть розділ</h1><p class="lead">Натисніть на картку, щоб продовжити.</p>';
const choice = document.createElement("div");
choice.className = "grid big choice";
LANDING_CARDS.forEach((c) => choice.append(makeCard(c, c.name, c.desc, "Відкрити", () => { location.hash = c.hash; })));
landingMain.append(choice);
landing.append(landingMain);
const landingFooter = document.createElement("footer");
landingFooter.textContent = "ITSTEP Academy";
landing.append(landingFooter);

// StepSchool: вибір класу
const school = document.createElement("div");
school.className = "view"; school.id = "school";
school.append(makeHeader("StepBlock", "SB"));
const schoolMain = document.createElement("main");
const schoolBack = document.createElement("div");
schoolBack.className = "dir-head";
const schoolBackBtn = document.createElement("button");
schoolBackBtn.type = "button"; schoolBackBtn.className = "btn btn-light"; schoolBackBtn.textContent = "← На головну";
schoolBackBtn.addEventListener("click", () => { location.hash = ""; });
schoolBack.append(schoolBackBtn);
schoolMain.append(schoolBack);

const hero = document.createElement("section");
hero.className = "hero";
hero.innerHTML = '<h1>StepSchool</h1><p class="lead">Оберіть клас, щоб відкрити потрібні предмети та сайти.</p>';
schoolMain.append(hero);

const classGrid = document.createElement("div");
classGrid.className = "grid";
// Спочатку виділена жовта картка «Корисні посилання», далі класи
const usefulCard = makeCard(SCHOOL_USEFUL, SCHOOL_USEFUL.name, SCHOOL_USEFUL.full, "Відкрити",
    () => { location.hash = "#" + SCHOOL_USEFUL.id; });
usefulCard.classList.add("feature");
classGrid.append(usefulCard);
const SCHOOL_ACCENTS = ["var(--green)", "var(--amber)"];
SCHOOL_CLASSES.forEach((c, i) => {
    if (!c.color) c.color = SCHOOL_ACCENTS[i % SCHOOL_ACCENTS.length];
    const n = c.years.length;
    classGrid.append(makeCard(c, c.name, c.full, "Відкрити",
        () => { location.hash = "#" + c.id; }, n ? n + " " + pluralSubj(n) : "Незабаром"));
});
schoolMain.append(classGrid);
school.append(schoolMain);
const schoolFooter = document.createElement("footer");
schoolFooter.textContent = "StepSchool";
school.append(schoolFooter);

document.body.append(landing, school);

// На сторінці ITSTEP Academy (колишня головна) — кнопка «На головну»
const academyMain = document.querySelector("#home main");
if (academyMain) {
    const bar = document.createElement("div");
    bar.className = "dir-head";
    const b = document.createElement("button");
    b.type = "button"; b.className = "btn btn-light"; b.textContent = "← На головну";
    b.addEventListener("click", () => { location.hash = ""; });
    bar.append(b);
    academyMain.prepend(bar);
    const h1 = academyMain.querySelector("h1");
    const lead = academyMain.querySelector(".lead");
    if (h1 && lead) {
        const heroBlock = document.createElement("section");
        heroBlock.className = "hero";
        academyMain.insertBefore(heroBlock, h1);
        heroBlock.append(h1, lead);
    }
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

// Ті самі кнопки на панелі обгортки: відкриваються в новому вікні, прогрес на сайті не втрачається
const viewerBar = document.querySelector("#viewer .bar");
if (viewerBar) {
    const nav = document.createElement("nav");
    nav.className = "bar-links";
    HEADER_LINKS.forEach((l) => {
        const a = document.createElement("a");
        a.href = l.url; a.target = "_blank"; a.rel = "noopener";
        a.className = "btn btn-ghost"; a.textContent = l.name + " ↗";
        nav.append(a);
    });
    viewerBar.insertBefore(nav, viewerBar.querySelector(".hint"));
}

// Випадаюче меню на панелі обгортки: сервіси з напряму «Корисні посилання» (newWindow: true).
// У StepSchool показується її власний список (SCHOOL_USEFUL), в академії — список академії.
const ACADEMY_USEFUL = DIRECTIONS.find((d) => d.newWindow);
let fillHelperMenu = () => {};
if (viewerBar && ACADEMY_USEFUL) {
    const menu = document.createElement("div");
    menu.className = "menu";
    const toggle = document.createElement("button");
    toggle.type = "button"; toggle.className = "btn btn-ghost";
    toggle.setAttribute("aria-haspopup", "true");
    toggle.setAttribute("aria-expanded", "false");
    const pop = document.createElement("div");
    pop.className = "menu-pop";

    const setOpen = (open) => {
        menu.classList.toggle("open", open);
        toggle.setAttribute("aria-expanded", String(open));
    };

    fillHelperMenu = (dir) => {
        pop.innerHTML = "";
        toggle.textContent = dir.name + " ▾";
        dir.years.forEach((cat) => {
            if (!cat.sites.length) return;
            const h = document.createElement("div");
            h.className = "menu-cat"; h.textContent = cat.title;
            pop.append(h);
            cat.sites.forEach((s) => {
                const items = s.links
                    ? s.links.map((l) => ({ name: s.name + " — " + l.name, url: l.url }))
                    : [{ name: s.name, url: s.url }];
                items.forEach((x) => {
                    const a = document.createElement("a");
                    a.className = "menu-item"; a.href = x.url; a.target = "_blank"; a.rel = "noopener";
                    a.textContent = x.name + " ↗";
                    a.addEventListener("click", () => setOpen(false));
                    pop.append(a);
                });
            });
        });
    };
    fillHelperMenu(ACADEMY_USEFUL);

    toggle.addEventListener("click", (e) => { e.stopPropagation(); setOpen(!menu.classList.contains("open")); });
    document.addEventListener("click", (e) => { if (!menu.contains(e.target)) setOpen(false); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") setOpen(false); });
    window.addEventListener("blur", () => setOpen(false));   // клік усередині сайту (iframe) закриває меню

    menu.append(toggle, pop);
    viewerBar.insertBefore(menu, viewerBar.querySelector(".hint"));
}

// --- Сторінка 1: напрямки ---
DIRECTIONS.forEach((d, i) => {
    if (!d.color) d.color = ACCENTS[i % ACCENTS.length];
    const n = d.years.length;
    const dirCard = makeCard(d, d.name, d.full, "Обрати", () => { location.hash = "#" + d.id; }, d.categories ? n + " " + pluralCats(n) : n + " " + pluralYears(n) + " навчання");
    if (d.newWindow) dirCard.classList.add("feature");
    $("dirGrid").append(dirCard);
});

// --- Сторінка 2: роки та предмети ---
function renderDirection(d) {
    $("dirTitle").textContent = d.name;
    $("dirLead").textContent = d.full + (d.newWindow
        ? ". Сервіс відкриється в новому вікні — зручно тримати його поряд із основним завданням."
        : (d.school ? ". Оберіть предмет і сервіс." : d.categories ? ". Оберіть категорію та сервіс." : ". Оберіть свій рік навчання та предмет."));
    $("dirCrumb").textContent = d.full;
    $("toHome").textContent = d.school ? "← До вибору класу" : "← До вибору напрямку";
    const bn = document.querySelector("#direction .brand-name");
    if (bn && bn.firstChild) bn.firstChild.textContent = d.school ? "StepSchool" : "ITSTEP Academy";
    const bm = document.querySelector("#direction .brand-mark");
    if (bm) bm.textContent = d.school ? "SS" : "IT";
    const wrap = $("years"); wrap.innerHTML = "";
    if (!d.years.length) {
        const e0 = document.createElement("div"); e0.className = "empty";
        e0.textContent = d.school ? "Предмети для цього класу ще не додано." : "Ще нічого не додано.";
        wrap.append(e0);
    }
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
                    : makeCard(s, s.name, s.desc, d.newWindow ? "Відкрити в новому вікні ↗" : "Відкрити",
                        () => { location.hash = "#" + d.id + "/" + s.id; }, undefined, d.newWindow ? s.url : undefined));
            });
            sec.append(g);
        } else {
            const e = document.createElement("div"); e.className = "empty"; e.textContent = d.school ? "Сайти для цього предмета ще не додано." : "Предмети для цього року ще не додано.";
            sec.append(e);
        }
        wrap.append(sec);
    });
}

// --- Маршрутизація через #hash (працює кнопка «назад» у SEB) ---
function setTheme(isSchool) { document.body.classList.toggle("theme-school", !!isSchool); }

function route() {
    const hash = location.hash.slice(1);
    if (hash === "school") { setTheme(true); show("school"); document.title = "StepSchool — StepBlock"; return; }
    if (hash === "academy") { setTheme(false); show("home"); document.title = "ITSTEP Academy — StepBlock"; return; }
    const [dirId, siteId, linkId] = hash.split("/");
    const d = ALL_DIRECTIONS.find((x) => x.id === dirId);
    if (!d) { setTheme(false); show("landing"); document.title = "StepBlock"; return; }
    setTheme(d.school);
    parentHash = d.school ? "#school" : "#academy";

    if (siteId) {
        const s = d.years.flatMap((y) => y.sites).find((x) => x.id === siteId);
        const target = s && (s.links ? s.links.find((l) => l.id === linkId) : s);
        if (target) {
            currentSite = target;
            $("barTitle").textContent = d.name + " · " + s.name + (s.links ? " · " + target.name : "");
            if (currentFrameUrl !== target.url) { frame.src = target.url; currentFrameUrl = target.url; }
            document.title = target.name + " — StepBlock";
            fillHelperMenu(d.school ? SCHOOL_USEFUL : ACADEMY_USEFUL);
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

$("toHome").addEventListener("click", () => { location.hash = parentHash; });
// Назад з сайту → на сторінку напрямку
$("backBtn").addEventListener("click", () => { location.hash = "#" + location.hash.slice(1).split("/")[0]; });
$("reloadBtn").addEventListener("click", () => { if (currentSite) frame.src = currentSite.url; });
// Запасний варіант, якщо сайт забороняє вбудовування: відкриваємо його в новому вікні,
// а обгортка з поточною сторінкою лишається на місці (прогрес не втрачається)
$("directBtn").addEventListener("click", () => {
    if (!currentSite) return;
    const a = document.createElement("a");
    a.href = currentSite.url; a.target = "_blank"; a.rel = "noopener";
    document.body.append(a); a.click(); a.remove();
});

window.addEventListener("hashchange", route);
route();