@echo off
echo ========================================
echo    INICIANDO FRONTEND PLANILLABUS
echo ========================================
echo.

REM Configurar puerto del frontend
set FRONTEND_PORT=8012
set BACKEND_PORT=8013

echo Configuracion:
echo - Puerto Frontend: %FRONTEND_PORT%
echo - Puerto Backend: %BACKEND_PORT%
echo - URL Frontend: http://localhost:%FRONTEND_PORT%
echo - URL Backend: http://localhost:%BACKEND_PORT%
echo.

REM Verificar si Node.js está instalado
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js no esta instalado o no esta en el PATH
    echo Por favor instala Node.js 16+ desde https://nodejs.org
    pause
    exit /b 1
)

REM Verificar si npm está instalado
npm --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: npm no esta instalado
    echo Por favor instala npm o actualiza Node.js
    pause
    exit /b 1
)

echo Instalando dependencias...
npm install

echo.
echo ========================================
echo    INICIANDO FRONTEND EN PUERTO %FRONTEND_PORT%
echo ========================================
echo.
echo El frontend estara disponible en:
echo - Local: http://localhost:%FRONTEND_PORT%
echo - Red: http://[TU_IP]:%FRONTEND_PORT%
echo.
echo Asegurate de que el backend este corriendo en el puerto %BACKEND_PORT%
echo.
echo Presiona Ctrl+C para detener el servidor
echo.

REM Iniciar servidor de desarrollo
npm run dev -- --port %FRONTEND_PORT% --host 0.0.0.0

pause
