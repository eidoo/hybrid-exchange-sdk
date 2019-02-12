# Release Process

This project is released on an as-needed basis following the procedure indicates below.

### Notable branches

- **dev** development branch.
- **master** production branch, containing the last deployed release.
- **release/vX.X.X** release branch for version X.X.X.

### Release steps

1. Create a new release branch from **dev** named `release/vX.X.X` using `git checkout -b release/vX.X.X`.
2. Make all the pre-release adjustments needed.
3. Update `CHANGELOG.md` including under the new release section all the cards You are bringing in production, moving
them from the *Unreleased* section. How to keep the changelog is described into the related file.

Then you can proceed with the following steps automagically using `yarn release`:

1. Add every change You need to git, including `CHANGELOG.md`.
1. From project root run `yarn version`, providing the version indicated before in changelog for this release.
1. A new commit titled *Released vX.X.X* should have been created by yarn, and tagged with the version provided.
1. Push release branch and release tag i.e. `git push origin release/vX.X.X && git push origin vX.X.X`.
1. Rebase release branch into **master** and **dev** and push them.
