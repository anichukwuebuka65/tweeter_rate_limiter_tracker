const limitCountElem = document.querySelector(".limit__count");

chrome.storage.local.get(["noOfTweet2342"]).then((count) => {
  limitCountElem.textContent = count.noOfTweet2342 ?? 0;
});
