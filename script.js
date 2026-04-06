const urlBar = document.getElementById('url-bar');
const btnBack = document.getElementById('btn-back');
const btnForward = document.getElementById('btn-forward');
const btnRefresh = document.getElementById('btn-refresh');
const btnGo = document.getElementById('btn-go');
const btnBlocked = document.getElementById('btn-blocked');
const blockedPanel = document.getElementById('blocked-panel');
const tabs = document.querySelectorAll('.tab');
const frames = document.querySelectorAll('.frame');

let currentTab = 0;

const tabState = [
  { history: ['https://neal.fun'], index: 0 },
  { history: [''], index: 0 },
  { history: [''], index: 0 },
  { history: [''], index: 0 },
];

function getFrame(n) {
  return document.getElementById('frame-' + n);
}

function navigate(url) {
  if (!url) return;
  if (!url.startsWith('http')) url = 'https://' + url;
  const state = tabState[currentTab];
  state.history = state.history.slice(0, state.index + 1);
  state.history.push(url);
  state.index++;
  getFrame(currentTab).src = url;
  urlBar.value = url;
  tabs[currentTab].textContent = new URL(url).hostname;
  updateButtons();
}

function updateButtons() {
  const state = tabState[currentTab];
  btnBack.disabled = state.index <= 0;
  btnForward.disabled = state.index >= state.history.length - 1;
}

function switchTab(n) {
  tabs[currentTab].classList.remove('active');
  frames[currentTab].classList.remove('active');
  currentTab = n;
  tabs[currentTab].classList.add('active');
  frames[currentTab].classList.add('active');
  const state = tabState[currentTab];
  urlBar.value = state.history[state.index] || '';
  updateButtons();
}

tabs.forEach((tab, i) => {
  tab.addEventListener('click', () => switchTab(i));
});

frames.forEach((frame, i) => {
  frame.addEventListener('load', () => {
    try {
      const newUrl = frame.contentWindow.location.href;
      if (newUrl && newUrl !== 'about:blank') {
        tabState[i].history[tabState[i].index] = newUrl;
        if (i === currentTab) {
          urlBar.value = newUrl;
          tabs[i].textContent = new URL(newUrl).hostname;
        }
      }
    } catch (e) {}
  });
});

btnBack.addEventListener('click', () => {
  const state = tabState[currentTab];
  if (state.index > 0) {
    state.index--;
    const url = state.history[state.index];
    getFrame(currentTab).src = url;
    urlBar.value = url;
    updateButtons();
  }
});

btnForward.addEventListener('click', () => {
  const state = tabState[currentTab];
  if (state.index < state.history.length - 1) {
    state.index++;
    const url = state.history[state.index];
    getFrame(currentTab).src = url;
    urlBar.value = url;
    updateButtons();
  }
});

btnRefresh.addEventListener('click', () => {
  getFrame(currentTab).src = getFrame(currentTab).src;
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
