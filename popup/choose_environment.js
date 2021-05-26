async function getCurrentTab() {
  let queryOptions = { active: true, currentWindow: true };
  let [tab] = await browser.tabs.query(queryOptions);
  return tab;
}

function markCurrentEnvironment(tab) {
  let currentUrl = tab.url;
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

  function changeEnvironment(tab) {
    let currentUrl = tab.url;
    let targetEnv = e.target.textContent.toLowerCase();
    let regex = /(https:\/\/[\w-_]+\.)(?:[\w-_]+)(\.opal\.cloud\.otto\.de.*)/;
    let url = currentUrl.replace(regex, "$1" + targetEnv + "$2");
    browser.tabs.update({ url });
    window.close();
  }

  if (e.target.classList.contains("environment")) {
    getCurrentTab().then(changeEnvironment, console.error);
  }

});

getCurrentTab().then(markCurrentEnvironment, console.error);