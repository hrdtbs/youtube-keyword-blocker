const onRun = () => {
  const STYLE_ID = "youtube-blacklist";
  chrome.storage.sync.get(null, (options) => {
    const current = document.getElementById(STYLE_ID);

    const action = current ? "update" : "create";

    const textContent = `
      :is(
          ytd-rich-item-renderer, 
          ytd-video-renderer, 
          ytd-reel-item-renderer,
          ytd-grid-video-renderer
      ):has(
          :is(
              ${options.blacklist
                .map((word) => `a[aria-label*=${word}]`)
                .join(", ")}
          )
      ) {
          display: none !important;
      }
      ytd-radio-renderer:has(
          is(
            ${options.blacklist
              .map((word) => `span[title*=${word}]`)
              .join(", ")}
          )
      ){
          display: none !important;
      }
  `
      .split("\n")
      .map((line) => line.trim())
      .join("");

    if (action === "update") {
      current.textContent = textContent;
    } else if (action === "create") {
      const style = document.createElement("style");
      style.id = STYLE_ID;
      style.textContent = textContent;
      document.head.append(style);
    }
  });
};

chrome.runtime.onMessage.addListener(async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: onRun,
  });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete") {
    chrome.scripting.executeScript({
      target: { tabId: tabId },
      function: onRun,
    });
  }
});
