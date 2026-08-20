# Bible Illuminated Testing

## Automated Checks

```bash
for file in assets/js/*.js; do
  node --check "$file" || exit 1
done

git diff --check
git status
```

Representative production references:

- Genesis 1:1
- Genesis 36:1
- Psalm 23:1
- John 3:16
- Revelation 22:21

Core production assets should include the application JavaScript, CSS, PWA manifest and service worker.

## Browser Acceptance

Before a stable release confirm:

1. Direct references open the requested book/chapter.
2. Previous/next navigation works.
3. Edition switching works.
4. Search opens results correctly.
5. Comparison view does not clip.
6. Typography controls work.
7. Bookmarks survive refresh.
8. Share links reopen the correct reference.
9. Mobile portrait has no unintended horizontal scrolling.
10. Offline behaviour works where expected.

UI changes must also be tested against reader navigation and deep links. Reader logic and visual changes should preferably be committed separately.
