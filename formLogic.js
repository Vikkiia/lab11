(function attachFormLogic(root, factory) {
  const api = factory();

  if (typeof module === "object" && module.exports) {
    module.exports = api;
  }

  root.feedbackForm = api;
})(typeof globalThis !== "undefined" ? globalThis : window, function buildFormLogic() {
  const TOPICS = {
    testing: "Автоматизированное тестирование",
    build: "Сборка приложения",
    deploy: "Публикация артефакта"
  };

  function normalizeFeedbackForm(input) {
    const data = input || {};

    return {
      name: String(data.name || "").trim(),
      email: String(data.email || "").trim(),
      topic: String(data.topic || "").trim(),
      message: String(data.message || "").trim(),
      consent: Boolean(data.consent)
    };
  }

  function validateFeedbackForm(input) {
    const values = normalizeFeedbackForm(input);
    const errors = {};
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (values.name.length < 2) {
      errors.name = "Введите имя не короче 2 символов.";
    }

    if (!emailPattern.test(values.email)) {
      errors.email = "Введите корректный email.";
    }

    if (!Object.prototype.hasOwnProperty.call(TOPICS, values.topic)) {
      errors.topic = "Выберите тему заявки.";
    }

    if (values.message.length < 10) {
      errors.message = "Описание должно быть не короче 10 символов.";
    }

    if (!values.consent) {
      errors.consent = "Подтвердите согласие на обработку заявки.";
    }

    return {
      values,
      errors,
      isValid: Object.keys(errors).length === 0
    };
  }

  function createSuccessMessage(values) {
    const topicLabel = TOPICS[values.topic] || "CI/CD";

    return `Спасибо, ${values.name}! Заявка по теме "${topicLabel}" принята.`;
  }

  return {
    TOPICS,
    normalizeFeedbackForm,
    validateFeedbackForm,
    createSuccessMessage
  };
});
