let thisBrowser = null;
if (typeof browser === 'undefined') {
  thisBrowser = chrome;
} else {
  thisBrowser = browser;
}

function markCurrentEnvironment(tabs) {
  let currentUrl = tabs[0].url;
  let regex = /(?:https:\/\/[\w-_]+\.)([\w-_]+)(?:\.opal\.cloud\.otto\.de.*)/;
  let match = currentUrl.match(regex);
  if (match && match.length > 1) {
    let currentEnvironment = match[1].toLowerCase();
    let envButtons = document.querySelectorAll(".environment");
    envButtons.forEach(button => {
      if (button.textContent.toLowerCase() === currentEnvironment) {
        button.classList.add("environment-active");
      } else {
        button.classList.remove("environment-active");
      }
    });
  }
}

document.addEventListener("click", (e) => {

  function changeEnvironment(tabs) {
    let currentUrl = tabs[0].url;
    let targetEnv = e.target.textContent.toLowerCase();
    let regex = /(https:\/\/[\w-_]+\.)(?:[\w-_]+)(\.opal\.cloud\.otto\.de.*)/;
    let url = currentUrl.replace(regex, "$1" + targetEnv + "$2");
    thisBrowser.tabs.update({ url });
    window.close();
  }

  if (e.target.classList.contains("environment")) {
    thisBrowser.tabs.query({ active: true, currentWindow: true }, function(result) {
      changeEnvironment(result);
    });
  }

});

thisBrowser.tabs.query({ active: true, currentWindow: true }, function(result) {
  markCurrentEnvironment(result);
});