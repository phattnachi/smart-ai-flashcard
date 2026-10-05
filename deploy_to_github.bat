@echo off
chcp 65001 >nul
echo ========================================================
echo   🚀 Smart AI Flashcard - Push to GitHub Helper
echo ========================================================
echo.
set /p REPO_URL="วางลิงก์ GitHub Repo ที่สร้างไว้ที่นี่ (เช่น https://github.com/username/smart-ai-flashcard.git): "

if "%REPO_URL%"=="" (
    echo ลิงก์ไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง
    pause
    exit /b
)

set GIT_CMD="C:\Users\phatt\AppData\Local\Microsoft\WinGet\Packages\Git.MinGit_Microsoft.Winget.Source_8wekyb3d8bbwe\cmd\git.exe"

echo.
echo กำลังเชื่อมต่อ Remote...
%GIT_CMD% remote remove origin >nul 2>&1
%GIT_CMD% remote add origin %REPO_URL%

echo กำลัง Push โค้ดขึ้น GitHub (main branch)...
%GIT_CMD% push -u origin main

echo.
echo ========================================================
echo   ✅ อัปโหลดโค้ดขึ้น GitHub เรียบร้อยแล้ว!
echo   ขั้นตอนถัดไป: ไปที่ https://vercel.com แล้วกด Import ได้เลย
echo ========================================================
pause
