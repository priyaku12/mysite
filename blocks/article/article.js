export default async function decorate(block) {
  // Read config from first row (light gray row)
  const config = Object.fromEntries(
    [...block.querySelectorAll(':scope > div')][0]?.querySelectorAll('div')
      ? [...block.querySelectorAll(':scope > div')][0].querySelectorAll('div')
          .map((div) => div.textContent.split('=').map(s => s.trim()))
      : []
  );

  const jsonUrl = config['json-url'] || '/query-index.json';

  // Fetch and process entries
  const entries = await getQueryIndex(jsonUrl);
  const articles = entries.filter((e) => e.path?.startsWith('/article'));

  articles.forEach((entry) => {
    const row = buildCardRow(entry);
    block.append(row);
  });

  // Build <ul> structure
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
