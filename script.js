const book = document.getElementById('book');
const spreads = Array.from(book.querySelectorAll('.spread'));
const back = document.getElementById('back');
const next = document.getElementById('next');
const label = document.getElementById('page-label');
const count = document.getElementById('page-count');
const dialog = document.querySelector('.artwork-dialog');
const fullArtwork = dialog.querySelector('img');
const pages = new Map(spreads.map((spread, index) => [spread.id, index]));

let active = 0;
let touch = null;
let suppressClick = false;

function showPage(index, { updateHistory = false, focus = false } = {}) {
  if (!spreads[index]) return;

  const previous = spreads[active];
  const current = spreads[index];
  const title = document.getElementById(`${current.id}-title`);

  if (index !== active) {
    previous.hidden = true;
    previous.classList.remove('turning-forward', 'turning-back');
    current.hidden = false;
    current.scrollTop = 0;
    current.classList.add(index > active ? 'turning-forward' : 'turning-back');
    active = index;
  }

  back.disabled = active === 0;
  next.disabled = active === spreads.length - 1;
  label.textContent = active === 0 ? 'Cover' : current.id === 'news' ? 'Official Gazette' : title.textContent;
  count.textContent = `${active + 1} / ${spreads.length}`;

  if (updateHistory && location.hash !== `#${current.id}`) {
    history.pushState(null, '', `#${current.id}`);
  }

  if (focus) {
    title.focus({ preventScroll: true });
    if (book.getBoundingClientRect().top < 0) window.scrollTo({ top: 0, behavior: 'instant' });
  }
}

function turn(distance) {
  showPage(active + distance, { updateHistory: true, focus: true });
}

function followHash() {
  showPage(pages.get(location.hash.slice(1)) ?? 0);
}

back.addEventListener('click', () => turn(-1));
next.addEventListener('click', () => turn(1));
window.addEventListener('popstate', followHash);
window.addEventListener('hashchange', followHash);

document.addEventListener('click', (event) => {
  if (suppressClick || event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.altKey || event.shiftKey) return;

  const link = event.target.closest('a[href]');
  if (!link) return;

  const href = link.getAttribute('href');
  if (href.startsWith('#') && pages.has(href.slice(1))) {
    event.preventDefault();
    showPage(pages.get(href.slice(1)), { updateHistory: true, focus: true });
  }

  const thumbnail = link.querySelector('img');
  if (link.hasAttribute('data-plate') && thumbnail?.complete && thumbnail.naturalWidth > 0) {
    event.preventDefault();
    fullArtwork.src = thumbnail.currentSrc;
    fullArtwork.alt = thumbnail.alt;
    dialog.showModal();
  }
});

document.addEventListener('keydown', (event) => {
  if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey || dialog.open) return;
  if (event.target.closest('input, select, textarea, [contenteditable="true"], .gallery-controls')) return;
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    event.preventDefault();
    turn(event.key === 'ArrowLeft' ? -1 : 1);
  }
});

book.addEventListener('touchstart', (event) => {
  if (event.touches.length !== 1 || event.target.closest('button')) {
    touch = null;
    return;
  }
  const finger = event.touches[0];
  touch = { x: finger.clientX, y: finger.clientY, id: finger.identifier };
}, { passive: true });

book.addEventListener('touchcancel', () => { touch = null; });
book.addEventListener('touchend', (event) => {
  if (!touch) return;
  const finger = Array.from(event.changedTouches).find(item => item.identifier === touch.id);
  if (!finger) return;

  const horizontal = finger.clientX - touch.x;
  const vertical = finger.clientY - touch.y;
  touch = null;
  if (Math.abs(horizontal) < 52 || Math.abs(horizontal) < Math.abs(vertical) * 1.5) return;

  event.preventDefault();
  suppressClick = true;
  setTimeout(() => { suppressClick = false; }, 350);
  turn(horizontal < 0 ? 1 : -1);
}, { passive: false });

book.addEventListener('click', (event) => {
  if (!suppressClick) return;
  event.preventDefault();
  event.stopPropagation();
}, true);

dialog.querySelector('button').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', (event) => {
  if (event.target === dialog) dialog.close();
});

book.querySelectorAll('[data-gallery]').forEach(gallery => {
  const slides = Array.from(gallery.querySelectorAll('figure'));
  const galleryCount = gallery.querySelector('[aria-live]');
  let index = 0;

  gallery.addEventListener('click', (event) => {
    const button = event.target.closest('[data-gallery-step]');
    if (!button) return;

    slides[index].hidden = true;
    index = (index + Number(button.dataset.galleryStep) + slides.length) % slides.length;
    slides[index].hidden = false;
    galleryCount.textContent = `${index + 1} / ${slides.length}`;
  });
});

followHash();
