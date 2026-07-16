# Task Management App

## Cara Menjalankan

### Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Demo Login
- Username: `venesa`
- Password: `123456`

### Chatbot
1. Pastikan backend dan frontend sudah berjalan.
2. Buka halaman `/chatbot`.
3. Masukkan pertanyaan tentang task.

## File Pendukung
- [docs/postman_collection.json](docs/postman_collection.json)
- [docs/erd.svg](docs/erd.svg)
- [docs/erd.md](docs/erd.md)
