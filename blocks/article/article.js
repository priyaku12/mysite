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
    <p><a href="${entry.path}">${entry.title}</a><p>
    <p>${entry.description || ''}</p>
  `;

  row.append(imgDiv, bodyDiv);
  return row;
}

async function getQueryIndex() {
  console.log('Fetching JSON...');
  const resp = await fetch('/query-index.json');
  if (!resp.ok) {
    console.error('Failed to fetch /query-index.json:', resp.status);
    return [];
  }
  const json = await resp.json();
  console.log('JSON fetched:', json);
   
  console.log('Raw columns:', json.columns);
  console.log('Raw data:', json.data);
 console.log('Raw data:', json.data);
  return json.data; 
}
export default async function decorate(block) {
   console.log('decorate called on block:', block);
  const entries = await getQueryIndex();
   console.log('All entries:', entries);

  const articles = entries.filter((e) => e.path?.startsWith('/article'));
  
console.log('Filtered articles:', articles);

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
