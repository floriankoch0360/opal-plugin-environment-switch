function saveOptions() {
  services = document.querySelector("#services").value.split("\n");
  saveSettings();
}

function restoreOptions() {
  document.querySelector("#services").value = services.join("\n");
}

function resetOptions() {
  document.querySelector("#services").value = KNOWN_SERVICES.join("\n");
}

document.addEventListener("oesSettingsLoaded", restoreOptions);
document.querySelector("#cancel").addEventListener("click", restoreOptions);
document.querySelector("#reset").addEventListener("click", resetOptions);
document.querySelector("#submit").addEventListener("click", saveOptions);

