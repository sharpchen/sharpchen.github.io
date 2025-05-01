# Submodule

Submodule can be useful when a project is dependent on another isolated project on build.
Such as a project your team is working on but maintained separately, or third party dependencies that are not available from any package manager.

## Add Submodule

```sh
git submodule add <repository_url> <path_to_submodule>
```

Details of submodules can be inspected from `.gitmodules`

## Clone with Submodule

Fetching submodule on clone:

```sh
git clone <url> --recursive
```

If you forgot to append `--recursive` option when cloning for the first time, you can still remedy using the following command.

```sh
git submodule update --init --recursive
```
