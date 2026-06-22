@echo off
echo Iniciando PrivacIA...

:: Inicia o Backend em uma nova janela
start "PrivacIA Backend" cmd /c "cd backend && call venv\Scripts\activate && uvicorn app.main:app --reload --port 8000"

:: Inicia o Frontend na mesma janela
echo Iniciando o servidor web...
cd frontend
call npm install
call npm run dev
