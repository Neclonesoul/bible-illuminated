from pathlib import Path
import json

TERMINAL_ROOT = Path.home() / "projects" / "bible-terminal"
SOURCE_DIR = TERMINAL_ROOT / "internal" / "data"
OUTPUT_DIR = Path("data")

OUTPUT_DIR.mkdir(parents=True, exist_ok=True)


def parse_tsv(path: Path):
    books = {}

    with path.open("r", encoding="utf-8") as f:
        for line in f:
            line = line.rstrip("\n")

            if not line:
                continue

            parts = line.split("\t", 4)

            if len(parts) != 5:
                continue

            edition, book, chapter, verse, text = parts

            chapter = int(chapter)
            verse = int(verse)

            books.setdefault(book, {})
            books[book].setdefault(chapter, [])

            books[book][chapter].append({
                "v": verse,
                "t": text,
            })

    return books


def write_edition(name: str, source: Path):
    books = parse_tsv(source)

    index = []

    edition_dir = OUTPUT_DIR / name
    edition_dir.mkdir(parents=True, exist_ok=True)

    for book_number, (book, chapters) in enumerate(books.items(), start=1):
        slug = (
            book.lower()
            .replace(" ", "-")
            .replace("/", "-")
        )

        payload = {
            "book": book,
            "slug": slug,
            "chapters": {
                str(chapter): verses
                for chapter, verses in chapters.items()
            }
        }

        out = edition_dir / f"{slug}.json"

        out.write_text(
            json.dumps(
                payload,
                ensure_ascii=False,
                separators=(",", ":"),
            ),
            encoding="utf-8",
        )

        index.append({
            "id": book_number,
            "book": book,
            "slug": slug,
            "chapters": len(chapters),
        })

    (edition_dir / "index.json").write_text(
        json.dumps(
            index,
            ensure_ascii=False,
            separators=(",", ":"),
        ),
        encoding="utf-8",
    )

    print(f"{name}: {len(index)} books exported")


write_edition(
    "kjv",
    SOURCE_DIR / "kjv.tsv",
)

write_edition(
    "kjv1611",
    SOURCE_DIR / "kjv1611.tsv",
)

print("Bible Illuminated data export complete.")
