# Git cheat sheet

## History

## Branching

### Branch manipulation

|usage|command|
|---|---|
|create new branch|`git branch <branch>`|
|list all branches|`git branch`|
|switch to branch|`git checkout\|switch <branch>`|
|create and switch to new branch|`git checkout -b <branch>` or `git switch -C <branch>`|
|rename branch|`git branch -m <old_branch> <new_branch>`|
|delete branch|`git branch -d <branch>`|
|force delete branch|`git branch -D <branch>`|

### Comparing branches

|usage|command|
|---|---|
|show commits in one branch but not in another|`git log <branch_from>..<branch_to> [--oneline]`|
|show diff between two branches|`git diff [--name-only\|--name-status] <branch_from>..<branch_to>`|
|show diff between current branch to target branch|`git diff [--name-only\|--name-status] <target_branch>`|

### Stashing

|usage|command|
|---|---|
|stash tracked files|`git stash push -m "<stash_msg>"`|
|stash all files including untracked|`git stash push [-a\|--all] -m <stash_msg>`|
|list all stashes|`git stash list`|
|show stash changes|`git stash show stash@{<index>}\|<index>`|
|apply stash|`git stash apply stash@{<index>}\|<index>`|
|delete stash|`git stash drop stash@{<index>}\|<index>`|
|delete all stash|`git stash clear`|

### Merging

|usage|command|
|---|---|
|merge branch to current branch|`git merge branch`|
|merge branch with fast-forward disabled|`git merge --no-ff <branch>`|
|disable fast-forward|`git config [--global] ff no`|
|list merged branches|`git branch --merged`|
|list branches not merged yet|`git branch --no-merged`|
|abort current conflicted merge|`git merge --abort`|
|undo merge if history not shared|`git reset --hard <commit>`|
|undo merge if history shared|`git revert -m <parent-number> HEAD`|
|merger branch as squashed to current branch|`git merge --squash <branch>`|

### Rebasing

:::Warning
Rebasing rewrites history, use it only in local.
:::

|usage|command|
|---|---|
|rebase current branch to another|`git rebase <branch>`|
|abort rebasing|`git rebase --abort`|
|continue rebasing if conflicts are resolved|`git rebase --continue`|
|disable rebasing backup|`git config [--global] mergetool.keepBackup false`|

### Cherry-picking

|usage|command|
|---|---|
|pick one commit into current branch|`git cherry-pick <commit_hash>`|

### Picking a file from branch

|usage|command|
|---|---|
|pick file from another branch to current|`git restore --source=<branch> -- <filename>`|

## Collaboration
