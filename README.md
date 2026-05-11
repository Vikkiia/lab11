# Лабораторная работа 11

## Тема

Организация CI/CD и автоматизированного тестирования с использованием GitHub Actions.

## Аккаунт

Работа выполняется в GitHub-аккаунте `Ancr33z`.

## Выбранный стек

Node.js + npm. Проект представляет собой простую веб-страницу с формой заявки на настройку CI/CD. Автоматизация выполняется через GitHub Actions.

## Состав проекта

- `src/index.html` - веб-страница с формой.
- `src/styles.css` - стили страницы.
- `src/formLogic.js` - логика нормализации и валидации формы.
- `src/app.js` - обработчик отправки формы в браузере.
- `tests/formLogic.test.js` - unit-тесты логики формы.
- `tests/ui.test.js` - UI-тесты формы с Selenium.
- `scripts/build.js` - сборка проекта в папку `dist`.
- `scripts/serve.js` - локальный запуск страницы.
- `.github/workflows/ci.yml` - CI/CD pipeline для GitHub Actions.

## Локальный запуск

```bash
npm install
npm test
npm run build
npm start
```

После запуска страница доступна по адресу `http://localhost:3000`.

## Что проверяют тесты

1. Страница открывается и отображает форму.
2. При отправке пустой формы появляются сообщения об ошибках.
3. При вводе значения ошибка у соответствующего поля очищается.
4. При корректной отправке появляется сообщение об успехе, а форма сбрасывается.

## Настройка репозитория

1. Создать репозиторий на GitHub в аккаунте `Ancr33z`.
2. Инициализировать проект и выполнить первый коммит в ветку `main`.
3. Создать ветку `dev` для основной разработки.
4. Создавать отдельную ветку `fix` для исправления ошибки или небольшой задачи.
5. Отправить ветки на GitHub.
6. Создавать pull request из `fix` в `dev`.
7. После успешных тестов выполнить merge в `dev`.
8. Создать pull request из `dev` в `main`.
9. После успешных тестов выполнить merge в `main`.

Пример команд:

```bash
git init
git branch -M main
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/Ancr33z/lab11-ci-cd.git
git push -u origin main

git checkout -b dev
git push -u origin dev

git checkout -b fix
git push -u origin fix
```

## GitHub Actions

Workflow находится в файле `.github/workflows/ci.yml`.

Pipeline запускается при:

- `push` в ветки `main`, `dev`, `fix`;
- `pull_request` в ветки `main`, `dev`;
- ручном запуске через `workflow_dispatch`.

Этапы pipeline:

1. Получение кода из репозитория.
2. Установка Node.js.
3. Установка зависимостей командой `npm ci`.
4. Запуск unit- и UI-тестов командой `npm test`.
5. Сборка статического сайта командой `npm run build`.
6. Публикация на GitHub Pages только после успешных тестов в ветке `main`.

## GitHub Pages

Для публикации приложения нужно открыть настройки репозитория:

```text
Settings -> Pages -> Build and deployment -> Source -> GitHub Actions
```

После успешного merge в `main` сайт будет опубликован через GitHub Pages.

## Ожидаемый результат

При успешном выполнении workflow GitHub Actions показывает зеленый статус. Если внести ошибку в код или тест, сборка завершается неуспешно, а merge можно выполнять только после исправления ошибки.
