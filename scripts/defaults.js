const ENVIRONMENTS = ["live", "develop", "develop-ci"];
const KNOWN_SERVICES = [
  "archive",
  "association",
  "attribute",
  "availability",
  "availability-partner",
  "benefit",
  "brand",
  "cashback",
  "changes",
  "content",
  "customerreview",
  "dashboard",
  "dataflush",
  "deal",
  "expertreview",
  "grafana",
  "inventory",
  "inventory-partner",
  "jobtrigger",
  "media-image",
  "media-image-partner",
  "media-transfer",
  "media-video",
  "navigation",
  "offer",
  "offering",
  "option",
  "permission",
  "prediction",
  "pricing",
  "pricing-partner",
  "product",
  "product-mediatype",
  "report",
  "schema",
  "search",
  "search-refresh",
  "shopping",
  "statistics",
  "survey",
  "validation"
];
let services = []; 
const settingsLoadedEvent = new Event("oesSettingsLoaded");

function onError(error) {
    console.log(`Error: ${error}`);
}

function initSettings(settings) {
    services = settings.services || KNOWN_SERVICES;
    document.dispatchEvent(settingsLoadedEvent);
}

function saveSettings() {
    browser.storage.sync.set({
        services: services
    });

    browser.runtime.sendMessage({
        topic: "reloadSettings"
    })
}

function loadSettings() {
    browser.storage.sync.get({
        services: KNOWN_SERVICES
    }).then(initSettings, onError);
}

function handleMessage(message) {
    if (message.topic !== "reloadSettings") {
        return;
    }

    loadSettings();
}

loadSettings();
browser.runtime.onMessage.addListener(handleMessage);

