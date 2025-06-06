import { createOptimizedPicture } from '../../scripts/aem.js';

function buildCardRow(entry) {
  const row = document.createElement('div');

  // Image container
  const imgDiv = document.createElement('div');
  const picture = createOptimizedPicture(entry.image, entry.title, false, [{ width: '750' }]);
  imgDiv.append(picture);

  // Body container
  const bodyDiv = document.createElement('div');
  bodyDiv.innerHTML = `
    <h3><a href="${entry.path}">${entry.title}</a></h3>
    <p>${entry.description || ''}</p>
  `;

  row.append(imgDiv, bodyDiv);
  return row;
}

async function getQueryIndex(jsonUrl) {
  const resp = await fetch(jsonUrl);
  const json = await resp.json();
  return json.data.map((row) =>
    Object.fromEntries(json.columns.map((col, i) => [col, row[i]]))
  );
}

export default async function decorate(block) {
  const jsonUrl = block.dataset.jsonUrl || '/query-index.json';
  const entries = await getQueryIndex(jsonUrl);

  const articles = entries.filter((e) => e.path?.startsWith('/article'));

  articles.forEach((entry) => {
    const row = buildCardRow(entry);
    block.append(row);
  });

  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) {
        div.className = 'cards-card-image';
      } else {
        div.className = 'cards-card-body';
      }
    });
    ul.append(li);
  });

  block.textContent = '';
  block.append(ul);
}
