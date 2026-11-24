/**
 * The worlds' name labels live in the page (so they're real, focusable buttons) but move with the
 * 3D scene. The page registers each label here; the scene positions them every frame.
 */
export const labelElements = new Map<string, HTMLElement>();
