# Git Workflow (Beginner-Friendly, Merge-Based, Safe Updates)

**Step 1:** Save and update your feature branch.

```bash
# Make sure you are on your feature branch
git checkout <your-feature-branch>
```

If you have uncommitted changes, commit or stash them so nothing gets lost.

```bash
# Commit your work-in-progress changes
git add .
git commit -m "WIP: saving progress"

# OR stash them if you don’t want to commit yet
git stash
```

Now update your branch from the remote:

```bash
git pull origin <your-feature-branch>
```

If you used `git stash`, restore your changes:

```bash
git stash pop
```

---

**Step 2:** Update your local `main` branch.

```bash
git checkout main
git pull origin main
```

---

**Step 3:** Merge the latest `main` branch into your feature branch.

```bash
git checkout <your-feature-branch>
git merge main
```

---

**Step 4:** If there are conflicts:

- Open the conflicted files and manually resolve them.
- Add the resolved files to the staging area.

```bash
git add .
```

- Commit the merge (Git will prepare a commit message for you).

```bash
git commit
```

---

**Step 5:** If there are no conflicts:

- Git will automatically create a merge commit.
- You can skip the `git add` and `git commit` steps.

---

**Step 6:** Push your updated branch to the remote.

```bash
git push
```

---

**Step 7:** Create a Pull Request (PR) from your feature branch into `main`.

- Once the PR is approved and merged, you can delete the feature branch both locally and remotely if no longer needed.
