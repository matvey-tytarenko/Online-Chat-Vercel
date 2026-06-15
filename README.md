# 💬 Онлайн Чат — Node.js + React + Pusher

Полноценный чат в реальном времени с индикатором набора текста, аватарами и уведомлениями о входе/выходе.

## Стек

- **Бэкенд**: Node.js + Express + Pusher Server SDK
- **Фронтенд**: React (Vite) + Pusher JS
- **Транспорт**: WebSockets через Pusher Channels

---

## 🚀 Быстрый старт

### 1. Получить Pusher credentials

1. Зарегистрируйтесь на [pusher.com](https://pusher.com)
2. Создайте новое приложение → выберите **Channels**
3. В разделе **App Keys** скопируйте: `app_id`, `key`, `secret`, `cluster`

---

### 2. Настроить сервер

```bash
cd server
cp .env.example .env
```

Заполните `server/.env`:

```env
PUSHER_APP_ID=123456
PUSHER_KEY=abc123def456
PUSHER_SECRET=your_secret_here
PUSHER_CLUSTER=eu
PORT=3001
```

Установите зависимости и запустите:

```bash
npm install
npm run dev
```

Сервер запустится на `http://localhost:3001`

---

### 3. Настроить клиент

```bash
cd client
cp .env.example .env
```

Заполните `client/.env`:

```env
VITE_PUSHER_KEY=abc123def456
VITE_PUSHER_CLUSTER=eu
```

Установите зависимости и запустите:

```bash
npm install
npm run dev
```

Клиент запустится на `http://localhost:5173`

---

## 📁 Структура проекта

```
chat-app/
├── server/
│   ├── index.js          # Express сервер + Pusher триггеры
│   ├── .env.example      # Пример переменных окружения
│   └── package.json
│
└── client/
    ├── src/
    │   ├── components/
    │   │   ├── Chat.jsx          # Главный чат компонент
    │   │   ├── Login.jsx         # Экран входа
    │   │   ├── Message.jsx       # Компонент сообщения
    │   │   └── TypingIndicator.jsx  # Анимация "печатает..."
    │   ├── App.jsx
    │   └── main.jsx
    ├── index.html
    ├── vite.config.js
    └── package.json
```

---

## ✨ Возможности

- 💬 Сообщения в реальном времени через WebSockets
- ✍️ Индикатор набора текста с анимацией
- 👥 Уведомления о входе/выходе пользователей
- 🎨 Случайный аватар и цвет для каждого пользователя
- 📱 Адаптивный дизайн
- ⌨️ Enter для отправки, Shift+Enter для переноса строки
- 🔗 Группировка сообщений одного автора

---

## 🌐 Деплой

### Сервер (например, Railway, Render, Fly.io)

1. Задайте переменные окружения на платформе
2. Укажите команду старта: `node index.js`

### Клиент (например, Vercel, Netlify)

1. Задайте `VITE_PUSHER_KEY`, `VITE_PUSHER_CLUSTER`
2. Задайте `VITE_API_URL=https://your-server.com/api`
3. Команда сборки: `npm run build`, папка: `dist`
