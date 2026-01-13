# Submodule

Submodule can be useful when a project is dependent on another isolated project on build.
Such as a project your team is working on but maintained separately, or third party dependencies that are not available from any package manager.

## Add Submodule

```sh
git submodule add <repository_url> <path_to_submodule>
```

Details of submodules can be inspected from `.gitmodules`

## Remove Submodule

```sh
git rm path/to/submodule
```

This deletes both physical storage of the submodule and its info in `.gitmodules`.
Note that its history would still be reserved in case you wanted to inspect the old commits.
You can manually delete it from `.git/modules/<submodule>` if you want to wipe out completely.
