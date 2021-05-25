const PROTOCOL = "https://";
const BASE_URL = ".opal.cloud.otto.de/opal-";
const ENVIRONMENTS = ["live", "develop", "develop-ci"];
const KNOWN_SERVICES = [
  "archive",
  "association",
  "attribute",
  "availability",
  "availability-partner",
  "baseimage",
  "benefit",
  "brand",
  "cashback",
  "changes",
  "content",
  "customerreview",
  "dashboard",
  "dataflush",
  "deal",
  "environment",
  "expertreview",
  "gatekeeper",
  "grafana",
  "inventory",
  "inventory-partner",
  "jenkins",
  "jobtrigger",
  "media-image",
  "media-image-partner",
  "media-transfer",
  "media-video",
  "navigation",
  "offer",
  "offering",
  "option",
  "pegdown",
  "permission",
  "permission.wiki",
  "prediction",
  "pricing",
  "product",
  "product-mediatype",
  "report",
  "schema",
  "search",
  "search-refresh",
  "shopping",
  "statistics",
  "status",
  "survey",
  "toolbox",
  "txt-resolv",
  "validation"
];



let thisBrowser = null;
if (typeof browser === 'undefined') {
  thisBrowser = chrome;
} else {
  thisBrowser = browser;
}

// Provide help text to the user.
thisBrowser.omnibox.setDefaultSuggestion({
  description: `Open the corresponding opal service with the chosen environment (default live)
    (e.g. "inventory" | "archive develop")`
});

// Update the suggestions whenever the input is changed.
thisBrowser.omnibox.onInputChanged.addListener((text, addSuggestions) => {
  let suggestions = [];
  let parts = text.split(' ');
  if (parts.length > 1) {
    let service = autocompleteService(parts[0]);
    ENVIRONMENTS.forEach(environment => {
      suggestions.push(createSuggestion(service, environment));
    });

  } else if (parts.length > 0) {
    let serviceStart = parts[0];
    let environment = ENVIRONMENTS[0];
    KNOWN_SERVICES.forEach(service => {
      if (service.startsWith(serviceStart)) {
        suggestions.push(createSuggestion(service, environment));
      }
    });
  } else {
    return;
  }

  addSuggestions(suggestions);
});

// Open the page based on how the user clicks on a suggestion.
thisBrowser.omnibox.onInputEntered.addListener((text, disposition) => {
  let url = text;
  if (!text.startsWith(PROTOCOL)) {
    let parts = text.split(' ');
    if (parts.length === 0) {
      // skip
      return;
    }

    let service = autocompleteService(parts[0]);
    let environment = ENVIRONMENTS[0];
    if (parts.length > 1) {
      environment = autocompleteEnvironment(parts[1]);
    }

    url = buildServiceUrl(service, environment)
  }

  switch (disposition) {
    case "currentTab":
      thisBrowser.tabs.update({ url });
      break;
    case "newForegroundTab":
      thisBrowser.tabs.create({ url });
      break;
    case "newBackgroundTab":
      thisBrowser.tabs.create({ url, active: false });
      break;
  }
});

function buildServiceUrl(service, environment) {
  return `${PROTOCOL}${service}.${environment}${BASE_URL}${service}/`;
}

function autocompleteService(start) {
  let service = KNOWN_SERVICES.find(s => s.startsWith(start));
  if (!service) {
    service = start;
  }

  return service;
}

function autocompleteEnvironment(start) {
  let environment = ENVIRONMENTS.find(e => e.startsWith(start));
  if (!environment) {
    environment = start;
  }

  return environment
}

function createSuggestion(service, environment) {
  return {
    content: `${service} ${environment}`,
    description: `Open opal-${service} in the ${environment} environment`
  }
}

function escapeRegex(input) {
  return input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**********/
/* CHROME */
/**********/

// Called when the url of a tab changes.
function checkForValidUrl(tabId, changeInfo, tab) {
  if (!tab.url) {
    return;
  }

  let regex = escapeRegex(PROTOCOL) + ".+" + escapeRegex(BASE_URL) + ".+";
  if (tab.url.match(regex)) {
      chrome.pageAction.show(tabId);
  }
};

if (typeof chrome !== 'undefined') {
  // Listen for any changes to the URL of any tab.
  chrome.tabs.onUpdated.addListener(checkForValidUrl);
}