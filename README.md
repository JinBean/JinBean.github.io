# JinBean.github.io

## Create articles with Markdown

Install the site tools once:

```powershell
npm install
```

All Blog and Professional articles are written as Markdown files. The build commands create the styled HTML pages and update their listings automatically.

### Create a Blog article

Run:

```powershell
npm run new:article -- "My article title" "Developer"
```

Arguments, in order:

| Argument | Required | Options | Purpose |
| --- | --- | --- | --- |
| `title` | Yes | Any title | Used as the article title and to create the filename. Keep the quotation marks when the title contains spaces. |
| `category` | No | `Developer`, `Alumni`, `Art Manager` | Controls which Blog category contains the article. Defaults to `Developer`. Values are case-sensitive. |

Examples:

```powershell
npm run new:article -- "Learning from a side project"
npm run new:article -- "Life after university" "Alumni"
npm run new:article -- "Growing a creative account" "Art Manager"
```

The command creates a file in `_articles`, such as `_articles/learning-from-a-side-project.md`. It refuses to replace a file with the same generated name.

A Blog article supports these settings at the top of its Markdown file:

| Setting | Required | Description |
| --- | --- | --- |
| `title` | Yes | Full title shown on the article page. |
| `date` | Yes | Publication date in `YYYY-MM-DD` format. This also controls listing order. |
| `category` | Yes | One of the three Blog categories listed above. |
| `excerpt` | Recommended | Short summary shown on the article card. When omitted, the first paragraph is used. |
| `published` | No | New articles use `false`. Change it to `true` when the article is ready. |
| `card_title` | No | Shorter title used only on article cards. |
| `subtitle` | No | Short introduction shown beneath the title on the article page. |
| `display_date` | No | Custom display text for the date. The `date` setting still controls sorting. |
| `permalink` | No | Custom output path. Most new articles should use the generated default. |

### Create a Professional article

Run:

Create a Professional entry:

```powershell
npm run new:work -- "My project title" "Software development" "project"
```

Arguments, in order:

| Argument | Required | Options | Purpose |
| --- | --- | --- | --- |
| `title` | Yes | Any title | Used as the article title and to create the filename. |
| `category` | No | Any short label | Tag shown on the Professional card. Defaults to `Software development`. |
| `section` | No | `featured`, `experience`, `project` | Controls where the card appears. Defaults to `project`. Values are case-sensitive. |

The section options are:

| Section | Appears in | Design |
| --- | --- | --- |
| `featured` | Top of the Professional page | Large highlighted row with an optional image. |
| `experience` | Experiences | Compact experience card. |
| `project` | More Projects | Compact project card. |

Examples:

```powershell
npm run new:work -- "My latest role" "Internship" "featured"
npm run new:work -- "Community leadership" "Leadership" "experience"
npm run new:work -- "Accessibility audit" "User experience" "project"
```

The command creates a file in `_work-items`, assigns the next order number for the chosen section and starts it as an unpublished draft.

A Professional article supports these settings:

| Setting | Required | Description |
| --- | --- | --- |
| `title` | Yes | Title shown on its card. |
| `category` | Yes | Short category tag shown above the title. |
| `section` | Yes | `featured`, `experience` or `project`. |
| `order` | Yes | Positive whole number. Lower numbers appear first within their section. |
| `excerpt` | Recommended | Short summary shown on the card. |
| `published` | No | New entries use `false`. Change it to `true` when ready. |
| `page_title` | No | Different title used on the detail page. |
| `subtitle` | No | Introductory line beneath the detail-page title. |
| `secondary_excerpt` | No | Optional second paragraph on the card. |
| `image` | Featured only | Root-relative path such as `/images/my-project.jpg`. |
| `image_alt` | With an image | Brief description of the image. |
| `page` | No | Set to `false` for a listing-only card with no detail page. |
| `permalink` | No | Custom output path. Existing articles use this to preserve their original URLs. |

See `_work/work-template.md` for a complete starting example.

### Write the article

Everything below the second `---` line is the article body:

```markdown
Write your introduction here.

## What I did

Describe the work, your role and the result.

- Lists work normally
- So do **bold text** and [links](https://example.com)

![Description of the image](/images/my-image.jpg)
```

Place article images in the `images` directory and use a root-relative `/images/...` path.

### Publish and preview

When an article is ready, change:

```yaml
published: false
```

to:

```yaml
published: true
```

Start the preview:

```powershell
npm run dev
```

This rebuilds the listings and article pages whenever a Markdown file or template changes. Open `http://localhost:4173/` and refresh after saving. If that port is occupied, use `npm run dev -- --port 4174`.

The preview watches `_articles`, `_work-items` and their templates. Save your Markdown file, then refresh the browser. If port 4173 is occupied, use:

```powershell
npm run dev -- --port 4174
```

Build without starting the preview:

```powershell
npm run build
```

Run the checks after changing the content system:

```powershell
npm test
```

Do not edit generated Blog pages, `work.html`, or generated Professional detail pages directly; the next build replaces them. Edit `_articles`, `_work-items`, `_blog/templates` or `_work/templates` instead.

## Shared footer

Edit `assets/js/site-footer.js` to update the footer copy, contact links or copyright across the site. The shared layout rules are in `assets/css/site.css`.

Each page has one `<footer class="site-footer" id="contact" aria-label="Contact and site information" data-site-footer></footer>` placeholder and loads `site-footer.js` before `site.js`. Use the appropriate relative path for nested pages. The component renders synchronously without a separate network request for HTML, and preserves the `#contact` and `#note` anchors. Footer rendering requires JavaScript.
