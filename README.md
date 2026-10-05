# Neura

AI-генератор маркетингового контента в стиле Kinetic Swiss: адаптивный лендинг, рабочая область `/app` и страница 404. Интерфейс на русском языке.

## Стек технологий

- React 18 + Vite 6 + TypeScript со строгой проверкой типов.
- Tailwind CSS 3, React Router 6, Lucide React.
- Inter из Google Fonts: 400, 500, 600, 700, 800.
- CSS-анимации, Intersection Observer и typewriter без внешних UI-библиотек.

## Запуск

Нужен Node.js 22.12+ или 24 LTS.

```bash
npm install
npm run dev
```

Vite запустит приложение по адресу `http://localhost:5173`.

```bash
npm run build
npm run preview
```

Сборка сначала проверяет TypeScript, затем создаёт production-файлы в `dist/`. В репозитории включён `package-lock.json`; для воспроизводимой установки можно использовать `npm ci`.

## Структура

```text
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
```

## Поведение демо

`src/lib/api.ts` имитирует запрос длительностью 1,5 секунды и намеренно вызывает ошибку с вероятностью 20%. В случае ошибки нажмите «Попробовать снова». «Перегенерировать» повторяет последнюю отправленную задачу с тем же форматом. Пустые и состоящие только из пробелов задачи не отправляются.

«Копировать» использует Clipboard API, которому нужен HTTPS или localhost. При успехе toast виден две секунды; при запрете доступа предлагается ручное копирование. Мобильное меню поддерживает Escape, удержание фокуса и закрытие по ссылке. Анимации учитывают `prefers-reduced-motion`.

Приложение использует заглушку: реальные AI, платежи, аккаунты и ограничения по тарифам не подключены. Цены, компании и отзывы — демонстрационный контент. Все CTA ведут в `/app`; Pro и Team показывают выбранный тариф и открывают бесплатное демо. Перед коммерческим запуском замените примеры подтверждёнными данными и подключите реальные политики, оплату и социальные профили.

## Деплой на Vercel

1. Запушьте проект в GitHub-репозиторий `neura`.
2. В Vercel выберите **Add New → Project** и импортируйте `neura`.
3. Выберите preset **Vite**. Если проект находится в подпапке, укажите её как **Root Directory**.
4. Установите **Build Command**: `npm run build`, **Output Directory**: `dist`, **Install Command**: `npm ci`.
5. Выберите Node.js 24.x и нажмите **Deploy**. Переменные окружения для демо не нужны.
6. Проверьте главную страницу, прямой переход и обновление `/app`, затем неизвестный маршрут.

`vercel.json` перенаправляет SPA-маршруты на `index.html`; существующие статические assets Vercel отдаёт как файлы. Это позволяет React Router обработать `/app` и страницу 404 после обновления браузера. Сервер вернёт SPA с HTTP 200 и для неизвестного пути; визуальный 404 показывает React.

OG-карточка предоставлена в SVG согласно ТЗ. Некоторые социальные платформы требуют PNG/JPEG: при production-запуске экспортируйте SVG в PNG 1200×630, обновите `og:image` на абсолютный публичный URL и проверьте preview в нужной платформе.

## Замена заглушки API на реальный NVIDIA API

Точка интеграции — `src/lib/api.ts`. Сохраните сигнатуру `generateContent(task: string, type: string): Promise<string>` и замените задержку/случайную ошибку запросом к своему серверу:

```ts
export async function generateContent(
  task: string,
  type: string,
): Promise<string> {
  const response = await fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ task, type }),
    signal: AbortSignal.timeout(30000),
  });
  if (!response.ok) throw new Error("Generation failed");
  const data: unknown = await response.json();
  if (
    typeof data !== "object" ||
    data === null ||
    !("content" in data) ||
    typeof data.content !== "string" ||
    !data.content.trim()
  )
    throw new Error("Invalid generation response");
  return data.content;
}
```

1. Получите ключ и ID подходящей модели в NVIDIA API Catalog. Проверьте актуальные endpoint, модель и условия использования.
2. Создайте серверную Vercel Function `api/generate.ts` с обработкой POST. Валидируйте длину задачи и четыре допустимых формата; добавьте rate limiting, timeout и ограничения токенов.
3. Добавьте `NVIDIA_API_KEY` и `NVIDIA_MODEL` в **Vercel → Settings → Environment Variables** для нужных сред. Не используйте префикс `VITE_`: такие переменные попадают в браузерную сборку.
4. На сервере отправляйте запрос на `https://integrate.api.nvidia.com/v1/chat/completions` с `Authorization: Bearer <ключ>`, выбранной `model` и сообщениями `system`/`user`. Задайте системную инструкцию для русского маркетингового текста и передайте формат вместе с задачей.
5. Проверьте `response.ok`, структуру ответа и непустое `choices[0].message.content`. Возвращайте клиенту `{ "content": "..." }`; при ошибке — соответствующий HTTP-код без ключей и внутренних подробностей.
6. Убедитесь, что `/api/generate` обрабатывает Function, а не SPA rewrite. При необходимости настройте отдельные rewrites для API и клиентских страниц. Для локальной работы с Functions используйте `vercel dev`.
7. Удалите искусственные ошибки и задержку, обновите описание демо, политику обработки данных и протестируйте success, timeout, rate limit и retry на production-домене.

**Никогда не вызывайте NVIDIA API с секретным ключом из браузера и не коммитьте `.env`.**
