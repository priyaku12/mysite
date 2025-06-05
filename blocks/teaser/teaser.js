export default function decorate(block) {
  const textCol = block.querySelector('div:nth-child(1)');
  const imageCol = block.querySelector('div:nth-child(2)');

  block.classList.add('teaser');
  textCol?.classList.add('teaser-text');
  imageCol?.classList.add('teaser-image');

  // Find the button link and style it
  const link = textCol?.querySelector('a');
  if (link) {
    link.classList.add('teaser-button');
    link.setAttribute('role', 'button');
  }

  // Optional: ensure image loads from picture
  const img = imageCol?.querySelector('picture img');
  if (img) {
    img.setAttribute('loading', 'lazy');
  } else {
    console.warn('No image found in teaser block');
  }
}
