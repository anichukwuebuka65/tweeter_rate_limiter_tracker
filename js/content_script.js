let elem;
let tempElem = elem;

let isNewTweet;
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
    isNewTweet = true;
    observeElem(elem);
  }
}

function observeNextElem() {
  tempElem = elem;
  elem = elem?.nextElementSibling;

  if (elem && isAboveViewport(elem)) {
    elem = elem.nextElementSibling;
    observeNextElem();
  }

  if (elem) {
    isNewTweet = true;
    return observeElem(elem);
  }

  elem = tempElem;
  isNewTweet = false;
  observeElem(elem);
}

function isAboveViewport(elem) {
  return elem.getBoundingClientRect().y < 0;
}

function observeElem(elem) {
  observer.observe(elem);
}

function handleIntersection() {
  try {
    observer.unobserve(elem);
  } catch (error) {
    //elem is null
  }
  observeNextElem();
  isNewTweet && saveToLocalStorage();
}

async function saveToLocalStorage() {
  const prevCount = await getPrevSavedCount();

  try {
    chrome.storage.local.set({
      noOfTweet2342: Number(prevCount + 1),
    });
  } catch (err) {
    alert("unable to save your rate limit count to localstorage");
  }
}

async function getPrevSavedCount() {
  try {
    const count = await chrome.storage.local.get(["noOfTweet2342"]);
    console.log(count.noOfTweet2342 ?? 0);
    return count.noOfTweet2342 ?? 0;
  } catch (err) {
    // alert("unable to retrieve data");
  }
}
