"""Cache-busting: add ?v=<content hash> to every local css/js/asset link in the HTML pages.

Run before committing whenever CSS, JS or images change:
    python tools/stamp_versions.py
Browsers may cache files for 10 minutes on GitHub Pages; a changed hash forces them to
fetch the new file, so a visitor never gets new HTML with old CSS/JS.
"""
import hashlib, pathlib, re, sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
PAGES = ["index.html", "404.html"]
# Fonts are excluded: css/fonts.css loads them unversioned, and the preload URL must match exactly.
LINK = re.compile(r'((?:href|src)=")((?:css|js|assets)/(?!fonts/)[^"?#]+)(\?v=[0-9a-f]*)?(")')

def file_hash(rel: str) -> str:
    path = ROOT / rel
    if not path.is_file():
        sys.exit(f"missing file referenced in HTML: {rel}")
    return hashlib.sha256(path.read_bytes()).hexdigest()[:10]

changed = 0
for page in PAGES:
    p = ROOT / page
    text = p.read_text(encoding="utf-8")
    new = LINK.sub(lambda m: f"{m.group(1)}{m.group(2)}?v={file_hash(m.group(2))}{m.group(4)}", text)
    if new != text:
        p.write_text(new, encoding="utf-8", newline="\n")
        changed += 1
    print(f"{page}: {len(LINK.findall(new))} links stamped")
print("updated" if changed else "already up to date")
