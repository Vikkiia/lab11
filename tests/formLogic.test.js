const assert = require("node:assert/strict");
const test = require("node:test");
const {
  normalizeFeedbackForm,
  validateFeedbackForm,
  createSuccessMessage
} = require("../src/formLogic");

const validForm = {
  name: "Анна",
  email: "anna@example.com",
  topic: "testing",
  message: "Нужно настроить автотесты для формы.",
  consent: true
};

test("normalizeFeedbackForm trims string fields", () => {
  const result = normalizeFeedbackForm({
    name: "  Иван  ",
    email: "  ivan@example.com ",
    topic: " build ",
    message: "  Проверка сборки проекта. ",
    consent: 1
  });

  assert.deepEqual(result, {
    name: "Иван",
    email: "ivan@example.com",
    topic: "build",
    message: "Проверка сборки проекта.",
    consent: true
  });
});

test("validateFeedbackForm accepts a correct form", () => {
  const result = validateFeedbackForm(validForm);

  assert.equal(result.isValid, true);
  assert.deepEqual(result.errors, {});
});

test("validateFeedbackForm returns field errors for invalid input", () => {
  const result = validateFeedbackForm({
    name: "A",
    email: "wrong-email",
    topic: "unknown",
    message: "short",
    consent: false
  });

  assert.equal(result.isValid, false);
  assert.deepEqual(Object.keys(result.errors).sort(), [
    "consent",
    "email",
    "message",
    "name",
    "topic"
  ]);
});

test("createSuccessMessage includes user name and selected topic", () => {
  const message = createSuccessMessage(validForm);

  assert.match(message, /Анна/);
  assert.match(message, /Автоматизированное тестирование/);
});
