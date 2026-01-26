# Mini Tech Market

SPA pentru proiect universitar: Vue 3 + Firebase (Auth + Firestore) cu backend Express.

## Functionalitati
- CRUD produse (admin)
- Autentificare Email/Parola + Google
- Vizualizare catalog pentru clienti
- Sortare si filtrare pe categorie
- Infinite scroll
- Stoc (cantitate) pentru produse

## Arhitectura
- Frontend: Vue 3 (SPA)
- Backend: Express API (`/api`)
- Baza de date: Firebase Firestore
- Auth: Firebase Authentication

## Structura proiect
```
ProiectTic/
  frontend/
  backend/
```

## Rulare local

### 1) Backend
`backend/.env`
```
PORT=3000
NODE_ENV=development
FIREBASE_API_KEY=...
FIREBASE_AUTH_DOMAIN=...
FIREBASE_PROJECT_ID=...
FIREBASE_STORAGE_BUCKET=...
FIREBASE_MESSAGING_SENDER_ID=...
FIREBASE_APP_ID=...
```

Comenzi:
```
cd backend
npm install
npm run dev
```

### 2) Frontend
`frontend/.env`
```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_ADMIN_EMAILS=admin@example.com
VITE_API_URL=http://localhost:3000/api
```

Comenzi:
```
cd frontend
npm install
npm run dev
```

## Seed produse (date demo)
```
cd backend
npm run seed -- 20
```

## Endpoint-uri API
- `GET /api/health` – status server
- `GET /api/products` – lista produse
- `POST /api/products` – adauga produs
- `PUT /api/products/:id` – editeaza produs
- `DELETE /api/products/:id` – sterge produs

## Note
- Adminii sunt definiti prin `VITE_ADMIN_EMAILS`.
- Rutele de admin se pot restrictiona suplimentar prin token Firebase (optional).
