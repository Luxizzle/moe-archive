# MOE-ARCHIVE

Tag based file indexer and duplicate finder

## Usage


### update
```sh
$ moe update
```

Updates archive for current folder and writes to `.moe-archive`

Aliases: `u`, `archive`

- `-v, --verbose` verbose output, might be slower
- `-d, --depth` max file depth
- `-p, --pretty` pretty archive output, might be slower

### find-duplicates
```sh
$ moe find-duplicates
```
Aliases: `duplicates`, `fd`

Finds duplicates and outputs results into `.duplicates.yml`

- `-v, --verbose` verbose output, might be slower
- `-d, --depth` max file depth
- `-p, --pretty` pretty archive output, might be slower
- `-s, --skip` skip updating archive

### cleanup
```sh
$ moe cleanup
```

Cleans up duplicates

Aliases: `clean`, `c`

- `-v, --verbose` verbose output, might be slower
- `-d, --depth` max file depth
- `-p, --pretty` pretty archive output, might be slower
- `-s, --skip` skip updating archive and duplicates