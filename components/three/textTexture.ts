import * as THREE from 'three';

/**
 * Text drawn into a canvas and used as a texture, in the page's own fonts (once they've loaded).
 * For short UI labels inside scenes; avoids loading a separate font file for 3D text.
 */
export function textTexture(
  text: string,
  { font = '600 44px "Inter Variable", sans-serif', color = '#161719', width = 1024, height = 128, align = 'left' as CanvasTextAlign } = {},
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  const draw = () => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);
    ctx.font = font;
    ctx.fillStyle = color;
    ctx.textAlign = align;
    ctx.textBaseline = 'middle';
    const x = align === 'center' ? width / 2 : align === 'right' ? width - 8 : 8;
    ctx.fillText(text, x, height / 2);
    texture.needsUpdate = true;
  };
  draw();
  document.fonts?.ready.then(draw);
  return texture;
}
