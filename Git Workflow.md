# Git Workflow (Beginner-Friendly, Merge-Based)

**Step 1:** Make sure your local `main` is up-to-date.

```bash
git checkout main
git pull origin main
````

---

**Step 2:** Switch to your feature branch.

```bash
git checkout <your-feature-branch>
```

---

**Step 3:** Merge the latest `main` branch into your feature branch.

```bash
git merge main
```

---

**Step 4:** If there are conflicts:

* Open the conflicted files and manually resolve them.
* Add the resolved files to the staging area.

```bash
git add .
```

* Commit the merge (Git will prepare a commit message for you).

```bash
git commit
```

---

**Step 5:** If there are no conflicts:

* Git will automatically create a merge commit.
* You can skip the `git add` and `git commit` steps.

---

**Step 6:** Push your updated branch to the remote.

```bash
git push
```

---

**Step 7:** Create a Pull Request (PR) from your feature branch into `main`.


