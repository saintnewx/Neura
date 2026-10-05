# Neura

AI-генератор маркетингового контента в стиле Kinetic Swiss: адаптивный лендинг, рабочая область `/app` и страница 404. Интерфейс на русском языке.

## Стек технологий

- React 18 + Vite 6 + TypeScript со строгой проверкой типов.
- Tailwind CSS 3, React Router 6, Lucide React.
- Inter из Google Fonts: 400, 500, 600, 700, 800.
- CSS-анимации, Intersection Observer и typewriter без внешних UI-библиотек.
- Vercel Node.js Function и NVIDIA Chat Completions API.

## Запуск

Нужен Node.js 22.12+ или 24 LTS.

```bash
npm install
npm run dev
```

Vite запустит приложение по адресу `http://localhost:5173`.

`npm run dev` запускает только клиент. Для локальной генерации через серверную функцию установите Vercel CLI, создайте `.env.local` по образцу `.env.example`, укажите `NVIDIA_API_KEY` и запустите `vercel dev`. Vercel CLI использует Vite для клиента и обслуживает `/api/generate`.

```bash
npm run build
npm run preview
```

Сборка сначала проверяет TypeScript, затем создаёт production-файлы в `dist/`. В репозитории включён `package-lock.json`; для воспроизводимой установки можно использовать `npm ci`.

## Структура

```text
api/
  generate.ts
src/
  components/
    Header.tsx
    MobileMenu.tsx
    Hero.tsx
    SocialProof.tsx
    BentoGrid.tsx
    DemoSection.tsx
    Pricing.tsx
    Testimonials.tsx
    FAQ.tsx
    Footer.tsx
    Toast.tsx
    Skeleton.tsx
  pages/
    Landing.tsx
    AppPage.tsx
    NotFound.tsx
  lib/
    api.ts
  App.tsx
  main.tsx
  index.css
public/
  favicon.svg
  og-image.svg
index.html
package.json
package-lock.json
tailwind.config.js
postcss.config.js
tsconfig.json
vite.config.ts
vercel.json
.env.example
```

## Генерация контента

`src/lib/api.ts` отправляет POST `/api/generate` с JSON `{ "task": "...", "type": "Пост" }`. Серверная функция вызывает NVIDIA и возвращает `{ "content": "..." }`. Искусственных задержек и случайных ошибок нет: skeleton отображается на время реального запроса. В случае ошибки сервер возвращает `{ "error": "..." }`, клиент бросает `Error` с этим сообщением, а интерфейс показывает его рядом с кнопкой «Попробовать снова».

«Перегенерировать» повторяет последнюю отправленную задачу с тем же форматом. Сервер принимает только POST, непустые задачи длиной до 2000 символов и форматы Пост/Email/Реклама/Reels. Без настроенного ключа возвращается понятная ошибка 503. Обрабатываются ограничения NVIDIA, ошибки авторизации, недоступность модели, сетевые ошибки и пустые/некорректные ответы. Тайм-аут NVIDIA — 45 секунд, клиента — 55 секунд, функции Vercel — 60 секунд.

«Копировать» использует Clipboard API, которому нужен HTTPS или localhost. При успехе toast виден две секунды; при запрете доступа предлагается ручное копирование. Мобильное меню поддерживает Escape, удержание фокуса и закрытие по ссылке. Анимации учитывают `prefers-reduced-motion`.

Реальный AI подключён через NVIDIA. Задачи передаются провайдеру; приложение не сохраняет их историю. Платежи, аккаунты и ограничения по тарифам не подключены. Цены, компании и отзывы — демонстрационный контент. Все CTA ведут в `/app`; Pro и Team показывают выбранный тариф и открывают генератор. Перед коммерческим запуском замените примеры подтверждёнными данными и подключите оплату и социальные профили.

## Деплой на Vercel

1. Запушьте проект в GitHub-репозиторий `neura`.
2. В Vercel выберите **Add New → Project** и импортируйте `neura`.
3. Выберите preset **Vite**. Если проект находится в подпапке, укажите её как **Root Directory**.
4. Установите **Build Command**: `npm run build`, **Output Directory**: `dist`, **Install Command**: `npm ci`.
5. В **Settings → Environment Variables** добавьте `NVIDIA_API_KEY` для **Production** и при необходимости **Preview**. Значение — ваш NVIDIA API key; не используйте префикс `VITE_`.
6. Выберите Node.js 24.x и нажмите **Deploy**. Если переменная добавлена после деплоя, сделайте **Redeploy**: существующий деплой не получит её автоматически.
7. Проверьте генерацию, главную страницу, прямой переход и обновление `/app`, затем неизвестный маршрут.

`vercel.json` исключает `/api` и `/api/*` из SPA rewrite и перенаправляет клиентские маршруты на `index.html`; существующие статические assets Vercel отдаёт как файлы. `/api/generate` обслуживает Node.js Function, а React Router обрабатывает `/app` и страницу 404 после обновления браузера. Сервер вернёт SPA с HTTP 200 для неизвестного клиентского пути; визуальный 404 показывает React.

OG-карточка предоставлена в SVG согласно ТЗ. Некоторые социальные платформы требуют PNG/JPEG: при production-запуске экспортируйте SVG в PNG 1200×630, обновите `og:image` на абсолютный публичный URL и проверьте preview в нужной платформе.

## NVIDIA API

Серверная интеграция находится в `api/generate.ts`, клиент — в `src/lib/api.ts`.

- Endpoint: `https://integrate.api.nvidia.com/v1/chat/completions`.
- Модель: `deepseek-ai/deepseek-v4.1-flash`.
- Параметры: `temperature: 0.8`, `max_tokens: 800`, `stream: false`.
- System-промпт: «Ты — профессиональный копирайтер. Пиши живо, конкретно, без воды. Учитывай тип контента: Пост/Email/Реклама/Reels.»
- Формат и описание задачи передаются в отдельном user-сообщении.
- Единственная необходимая переменная окружения: `NVIDIA_API_KEY`.

Сервер извлекает `choices[0].message.content`, проверяет непустую строку и возвращает только текст. Ответы с ошибками имеют HTTP-код и понятное поле `error`; ключ и внутренние ответы провайдера клиенту не передаются. Неуспешные ответы не кэшируются, как и сгенерированные тексты.

**Никогда не вызывайте NVIDIA API с секретным ключом из браузера и не коммитьте `.env`.**
