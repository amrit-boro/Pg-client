# StayEasyPG 🏠

A modern **PG/Homestay finder platform built for college students** — helping them discover, explore, and save the best paying guest accommodations near the college.

---

## Tech Stack

| Layer        | Technology                   |
| ------------ | ---------------------------- |
| Frontend     | React + Vite                 |
| Styling      | Tailwind CSS                 |
| Routing      | React Router DOM             |
| Server State | TanStack Query (React Query) |
| Icons        | Lucide React                 |
| Backend      | Node.js / Express/ Postgres  |

---

## Features

### 1. PG Listings

- Browse all available PG/homestay listings near college
- Filter rooms by type and pagination
- View listing details — location, price, amenities

### 2. Rooms

- View all rooms under a specific PG listing
- Each room shows:
  - Room number & type
  - Price per month
  - Bed count & capacity
  - Utilities (AC, WiFi)
  - Availability status
- Paginated room listing with type filter

### 3. Room Detail

- Full detail page for a single room
- Navigate via `/roomdetail?id={room_id}`

### 4. Save / Bookmark System

- Students can bookmark both **PG listings** and **individual rooms**
- Instant optimistic UI — bookmark fills immediately on click without waiting for API
- Saved items persist and are retrievable from the saved items page
- Navigation from saved items routes correctly:
  - Saved room → `/roomdetail?id={id}`
  - Saved listing → `/listingDetail?pgId={id}&type=single`

## Dependencies

```bash
npm install @tanstack/react-query lucide-react react-router-dom
```

---

## Target Users

🎓 **Students** looking for affordable, comfortable PG accommodations near their college or university.
