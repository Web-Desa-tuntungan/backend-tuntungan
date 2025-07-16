# Desaku Backend

A comprehensive Hapi.js backend for village service management, featuring user/admin authentication, service requests, news/events CRUD, and gallery endpoints. Uses MySQL (phpMyAdmin) and JWT for security.

## Features
- User/Admin authentication (JWT, bcrypt)
- Service request submission and status tracking
- Admin CRUD for news, agenda, announcements, and gallery
- Modular code structure

## Folder Structure
- `src/config/` – DB config
- `src/handlers/` – Feature logic
- `src/routes/` – Modular routing
- `src/middlewares/` – Auth middleware
- `src/utils/` – JWT helpers
- `src/server.js` – Entry point
