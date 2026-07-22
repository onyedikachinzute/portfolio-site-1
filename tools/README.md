# add_project.py

A tool that adds a new project to your portfolio site automatically — no manual file
editing needed. Run it from your portfolio repo whenever you want to add a project.

## Requirements

Just Python 3 (no `pip install` needed — it only uses the standard library).

## Usage

From your portfolio repo root (same folder as `index.html`):

```bash
python tools/add_project.py
```

It will ask you a series of questions:

1. **GitHub repo URL** — it pulls the description, primary language, and topics from
   the GitHub API automatically, and tries to pull feature bullets out of your README.
2. **Title, slug, subtitle, description, tags** — each has a sensible default pulled
   from GitHub; just press Enter to accept, or type your own.
3. **Features** — if it found bullet points in your README, it'll offer to use them
   as-is; otherwise it'll ask you to type a few.
4. **Icon** — pick from a small built-in set (code, database, AI/robot, web, checklist,
   camera/vision).
5. **Featured or not** — whether it should also get a big showcase card in the
   Featured Projects section (All Projects always gets a card either way).

## What it does automatically

- Writes `projects/<slug>.html` — a full case-study page matching the site's style
- Creates `projects/screenshots/<slug>/` so you can drop in `01.jpg` through `04.jpg`
  whenever you have screenshots ready (the gallery picks them up automatically —
  see the main site's screenshot behavior, nothing else to configure)
- Inserts a card into **All Projects**, and into **Featured Projects** if you said yes
- Adds the new page to `sitemap.xml`
- Re-chains the "next project →" links across all detail pages so the loop stays
  connected in the right order
- Updates `project_manifest.json`, which tracks project order for future runs

## After running it

```bash
git add .
git commit -m "Add <project name> project"
git push origin main
```

## Notes

- If the GitHub API is rate-limited or unreachable, the script just falls back to
  asking you for everything manually — it won't crash.
- Screenshots are optional at generation time. Add them to
  `projects/screenshots/<slug>/` whenever you have them; missing files are skipped
  gracefully by the site's JS, same as your existing projects.
- Don't edit `project_manifest.json` by hand unless you know what you're doing — it's
  what the script uses to figure out project order and chain the "next project" links.
