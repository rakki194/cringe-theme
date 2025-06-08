# `os-instructions` Hugo Shortcode

The `os-instructions` shortcode provides a tabbed interface for displaying platform-specific instructions (Windows, Linux, macOS) in your Hugo documentation. It automatically detects the user's OS (or uses their preference) and shows the relevant instructions by default.

## Features

- **Tabbed UI** for Windows, Linux, and macOS instructions
- **Automatic OS detection** (with user override via tab click)
- **Markdown support** for each OS section
- **Customizable** via CSS variables and theme
- **Graceful fallback** if only one set of instructions is provided

## Usage

Wrap your OS-specific instructions inside the shortcode. You can separate content for each OS using either HTML comments or Markdown headings.

### 1. Using HTML Comments

Surround each OS section with the following comments:

```md
{{< os-instructions "unique-id" >}}
Windows instructions here
<!-- linux -->
Linux instructions here
<!-- mac -->
macOS instructions here
{{< /os-instructions >}}
```

### 2. Using Markdown Headings

Alternatively, use `### Windows`, `### Linux`, and `### macOS` headings:

```md
{{< os-instructions "unique-id" >}}
### Windows
Windows instructions here

### Linux
Linux instructions here

### macOS
macOS instructions here
{{< /os-instructions >}}
```

- The `unique-id` parameter is required and should be unique per usage on a page.
- If only one section is provided, it will be shown for all OSes.

## Example

```md
{{< os-instructions "install-example" >}}
### Windows
1. Download the installer.
2. Run the `.exe` file.

### Linux
1. Download the `.tar.gz` archive.
2. Extract and run `install.sh`.

### macOS
1. Download the `.dmg` file.
2. Open and drag to Applications.
{{< /os-instructions >}}
```

## How It Works

- The shortcode parses the inner content and splits it into sections for each OS.
- Tabs are rendered for each OS. Clicking a tab switches the visible instructions and saves the preference in `localStorage`.
- The user's OS is detected via the browser's user agent on first visit.
- All content is rendered as Markdown.

## Styling & Customization

- The component uses CSS variables for colors and adapts to light/dark themes.
- You can override styles in your theme's CSS if needed.
- OS-specific tab colors are set for each platform.

## Accessibility

- Tabs are keyboard-accessible and labeled by OS.
- Only one set of instructions is visible at a time for clarity.

## Debugging

- In development mode, a debug info box is shown below the component, indicating how the content was parsed.

## Notes

- Place this shortcode in your Markdown content files.
- Do **not** nest `os-instructions` shortcodes.
- The `unique-id` parameter is used for internal tracking and should be unique per instance on a page.

## File Location

- Shortcode template: `themes/cringe-theme/layouts/shortcodes/os-instructions.html`

---

For advanced customization, edit the shortcode template or extend the CSS in your theme.
