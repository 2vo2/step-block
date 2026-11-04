[Setup]
AppName=StepBlock
AppVersion=1.0
DefaultDirName={autopf}\StepBlock
DefaultGroupName=StepBlock
OutputBaseFilename=Setup_StepBlock
Compression=lzma
SolidCompression=yes
PrivilegesRequired=admin

[Dirs]
; Створення папки SEB на Робочому столі для всіх користувачів
Name: "{commondesktop}\SEB"; Flags: uninsneveruninstall

[Files]
; Офіційний бандл SEB
Source: "SEB_3.9.0.787_SetupBundle.exe"; DestDir: "{tmp}"; Flags: deleteafterinstall

; Базовий конфіг
Source: "stepblock_new1.seb"; DestDir: "{app}"; DestName: "config.seb"; Flags: ignoreversion

; Копіюємо вміст папок launcher та update у відповідні підпапки
Source: "launcher\*"; DestDir: "{app}\launcher"; Flags: ignoreversion recursesubdirs createallsubdirs
Source: "update\*"; DestDir: "{app}\update"; Flags: ignoreversion recursesubdirs createallsubdirs

[Run]
; Автоматичне встановлення SEB у тихому режимі
Filename: "{tmp}\SEB_3.9.0.787_SetupBundle.exe"; Parameters: "/passive /norestart"; StatusMsg: "Встановлення Safe Exam Browser..."; Flags: waituntilterminated

[Icons]
; Ярлики вказують на launcher.exe та update.exe всередині своїх папок
Name: "{autodesktop}\StepBlock"; Filename: "{app}\launcher\launcher.exe"; IconFilename: "{autopf}\SafeExamBrowser\SafeExamBrowser.exe"
Name: "{autodesktop}\Оновити StepBlock"; Filename: "{app}\update\update.exe"
Name: "{group}\StepBlock"; Filename: "{app}\launcher\launcher.exe"
Name: "{group}\Оновити StepBlock"; Filename: "{app}\update\update.exe"