Froth
------------

Recursively search directories for NPM packages inside git repositories and do a check on

  - Published NPM package version
  - Package.json package version
  - Git repository status
  - Pending commits since last version bump

Usage
-----------

    > npm install -g froth
    > cd ~/src
    > froth

Results
-----------

    info /home/robashton/src/primo/core fully up to date
    info /home/robashton/src/primo/events fully up to date
    info /home/robashton/src/primo/physics fully up to date
    info /home/robashton/src/primo/components/animation fully up to date
    info /home/robashton/src/primo/spritemap fully up to date
    WARN /home/robashton/src/primo/examples-defender not a published package
    WARN /home/robashton/src/primo/counter Last commit is not a verson bump "Metadata"
    WARN /home/robashton/src/primo/examples-centipede not a published package
    WARN /home/robashton/src/primo/canvas Last commit is not a verson bump "Package"
    WARN /home/robashton/src/primo/audio Last commit is not a verson bump "Base64 disabled by default, loading path set for browsers which load automatically"
    WARN /home/robashton/src/primo/primo-utils Git repository is not clean
    WARN /home/robashton/src/primo/timer Git repository is not clean
    WARN /home/robashton/src/primo/components/text Git repository is not clean
    WARN /home/robashton/src/primo/components/boundary Git repository is not clean
    WARN /home/robashton/src/primo/camera Git repository is not clean
    WARN /home/robashton/src/primo/editor not a published package
    WARN /home/robashton/src/primo/lumber Last commit is not a verson bump "Updated readme"
    WARN /home/robashton/src/primo/menu Last commit is not a verson bump "Readme"

Known things
--------------

    - It only checks master
    - It makes the assumption that your workflow is "git commit && npm version <blah> && npm publish"
    - Tons of other assumptions

It fit the way I currently work, if you want more options, send me a pull request
