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
    browser.tabs.update({ url });
    window.close();
  }

  if (e.target.classList.contains("environment")) {
    browser.tabs.query({ active: true, currentWindow: true })
      .then(changeEnvironment, console.error);
  }

});

browser.tabs.query({ active: true, currentWindow: true })
  .then(markCurrentEnvironment, console.error);