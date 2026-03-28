/**
 * Creates SVG icons using DOM API (no innerHTML) for XSS safety.
 */

const SVG_NS = 'http://www.w3.org/2000/svg';

function createSvg(width = 24, height = 24, viewBox = '0 0 24 24') {
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('viewBox', viewBox);
  svg.setAttribute('width', String(width));
  svg.setAttribute('height', String(height));
  return svg;
}

function createPath(d, fill) {
  const path = document.createElementNS(SVG_NS, 'path');
  path.setAttribute('d', d);
  if (fill !== undefined) {
    path.setAttribute('fill', fill);
  }
  return path;
}

export function createStarIcon(id) {
  const svg = createSvg();
  if (id) svg.id = id;
  svg.appendChild(createPath('M0 0h24v24H0z', 'none'));
  svg.appendChild(
    createPath(
      'M12 18.26l-7.053 3.948 1.575-7.928L.587 8.792l8.027-.952L12 .5l3.386 7.34 8.027.952-5.935 5.488 1.575 7.928z'
    )
  );
  return svg;
}

export function createDeleteIcon() {
  const svg = createSvg();
  svg.appendChild(createPath('M0 0h24v24H0z', 'none'));
  svg.appendChild(
    createPath(
      'M7 4V2h10v2h5v2h-2v15a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6H2V4h5zM6 6v14h12V6H6zm3 3h2v8H9V9zm4 0h2v8h-2V9z',
      '#ff9f1a'
    )
  );
  return svg;
}

export function createDownloadIcon() {
  const svg = createSvg();
  svg.appendChild(createPath('M0 0h24v24H0z', 'none'));
  svg.appendChild(
    createPath(
      'M13 10h5l-6 6-6-6h5V3h2v7zm-9 9h16v-7h2v8a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-8h2v7z'
    )
  );
  return svg;
}

export function createPhotoIcon() {
  const svg = createSvg();
  svg.appendChild(createPath('M0 0h24v24H0z', 'none'));
  svg.appendChild(
    createPath(
      'M5 11.1l2-2 5.5 5.5 3.5-3.5 3 3V5H5v6.1zM4 3h16a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zm11.5 7a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z'
    )
  );
  return svg;
}

export function createStarNavIcon() {
  const svg = createSvg();
  svg.appendChild(createPath('M0 0h24v24H0z', 'none'));
  svg.appendChild(
    createPath(
      'M12 18.26l-7.053 3.948 1.575-7.928L.587 8.792l8.027-.952L12 .5l3.386 7.34 8.027.952-5.935 5.488 1.575 7.928z'
    )
  );
  return svg;
}
