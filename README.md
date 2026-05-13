# Лабораторная работа 11

[![CI/CD](https://github.com/Ancr33z/lab11/actions/workflows/ci.yml/badge.svg)](https://github.com/Ancr33z/lab11/actions/workflows/ci.yml)

## Тема

Организация CI/CD и автоматизированного тестирования с использованием GitHub Actions.

## Описание

Проект представляет собой простую веб-страницу с формой заявки на настройку CI/CD. Для проекта настроены unit-тесты бизнес-логики, UI-тесты через Selenium, сборка статических файлов и workflow GitHub Actions для проверки веток и публикации через GitHub Pages.

## Стек

- Node.js 18+
- npm
- Selenium WebDriver
- GitHub Actions
- GitHub Pages

## Структура проекта

```text
.
+-- .github/workflows/ci.yml
+-- scripts/
|   +-- build.js
|   +-- serve.js
+-- src/
|   +-- app.js
|   +-- formLogic.js
|   +-- index.html
|   +-- styles.css
+-- tests/
|   +-- formLogic.test.js
|   +-- ui.test.js
+-- package.json
+-- README.md
```

## Локальный запуск

```bash
npm install
npm test
npm run build
npm start
```

После запуска страница доступна по адресу `http://localhost:3000`.

## Проверки

Тесты проверяют:

1. Нормализацию и валидацию данных формы.
2. Отображение формы в браузере.
3. Сообщения об ошибках при пустой отправке.
4. Очистку ошибки при вводе данных.
5. Сообщение об успешной отправке и сброс формы.

## CI/CD

Workflow находится в файле `.github/workflows/ci.yml`.

Pipeline запускается при:

- `push` в ветки `main`, `dev`, `fix`;
- `pull_request` в ветки `main`, `dev`;
- ручном запуске через `workflow_dispatch`.

Этапы pipeline:

1. Получение кода из репозитория.
2. Установка Node.js и зависимостей через `npm ci`.
3. Запуск unit- и UI-тестов командой `npm test`.
4. Сборка проекта командой `npm run build`.
5. Публикация собранной папки `dist` в GitHub Pages для ветки `main`.

## Ветки и pull request

Рекомендуемый сценарий для сдачи лабораторной:

```bash
git init
git branch -M main
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/Ancr33z/lab11.git
git push -u origin main

git checkout -b dev
git push -u origin dev

git checkout -b fix
git push -u origin fix
```

Дальше на GitHub:

1. Создать pull request из `fix` в `dev`.
2. Дождаться успешного выполнения GitHub Actions.
3. Выполнить merge в `dev`.
4. Создать pull request из `dev` в `main`.
5. После успешных проверок выполнить merge в `main`.

## GitHub Pages

Для публикации нужно открыть настройки репозитория:

```text
Settings -> Pages -> Build and deployment -> Source -> GitHub Actions
```

После успешного workflow в ветке `main` сайт будет опубликован через GitHub Pages.
