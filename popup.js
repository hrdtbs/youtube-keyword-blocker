const BlacklistField = document.getElementById("BlacklistField");
const UpdateButton = document.getElementById("UpdateButton");

chrome.storage.sync.get(null, (options) => {
  BlacklistField.value = options.blacklist.join("\n");
});

document.querySelector("textarea").addEventListener("input", () => {
  UpdateButton.disabled = false;
});

UpdateButton.addEventListener("click", async () => {
  const blacklist = BlacklistField.value.split(/\n|\,/).filter(Boolean);

  chrome.storage.sync.set({
    blacklist,
  });

  chrome.runtime.sendMessage({
    action: "update",
  });

  UpdateButton.disabled = true;
});
