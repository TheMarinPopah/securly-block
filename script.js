const frame = document.getElementById('frame');
const urlBar = document.getElementById('url-bar');
const btnBack = document.getElementById('btn-back');
const btnForward = document.getElementById('btn-forward');
const btnRefresh = document.getElementById('btn-refresh');
const btnGo = document.getElementById('btn-go');
const btnBlocked = document.getElementById('btn-blocked');
const blockedPanel = document.getElementById('blocked-panel');

let history = ['https://www.neal.fun'];
let currentIndex = 0;

function navigate(url) {
  if (!url.startsWith('http')) url = 'https://' + url;
  history = history.slice(0, currentIndex + 1);
  history.push(url);
  currentIndex++;
  frame.src = url;
  urlBar.value = url;
  updateButtons();
}

function updateButtons() {
  btnBack.disabled = currentIndex <= 0;
  btnForward.disabled = currentIndex >= history.length - 1;
}

frame.addEventListener('load', () => {
  try {
    const newUrl = frame.contentWindow.location.href;
    if (newUrl && newUrl !== 'about:blank') {
      urlBar.value = newUrl;
      history[currentIndex] = newUrl;
    }
  } catch (e) {
    // Cross-origin page — can't read URL
  }
});

btnBack.addEventListener('click', () => {
  if (currentIndex > 0) {
    currentIndex--;
    frame.src = history[currentIndex];
    urlBar.value = history[currentIndex];
    updateButtons();
  }
});

btnForward.addEventListener('click', () => {
  if (currentIndex < history.length - 1) {
    currentIndex++;
    frame.src = history[currentIndex];
    urlBar.value = history[currentIndex];
    updateButtons();
  }
});

btnRefresh.addEventListener('click', () => {
  frame.src = frame.src;
});

btnGo.addEventListener('click', () => navigate(urlBar.value));

urlBar.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') navigate(urlBar.value);
});

btnBlocked.addEventListener('click', () => {
  blockedPanel.style.display = blockedPanel.style.display === 'block' ? 'none' : 'block';
});

document.addEventListener('click', (e) => {
  if (!e.target.closest('#btn-blocked') && !e.target.closest('#blocked-panel')) {
    blockedPanel.style.display = 'none';
  }
});
  
