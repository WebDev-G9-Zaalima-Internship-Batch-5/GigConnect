# Git Workflow

**Step 1:** First, make sure you are on your feature branch.

`git checkout <your-feature-branch>`

**Step 2:** Fetch the latest changes from the remote repository.

`git fetch`

**Step 3:** Merge the remote main branch into your current feature branch.

`git merge origin/main`

**Step 4:** If there are conflicts:

- Open the conflicted files and manually resolve them.

- Add the resolved files to the staging area.

  `git add .`

- Now, commit the merge. Git will prepare a commit message for you.

  `git commit`

**Step 5:** If there are no conflicts:

- Git will automatically create a merge commit.

- You can skip the git add and git commit steps.

**Step 6:** Push your updated branch to the remote.

    -`git push`
