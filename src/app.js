const form = document.querySelector("#feedback-form");
const statusNode = document.querySelector("#form-status");
const fields = ["name", "email", "topic", "message", "consent"];

function readFormData(formNode) {
  const data = new FormData(formNode);

  return {
    name: data.get("name"),
    email: data.get("email"),
    topic: data.get("topic"),
    message: data.get("message"),
    consent: data.get("consent") === "on"
  };
}

function setError(fieldName, message) {
  const field = document.querySelector(`#${fieldName}`);
  const errorNode = document.querySelector(`#${fieldName}-error`);

  if (field) {
    field.classList.toggle("is-invalid", Boolean(message));
    field.setAttribute("aria-invalid", Boolean(message).toString());
  }

  if (errorNode) {
    errorNode.textContent = message || "";
  }
}

function clearErrors() {
  fields.forEach((fieldName) => setError(fieldName, ""));
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  clearErrors();

  const result = window.feedbackForm.validateFeedbackForm(readFormData(form));

  if (!result.isValid) {
    Object.entries(result.errors).forEach(([fieldName, message]) => {
      setError(fieldName, message);
    });

    statusNode.textContent = "";
    return;
  }

  statusNode.textContent = window.feedbackForm.createSuccessMessage(result.values);
  form.reset();
});

fields.forEach((fieldName) => {
  const field = document.querySelector(`#${fieldName}`);

  if (field) {
    const clearFieldState = () => {
      setError(fieldName, "");
      statusNode.textContent = "";
    };

    field.addEventListener("input", clearFieldState);
    field.addEventListener("change", clearFieldState);
  }
});
