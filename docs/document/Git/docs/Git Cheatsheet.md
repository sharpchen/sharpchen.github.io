# Git cheat sheet

## History

## Branching

### Branch manipulation

|usage|command|
|---|---|
|create new branch|`git branch <branch>`|
|list all branches|`git branch`|
|list all remote branches|`git branch -r\|--remotes`|
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
|merge branch to current branch|`git merge <branch>`|
|merge branch with fast-forward disabled|`git merge --no-ff <branch>`|
|disable fast-forward|`git config [--global] ff no`|
|list merged branches|`git branch --merged`|
|list branches not merged yet|`git branch --no-merged`|
|abort current conflicted merge|`git merge --abort`|
|undo merge if history not shared|`git reset --hard <commit>`|
|undo merge if history shared|`git revert -m <parent-number> HEAD`|
|merger branch as squashed to current branch|`git merge --squash <branch>`|

### Rebasing

:::warning
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

|usage|command|
|---|---|
|synchronizing remote commits|`git fetch [origin] [<branch>]`|
|merging remote in local|`git merge origin/<branch>`|
|sync remote commits and three-way merging in local|`git pull`|
|sync remote commits and rebasing in local|`git pull --rebase`|
|pushing commits to remote branch|`git push [origin] [<branch>]`|
|set credential helper|`git config [--global] credential.helper <credential_manager>`|
|push with tag|`git push origin <tag>`|
|delete remote tag|`git push origin -d\|--delete <tag>`|
|publish local branch to remote|`git push -u\|--upstream <upstream_branch> <branch>`|
|delete remote branch|`git push origin -d\|--delete <branch>`|
|track remote branch for local|`git switch -C <new_branch> origin/<remote_branch>`|
|remove tracked branch already deleted from remote|`git remote prune origin`|
|change message of last commit|`git commit --amend -m <message>`|
|add files to last commit(when not pushed yet)|`git add <files> && git commit --amend --no-edit`|
|undo last commit|`git revert <commit>`|
|rename current branch|`git branch -M <name>`|

## Repository inspecting

|usage|command|
|---|---|
|get tracked file count|`git ls-files \| wc -l`|
