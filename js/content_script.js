let elem;
let readTweets = 0;
const observer = new IntersectionObserver(handleObserver);
const updateTimer = setInterval(() => handleUpdateTimer(updateTimer), 1000);

function handleObserver([entry]) {
  if (entry?.isIntersecting) {
    handleIntersection();
  }
}

function handleUpdateTimer(timer) {
  const tempElem = document.querySelector('[data-testid="cellInnerDiv"]');
  if (tempElem) {
    elem = tempElem;
    clearInterval(timer);
    observeElem();
  }
}

function observeNextElem() {
  elem = elem.nextElementSibling;

  if (elem && isAboveViewport(elem)) {
    elem = elem.nextElementSibling;
    observeNextElem();
  }

  if (elem) {
    return observeElem();
  }

  const timer = setInterval(() => handleUpdateTimer(timer), 1000);
}

function isAboveViewport(elem) {
  return elem.getBoundingClientRect().y < 0;
}

function observeElem() {
  observer.observe(elem);
}

function handleIntersection() {
  observer.unobserve(elem);
  observeNextElem();
  saveToLocalStorage(readTweets);
}

async function saveToLocalStorage(readTweets) {
  const prevCount = await getPrevSavedCount();

  try {
    chrome.storage.local.set({
      noOfTweet2342: readTweets + Number(prevCount + 1),
    });
  } catch (err) {
    alert("unable to save your rate limit count to localstorage");
  }
}

async function getPrevSavedCount() {
  try {
    const count = await chrome.storage.local.get(["noOfTweet2342"]);
    console.log(count.noOfTweet2342);
    if (count.noOfTweet2342) {
      return count.noOfTweet2342;
    }
    return 0;
  } catch (err) {
    // alert("unable to retrieve data");
  }
}
