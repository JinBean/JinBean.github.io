# JinBean.github.io

Tan Wei Jin's static portfolio and personal blog. The public site is plain HTML, CSS and JavaScript; Blog and Professional articles are authored in Markdown and generated with Node.js.

## Quick start

Install the site tools once:

```powershell
npm install
```

Start the local preview:

```powershell
npm run dev
```

Open `http://localhost:4173/`. The preview rebuilds article content and reloads the browser after a saved change. Use `npm run dev -- --port 4174` if port 4173 is occupied.

## Repository layout

```text
_content/
  blog/
    articles/          Blog Markdown files
    templates/         Blog page templates
    article-template.md
    generated.json     Generated-file manifest
  work/
    articles/          Professional Markdown files
    templates/         Professional page templates
    article-template.md
    generated.json     Generated-file manifest
assets/
  css/                 Shared and page-specific styles
  js/                  Shared behaviour and footer component
  webfonts/            Font Awesome files
blog/                  Generated Blog pages
images/                Site and article images
scripts/               Build, preview, creation and test tools
work/                  Generated clean-URL Professional pages
index.html              Homepage
work.html               Generated Professional listing
```

Files in `_content` are the authoring sources. Do not edit generated Blog pages, `work.html`, or generated Professional detail pages directly because the next build replaces them.

## Create a Blog article

Run:

```powershell
npm run new:article -- "My article title" "Developer"
```

The command accepts only the article title and an optional category. The second argument accepts `Developer`, `Alumni` or `Art Manager`; it defaults to `Developer` and is case-sensitive. The publication date is filled in automatically using today's date in Singapore and is not a command argument.

The command creates `_content/blog/articles/my-article-title.md` as an unpublished draft. A complete starting example is available at `_content/blog/article-template.md`.

The generated file contains the following front matter:

| Setting | How it is set | Description |
| --- | --- | --- |
| `title` | First command argument | Full article title. |
| `date` | Added automatically | Today's date in `YYYY-MM-DD` format; also controls listing order. Edit it later if needed. |
| `category` | Optional second argument | `Developer`, `Alumni` or `Art Manager`. |
| `excerpt` | Edit in the draft | Summary shown on article cards. The first paragraph is used when omitted. |
| `published` | Starts as `false` | Change it to `true` when the article is ready. |
| `card_title` | Optional | Shorter title used only on listing cards. |
| `subtitle` | Optional | Introduction beneath the article title. |
| `display_date` | Optional | Custom visible date; `date` still controls sorting. |
| `permalink` | Optional | Custom output path. The generated default is suitable for most articles. |

## Create a Professional article

Run:

```powershell
npm run new:work -- "My project title" "Software development" "project"
```

The category and section arguments are optional. Sections are:

| Section | Location | Presentation |
| --- | --- | --- |
| `featured` | Top of the Professional page | Highlighted row with an image or blank placeholder. |
| `experience` | Experiences | Compact experience card. |
| `project` | More Projects | Compact project card. |

The command creates `_content/work/articles/my-project-title.md`, assigns the next order number in that section and starts it as an unpublished draft. A complete starting example is available at `_content/work/article-template.md`.

Professional front matter supports:

| Setting | Required | Description |
| --- | --- | --- |
| `title` | Yes | Title shown on the card. |
| `category` | Yes | Short category tag. |
| `section` | Yes | `featured`, `experience` or `project`. |
| `order` | Yes | Positive whole number; lower numbers appear first in the section. |
| `excerpt` | Recommended | Summary shown on the card. |
| `published` | No | New entries use `false`; change it to `true` when ready. |
| `page_title` | No | Different title for the detail page. |
| `subtitle` | No | Introduction beneath the detail-page title. |
| `secondary_excerpt` | No | Optional second paragraph on the card. |
| `image` | Featured only | Root-relative path such as `/images/my-project.jpg`. Missing images use a blank square. |
| `image_alt` | With an image | Brief image description. |
| `page` | No | Set to `false` for a listing-only entry. |
| `permalink` | No | Custom output path, mainly for preserving an existing address. |

### Add related links

A final `<section class="features">` block in a Professional article becomes the related-links sidebar. Each link opens in a new tab. Use one `<article>` per resource:

```html
<section class="features">
<article>
<h2 class="major">Project repository</h2>
<p>Source files and implementation notes.</p>
<a href="https://example.com" class="special">Learn more</a>
</article>
</section>
```

## Write article content

Everything after the closing `---` in an article file is Markdown:

```markdown
Write your introduction here.

## What I did

Describe the work, your role and the result.

- Lists work normally
- So do **bold text** and [links](https://example.com)

![Description of the image](/images/my-image.jpg)
```

Place images in `images` and use root-relative `/images/...` paths.

## Build and check

Generate all article pages without starting the preview:

```powershell
npm run build
```

Run the content-system checks:

```powershell
npm test
```

## Shared site components

- Edit `assets/css/site.css` for shared presentation.
- Edit `assets/css/home.css` for homepage-only presentation.
- Edit `assets/js/site-footer.js` for footer copy and contact links.
- Edit `scripts/card-link.mjs` to change the shared Blog and Professional card action.
- Edit `_content/blog/templates` or `_content/work/templates` for generated page structure.

The footer is rendered from one shared JavaScript component while preserving the `#contact` and `#note` anchors.
