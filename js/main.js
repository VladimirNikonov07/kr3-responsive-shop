/* Диалог, выбор товара по ссылке и демонстрационная проверка формы. */
document.addEventListener('DOMContentLoaded', () => {
  const fallbackImageUrl = new URL('images/image-fallback.svg', document.baseURI).href;
  document.querySelectorAll('img').forEach((image) => {
    image.addEventListener('error', () => {
      if (image.dataset.fallbackApplied === 'true') return;
      image.dataset.fallbackApplied = 'true';
      image.src = fallbackImageUrl;
      image.alt = image.alt || 'Изображение недоступно';
    }, { once: true });
  });

  const dialog = document.querySelector('[data-fit-dialog]');
  if (dialog instanceof HTMLDialogElement) {
    document.querySelectorAll('[data-dialog-open]').forEach((button) => {
      button.addEventListener('click', () => { if (!dialog.open) { button.focus(); dialog.showModal(); } });
    });
    document.querySelectorAll('[data-dialog-close]').forEach((button) => {
      button.addEventListener('click', () => dialog.close());
    });
    dialog.addEventListener('click', (event) => {
      if (event.target === dialog) dialog.close();
    });
  }

  const productField = document.querySelector('#customer-product');
  if (productField instanceof HTMLSelectElement) {
    const requestedProduct = new URLSearchParams(window.location.search).get('product');
    if (requestedProduct) {
      const option = Array.from(productField.options).find((item) => item.value === requestedProduct);
      if (option) productField.value = option.value;
    }
  }

  const topicField = document.querySelector('#customer-topic');
  if (topicField instanceof HTMLSelectElement) {
    const requestedTopic = new URLSearchParams(window.location.search).get('topic');
    if (requestedTopic && Array.from(topicField.options).some((option) => option.value === requestedTopic)) {
      topicField.value = requestedTopic;
    }
  }

  const form = document.querySelector('#order-form');
  const result = document.querySelector('#form-result');
  if (form instanceof HTMLFormElement && result instanceof HTMLElement) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      result.hidden = false;
      result.textContent = 'Поля заполнены корректно. Это учебная форма: заявка не отправлена и не сохранена.';
      result.focus();
    });
  }
});

const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#site-menu');
const wideScreen = window.matchMedia('(min-width: 768px)');
function setMenu(open) {
  menuButton.hidden = wideScreen.matches;
  menuButton.setAttribute('aria-expanded', String(open));
  navigation.hidden = !wideScreen.matches && !open;
}
setMenu(false);
wideScreen.addEventListener('change', () => setMenu(false));
menuButton.addEventListener('click', () => setMenu(navigation.hidden));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !wideScreen.matches && !navigation.hidden) {
    setMenu(false);
    menuButton.focus();
  }
});
const filter = document.querySelector('#category-filter');
if (filter) {
  const groups = document.querySelectorAll('.product-group');
  function showCategory(category) {
    let count = 0;
    for (const group of groups) {
      group.hidden = Boolean(category) && group.id !== category;
      if (!group.hidden) count += group.querySelectorAll('.product-card').length;
    }
    filter.value = category;
    document.querySelector('#filter-result').textContent = 'Товаров показано: ' + count;
  }
  filter.parentElement.hidden = false;
  filter.addEventListener('change', () => showCategory(filter.value));
  document.querySelectorAll('.catalog-sidebar nav a').forEach(link => {
    link.addEventListener('click', () => showCategory(''));
  });
  window.addEventListener('hashchange', () => showCategory(''));
  showCategory('');
}
const feedback = document.querySelector('#feedback-form');
feedback?.addEventListener('submit', event => {
  event.preventDefault();
  document.querySelector('#feedback-result').textContent = 'Сообщение заполнено корректно. Учебная форма не отправляет данные.';
});
