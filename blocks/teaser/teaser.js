export default function decorate(block) {
  const textCol = block.querySelector('div:first-child');
  const imageCol = block.querySelector('div:last-child');

  block.classList.add('teaser');
  textCol.classList.add('teaser-text');
  imageCol.classList.add('teaser-image');

  const btn = textCol.querySelector('a');
  if (btn) {
    btn.classList.add('teaser-button');
    btn.setAttribute('role', 'button');
  }
}
