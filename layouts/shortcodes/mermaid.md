# `mermaid` Hugo Shortcode

The `mermaid` shortcode allows you to embed [Mermaid](https://mermaid-js.github.io/) diagrams directly in your Hugo site using simple Markdown. It supports dynamic theming (light, dark, auto) and only loads the Mermaid.js library once per page.

## Features

- Render flowcharts, sequence diagrams, Gantt charts, and more using Mermaid syntax
- Automatically adapts to your site's theme (light, dark, or auto)
- Only loads Mermaid.js once per page for efficiency
- Optional custom CSS class for additional styling

## Requirements

- No external dependencies required; Mermaid.js is bundled and loaded automatically by the shortcode
- The theme must support dynamic class switching on `<html>` for theme detection (e.g., `theme-dark`, `theme-light`, `theme-auto`)

## Parameters

| Name    | Required | Description                                                      |
|---------|----------|------------------------------------------------------------------|
| `class` | No       | Additional CSS class(es) to add to the `<pre>` container         |

## Usage

Place the shortcode in your Markdown content as follows:

```md
{{< mermaid >}}
graph TD;
  A-->B;
  A-->C;
  B-->D;
  C-->D;
{{< /mermaid >}}
```

- Write your Mermaid diagram definition between the opening and closing shortcode tags.
- Optionally, add a `class` parameter for custom styling:

```md
{{< mermaid class="my-custom-class" >}}
sequenceDiagram
  participant Alice
  participant Bob
  Alice->>Bob: Hello Bob, how are you?
  Bob-->>Alice: I am good thanks!
{{< /mermaid >}}
```

## Example

```md
{{< mermaid >}}
gantt
title A Gantt Diagram
  dateFormat  YYYY-MM-DD
  section Section
  A task           :a1, 2024-04-01, 30d
  Another task     :after a1  , 20d
{{< /mermaid >}}
```

This will render a Gantt chart with two tasks.

## Notes

- The Mermaid.js library is only loaded once per page, even if you use multiple diagrams.
- The diagram theme (light/dark) automatically matches your site's theme and updates if the theme changes.
- Mermaid configuration is loaded from `themes/cringe-theme/assets/mermaid.json`.
- If you use the `theme-auto` class on `<html>`, the diagram will follow the system color scheme.

## Styling

- The container uses the class `mermaid` by default. You can add custom classes via the `class` parameter.
- Style Mermaid diagrams in your theme's CSS/SCSS as needed, targeting `.mermaid` or your custom class.

## Troubleshooting

- If diagrams do not render, check your browser console for JavaScript errors.
- Ensure your theme's `<html>` element uses the correct class for theme switching.
- If you see raw Mermaid code instead of a diagram, make sure the shortcode is used with the correct syntax and that Mermaid.js is loading.
