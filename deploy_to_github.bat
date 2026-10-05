@echo off
chcp 65001 >nul
title Smart AI Flashcard - Push to GitHub
echo ========================================================
echo   🚀 Smart AI Flashcard - กำลัง Push โค้ดขึ้น GitHub
echo   Repository: https://github.com/phattnachi/smart-ai-flashcard.git
echo ========================================================
echo.

set "PATH=C:\Users\phatt\AppData\Local\Microsoft\WinGet\Packages\Git.MinGit_Microsoft.Winget.Source_8wekyb3d8bbwe\cmd;%PATH%"
set GIT_EXE=C:\Users\phatt\AppData\Local\Microsoft\WinGet\Packages\Git.MinGit_Microsoft.Winget.Source_8wekyb3d8bbwe\cmd\git.exe
set GCM_EXE=C:\Users\phatt\AppData\Local\Programs\Git Credential Manager\git-credential-manager.exe

"%GIT_EXE%" config --global credential.helper "%GCM_EXE%"
"%GIT_EXE%" remote remove origin >nul 2>&1
"%GIT_EXE%" remote add origin https://github.com/phattnachi/smart-ai-flashcard.git

echo กำลังเชื่อมต่อไปยัง GitHub...
echo (หากมีหน้าต่างเบราว์เซอร์เด้งขึ้นมา ให้กดยืนยัน Sign in with Browser นะครับ)
echo.

"%GIT_EXE%" push -u origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================================
    echo   ✅ สำเร็จแล้ว! โค้ดทั้งหมดอยู่บน GitHub เรียบร้อยแล้วครับ
    echo   ตอนนี้ Vercel จะเริ่มทำการ Deploy ให้อัตโนมัติทันที!
    echo ========================================================
) else (
    echo.
    echo ❌ เกิดข้อผิดพลาด กรุณาตรวจสอบสิทธิ์การเข้าถึง GitHub
)

echo.
pause
