/* ==================================================================
   НАЛАШТУВАННЯ ОЛІМПІАД (редагує викладач).
   Ключ ("python-demo") має збігатися з id у script.js (рядок url: "olympiad.html?o=python-demo").

   title, subtitle      — заголовок і підзаголовок
   active               — false: сторінка пише «олімпіада ще не відкрита»
   backendUrl, token    — адреса веб-застосунку Google Apps Script і секрет (див. olympiad_backend.gs).
                          Порожній backendUrl = «режим без сервера»: код лише на цьому ПК + кнопка завантаження.
   autosaveSeconds      — як часто надсилати зміни на сервер (рекомендовано 10–15)
   disableCopyPaste     — true: у редакторі заборонено вставляти код із буфера
   tasks[]              — id, file (ім'я файлу), title, statement, input, output, examples[{input, output}]
   ================================================================== */
window.OLYMPIAD_SETTINGS = {
    requireSeb: true        // true: сторінка працює лише в Safe Exam Browser (для тестів у браузері поставте false)
};

window.OLYMPIADS = {
    "python-demo": {
        title: "Олімпіада з Python (демо)",
        subtitle: "Розв'яжіть задачі у редакторі. Код зберігається автоматично.",
        active: true,
        backendUrl: "",
        token: "",
        autosaveSeconds: 10,
        disableCopyPaste: true,
        tasks: [
            {
                id: "t1", file: "task1.py", title: "Сума двох чисел",
                statement: "Вам дано два цілих числа a і b, кожне в окремому рядку.\nВиведіть їх суму.",
                input: "Два цілих числа a і b (|a|, |b| ≤ 10^9), кожне з нового рядка.",
                output: "Одне ціле число — суму a + b.",
                examples: [{ input: "2\n3", output: "5" }, { input: "-4\n10", output: "6" }]
            },
            {
                id: "t2", file: "task2.py", title: "Парні числа",
                statement: "Дано число n, а в наступному рядку — n цілих чисел через пропуск.\nВиведіть, скільки серед них парних.",
                input: "У першому рядку — n (1 ≤ n ≤ 1000). У другому — n цілих чисел.",
                output: "Кількість парних чисел.",
                examples: [{ input: "5\n1 2 3 4 6", output: "3" }]
            },
            {
                id: "t3", file: "task3.py", title: "Паліндром",
                statement: "Дано слово. Виведіть YES, якщо воно читається однаково зліва направо і справа наліво,\nінакше — NO. Регістр літер не враховується.",
                input: "Одне слово з латинських літер.",
                output: "YES або NO.",
                examples: [{ input: "Level", output: "YES" }, { input: "python", output: "NO" }]
            }
        ]
    }
};
