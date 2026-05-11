const assert = require("node:assert/strict");
const { spawn } = require("node:child_process");
const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");
const { after, before, test } = require("node:test");
const { Builder, By, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");

const root = path.resolve(__dirname, "..");
const port = Number(process.env.TEST_PORT || 4173);
const baseUrl = `http://127.0.0.1:${port}`;
const serverOutput = [];
let serverProcess;

function rememberOutput(chunk) {
  serverOutput.push(chunk.toString());
}

function waitForServer(url, timeoutMs = 15000) {
  const startedAt = Date.now();

  return new Promise((resolve, reject) => {
    const check = () => {
      const request = http.get(url, (response) => {
        response.resume();
        resolve();
      });

      request.on("error", () => {
        if (Date.now() - startedAt > timeoutMs) {
          reject(new Error(`Server did not start. Output:\n${serverOutput.join("")}`));
          return;
        }

        setTimeout(check, 250);
      });

      request.setTimeout(1000, () => {
        request.destroy();
      });
    };

    check();
  });
}

async function createDriver() {
  const options = new chrome.Options()
    .addArguments("--headless=new")
    .addArguments("--no-sandbox")
    .addArguments("--disable-dev-shm-usage")
    .addArguments("--window-size=1280,900");

  const localChromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

  if (process.env.CHROME_BIN) {
    options.setChromeBinaryPath(process.env.CHROME_BIN);
  } else if (process.platform === "win32" && fs.existsSync(localChromePath)) {
    options.setChromeBinaryPath(localChromePath);
  }

  return new Builder()
    .forBrowser("chrome")
    .setChromeOptions(options)
    .build();
}

async function withDriver(callback) {
  const driver = await createDriver();

  try {
    await callback(driver);
  } finally {
    await driver.quit();
  }
}

async function openPage(driver) {
  await driver.get(baseUrl);
  await driver.wait(until.elementLocated(By.id("feedback-form")), 5000);
}

before(async () => {
  serverProcess = spawn(process.execPath, ["scripts/serve.js"], {
    cwd: root,
    env: {
      ...process.env,
      PORT: String(port)
    },
    stdio: ["ignore", "pipe", "pipe"]
  });

  serverProcess.stdout.on("data", rememberOutput);
  serverProcess.stderr.on("data", rememberOutput);
  await waitForServer(baseUrl);
});

after(() => {
  if (serverProcess && !serverProcess.killed) {
    serverProcess.kill();
  }
});

test("page renders the feedback form", async () => {
  await withDriver(async (driver) => {
    await openPage(driver);

    assert.equal(await driver.findElement(By.css("h1")).getText(), "Заявка на настройку CI/CD");
    assert.ok(await driver.findElement(By.id("name")).isDisplayed());
    assert.ok(await driver.findElement(By.id("email")).isDisplayed());
    assert.ok(await driver.findElement(By.id("topic")).isDisplayed());
    assert.ok(await driver.findElement(By.id("message")).isDisplayed());
  });
});

test("empty submit shows validation messages", async () => {
  await withDriver(async (driver) => {
    await openPage(driver);
    await driver.findElement(By.css('button[type="submit"]')).click();

    assert.match(await driver.findElement(By.id("name-error")).getText(), /Введите имя/);
    assert.match(await driver.findElement(By.id("email-error")).getText(), /корректный email/);
    assert.match(await driver.findElement(By.id("topic-error")).getText(), /Выберите тему/);
    assert.match(await driver.findElement(By.id("message-error")).getText(), /не короче 10/);
    assert.match(await driver.findElement(By.id("consent-error")).getText(), /Подтвердите согласие/);
  });
});

test("typing in a field clears its validation message", async () => {
  await withDriver(async (driver) => {
    await openPage(driver);
    await driver.findElement(By.css('button[type="submit"]')).click();

    const nameInput = await driver.findElement(By.id("name"));
    await nameInput.sendKeys("Иван");

    assert.equal(await driver.findElement(By.id("name-error")).getText(), "");
  });
});

test("valid submit shows success message and resets the form", async () => {
  await withDriver(async (driver) => {
    await openPage(driver);

    await driver.findElement(By.id("name")).sendKeys("Анна");
    await driver.findElement(By.id("email")).sendKeys("anna@example.com");
    await driver.findElement(By.css('#topic option[value="build"]')).click();
    await driver.findElement(By.id("message")).sendKeys("Нужно настроить сборку проекта.");
    await driver.findElement(By.id("consent")).click();
    await driver.findElement(By.css('button[type="submit"]')).click();

    const status = await driver.findElement(By.id("form-status")).getText();
    assert.match(status, /Спасибо, Анна/);
    assert.match(status, /Сборка приложения/);
    assert.equal(await driver.findElement(By.id("name")).getAttribute("value"), "");
  });
});
