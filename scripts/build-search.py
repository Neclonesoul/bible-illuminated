from pathlib import Path
import json

ROOT = Path("data")

for edition in ("kjv", "kjv1611"):
    edition_dir = ROOT / edition
    index_path = edition_dir / "index.json"

    books = json.loads(index_path.read_text(encoding="utf-8"))

    records = []

    for book in books:
        path = edition_dir / f'{book["slug"]}.json'
        payload = json.loads(path.read_text(encoding="utf-8"))

        for chapter, verses in payload["chapters"].items():
            for verse in verses:
                records.append([
                    payload["book"],
                    int(chapter),
                    int(verse["v"]),
                    verse["t"],
                ])

    output = edition_dir / "search.json"

    output.write_text(
        json.dumps(
            records,
            ensure_ascii=False,
            separators=(",", ":"),
        ),
        encoding="utf-8",
    )

    print(
        f"{edition}: "
        f"{len(records):,} searchable verse records → {output}"
    )
