/* ==================================================================
   НАЛАШТУВАННЯ ОЛІМПІАД (редагує викладач).
   Ключ ("python-demo") має збігатися з id у script.js (рядок url: "olympiad.html?o=python-demo").

   title, subtitle      — заголовок і підзаголовок
   active               — false: сторінка пише «олімпіада ще не відкрита»
   durationMinutes      — тривалість у хвилинах (0 або не вказано = без таймера).
                          Таймер стартує з першого входу учасника, по закінченню спроба завершується
                          автоматично, результат зберігається на сервері, локально й завантажується файлом.
   allowPause           — true: показувати кнопку «Пауза» (потрібен пароль адміністратора)
   adminPasswordHash    — потрібен лише в «режимі без сервера» (порожній backendUrl). Хеш пароля: відкрийте
                          olympiad.html?tool=hash, введіть пароль і скопіюйте результат. З сервером пароль
                          перевіряється на сервері (ADMIN_PASSWORD в olympiad_backend.gs).
   autoDownload         — true: по завершенню автоматично завантажувати файл розв'язків
   fileName             — ім'я єдиного файлу з розв'язками (за замовчуванням tasks.py)
   backendUrl, token    — адреса веб-застосунку Google Apps Script і секрет (див. olympiad_backend.gs).
                          Порожній backendUrl = «режим без сервера»: код лише на цьому ПК + завантаження файлу.
   autosaveSeconds      — як часто надсилати зміни на сервер (рекомендовано 10–15)
   disableCopyPaste     — true: у редакторі заборонено вставляти код із буфера
   tasks[]              — id, title, statement, input, output, examples[{input, output}]
                          (умови показуються ліворуч у списку; у файлі лише розділювачі з номерами задач)
   ================================================================== */
window.OLYMPIAD_SETTINGS = {
    requireSeb: true        // true: сторінка працює лише в Safe Exam Browser (для тестів у браузері поставте false)
};

window.OLYMPIADS = {
    "python-demo": {
        title: "Олімпіада з Python (демо)",
        subtitle: "Розв'яжіть задачі у файлі tasks.py. Код зберігається автоматично.",
        active: true,
        durationMinutes: 45,
        allowPause: true,
        adminPasswordHash: "",
        autoDownload: true,
        fileName: "tasks.py",
        backendUrl: "",
        token: "",
        autosaveSeconds: 10,
        disableCopyPaste: true,
        tasks: [
            {
                id: "t1", title: "Сума двох чисел",
                statement: "Вам дано два цілих числа a і b, кожне в окремому рядку.\nВиведіть їх суму.",
                input: "Два цілих числа a і b (|a|, |b| ≤ 10^9), кожне з нового рядка.",
                output: "Одне ціле число — суму a + b.",
                examples: [{ input: "2\n3", output: "5" }, { input: "-4\n10", output: "6" }]
            },
            {
                id: "t2", title: "Парні числа",
                statement: "Дано число n, а в наступному рядку — n цілих чисел через пропуск.\nВиведіть, скільки серед них парних.",
                input: "У першому рядку — n (1 ≤ n ≤ 1000). У другому — n цілих чисел.",
                output: "Кількість парних чисел.",
                examples: [{ input: "5\n1 2 3 4 6", output: "3" }]
            },
            {
                id: "t3", title: "Паліндром",
                statement: "Дано слово. Виведіть YES, якщо воно читається однаково зліва направо і справа наліво,\nінакше — NO. Регістр літер не враховується.",
                input: "Одне слово з латинських літер.",
                output: "YES або NO.",
                examples: [{ input: "Level", output: "YES" }, { input: "python", output: "NO" }]
            }
        ]
    }
};
