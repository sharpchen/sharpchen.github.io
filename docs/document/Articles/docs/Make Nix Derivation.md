# Make Nix Derivation

Making a nix derivation typically includes following steps.

1. **Choose a derivation function**: `pkgs` has some wrapper functions of `mkDerivation` for different frameworks. See:[Languages and Frameworks](https://nixos.org/manual/nixpkgs/stable/#chap-language-support)  
  - `mkDerivation` is a wrapper of `derivation` function.
2. **Find a source**: where the source code come from? github repo or tarball or any other available from url.
  - If the source is precompiled, should set a appropriate value for `meta.sourceProvenance`. See: [Source provenance](https://ryantm.github.io/nixpkgs/stdenv/meta/#sec-meta-sourceProvenance) 
3. **Choose a fetcher**: use a appropriate fetcher to download the source. See [Fetchers](https://nixos.org/manual/nixpkgs/unstable/#chap-pkgs-fetchers) 
4. **Generate lock file**: if you'd build from source, this might require a lock file so nix can download dependencies during build.
  - If the source is precompiled, this is probably not necessary.
  - Lock file is typically required when using a wrapper function of `mkDerivation` for certain framework.
5. 
