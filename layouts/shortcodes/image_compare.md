# `image_compare` Hugo Shortcode

The `image_compare` shortcode provides an interactive, draggable slider to compare two images side by side in your Hugo site. It is inspired by the ComfyUI Image Compare node and is useful for visualizing before/after or A/B comparisons.

## Features

- Interactive slider to reveal more or less of each image
- Responsive and touch-friendly
- Optional alt text for accessibility
- No external slider UI; simply move your mouse over the image to adjust the split

## Requirements

- **Fabric.js** must be loaded on the page. The shortcode expects `window.fabric` and `window.fabric.FabricImage` to be available globally.

## Parameters

| Name       | Required | Description                                                                 |
|------------|----------|-----------------------------------------------------------------------------|
| `a`        | Yes      | URL or path to the first (left) image                                        |
| `b`        | Yes      | URL or path to the second (right) image                                      |
| `alt`      | No       | Alt text or caption displayed below the comparison (for accessibility)       |
| `unique_id`| No       | Unique identifier for the instance (auto-generated if omitted)               |

## Usage

Place the shortcode in your Markdown content as follows:

```md
{{< image_compare a="/static/by_beksinski/example-a.jpg" b="/static/by_beksinski/example-b.jpg" alt="Comparison of A and B" >}}
```

- Replace the `a` and `b` values with the paths to your images.
- The `alt` parameter is optional but recommended for accessibility.

## Example

```md
{{< image_compare a="/static/by_beksinski/original.jpg" b="/static/by_beksinski/processed.jpg" alt="Original vs. Processed" >}}
```

This will render an interactive comparison of the two images, with a draggable split.

## Notes

- The comparison area will automatically size to the width of the images (max 600px).
- The split starts at 50% by default; move your mouse horizontally over the image to adjust.
- The shortcode does **not** include a visible slider bar for a minimalist look.
- For best results, use images of the same dimensions.
- If you use multiple `image_compare` shortcodes on one page, each will be isolated by a unique ID.

## Styling

The container uses the class `image-compare-container`. You can override or extend its styles in your theme's CSS/SCSS as needed.

## Troubleshooting

- If the comparison does not appear, ensure that Fabric.js is loaded **before** the shortcode script runs.
- Check your browser console for errors related to `window.fabric`.
