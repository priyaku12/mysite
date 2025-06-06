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
  if (!resp.ok) {
    console.error(`Failed to fetch ${jsonUrl}`);
    return [];
  }

  const json = await resp.json();
  return json.data.map((row) =>
    Object.fromEntries(json.columns.map((col, i) => [col, row[i]]))
  );
}

export default async function decorate(block) {
  // Try reading config from first row (if any)
  const firstRow = block.querySelector(':scope > div');
  let jsonUrl = '/query-index.json'; // default fallback

  if (firstRow) {
    const configDivs = firstRow.querySelectorAll('div');
    configDivs.forEach((div) => {
      const [key, value] = div.textContent.split('=').map((s) => s.trim());
      if (key === 'json-url' && value) {
        jsonUrl = value.replace(/^"|"$/g, ''); // remove quotes
      }
    });

    // Remove config row from DOM
    firstRow.remove();
  }

  const entries = await getQueryIndex(jsonUrl);
  const articles = entries.filter((e) => e.path?.startsWith('/article'));

  // Create a <ul> for structure
  const ul = document.createElement('ul');

  articles.forEach((entry) => {
    const row = buildCardRow(entry);

    const li = document.createElement('li');
    while (row.firstChild) li.append(row.firstChild);

    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) {
        div.className = 'cards-card-image';
      } else {
        div.className = 'cards-card-body';
      }
    });

    ul.append(li);
  });

  // Clear block and append built content
  block.textContent = '';
  block.append(ul);
}
