@echo off
setlocal

rem ============================================================================
rem  pedidos-autos - Web (Next.js)
rem
rem  Levanta la web en modo desarrollo en http://localhost:3000, en esta misma
rem  consola. Ctrl+C la corta. Para ver datos reales, la API tiene que estar
rem  corriendo (ApiCore\iniciar-api.bat).
rem ============================================================================

rem Sin acentos a proposito: cmd lee el archivo con el codepage vigente ANTES
rem de este chcp.
chcp 65001 >nul
cd /d "%~dp0"

where npm >nul 2>nul
if errorlevel 1 (
    echo [X] No se encontro 'npm'. Hace falta Node.js 22.
    pause
    exit /b 1
)

rem Primera vez (o despues de borrar node_modules): instalar con el lockfile
rem exacto.
if not exist "node_modules" (
    echo Instalando dependencias...
    call npm ci
    if errorlevel 1 (
        echo [X] Fallo la instalacion.
        pause
        exit /b 1
    )
)

rem Sin .env.local se usa el default de API_URL (http://127.0.0.1:5080), que
rem es donde levanta la API en desarrollo. Se crea igual para que quede a mano.
if not exist ".env.local" copy ".env.example" ".env.local" >nul

title pedidos-autos - Web
call npm run dev
