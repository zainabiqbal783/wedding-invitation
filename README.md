# Wedding Invitation — Mr. & Mrs. Ali (15 Nov 2026, Lahore)

React (Vite + Tailwind + Framer Motion) frontend + Python FastAPI backend.

## Run locally
Terminal 1 (API):
    cd backend
    pip install -r requirements.txt
    ADMIN_KEY=mysecret uvicorn main:app --reload

Terminal 2 (website):
    cd frontend
    npm install
    npm run dev          # open http://localhost:5173 (use phone-size view in browser dev tools)

## Customise
- Everything (names, date, venue, schedule, dress code) is in `frontend/src/config.json`.
- Music: add `frontend/public/music/nikah.mp3`.
- Replace the SVG art in `frontend/src/components/Decor.jsx` with your own transparent PNGs.

## Personal guest links
    curl -X POST localhost:8000/api/admin/guests -H "X-Admin-Key: mysecret" -H "Content-Type: application/json" -d '{"name":"Sara Khan"}'
    -> share  https://YOUR-SITE/invite/sara-khan   (greets "Dear Sara Khan")

## See RSVPs
    curl -H "X-Admin-Key: mysecret" localhost:8000/api/admin/rsvps
    curl -H "X-Admin-Key: mysecret" localhost:8000/api/admin/rsvps.csv -o rsvps.csv

## Deploy
- Frontend → Vercel (root `frontend`, build `npm run build`, output `dist`). Set env `VITE_API_URL=https://YOUR-API/api`.
- Backend → Render/Railway (start: `uvicorn main:app --host 0.0.0.0 --port $PORT`). Set `ADMIN_KEY` and `ALLOWED_ORIGINS=https://YOUR-SITE`.
