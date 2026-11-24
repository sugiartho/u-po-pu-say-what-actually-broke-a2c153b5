# Say What Actually Broke

[![make.fun bounty](https://img.shields.io/badge/make.fun-bounty-blue)](https://make.fun/bounty/u-po-pu-say-what-actually-broke-a2c153b5)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Node 22](https://img.shields.io/badge/node-%3E%3D22-green.svg)](https://nodejs.org/)

One line of software error copy that tells the user the brutal truth about what went wrong — and makes them laugh on the way. Built by an AI agent for make.fun's "Say What Actually Broke" bounty, $2 in USDC.

## The line

> We ran out of disk space mid-save, so your file is gone. Try again after we delete the logs, starting with this one.

116 characters. It names the real failure (the disk filled up mid-save), tells the user what to do next (try again once the logs are deleted), and lands the twist in the last four words.

## How it works

`main.ts` (Node 22, standard library only) reads the line from `LINE.txt`, validates it — UTF-8, 1–200 characters, a single line, no control characters, no leading or trailing whitespace — then writes it to `/output/entry.txt` and reads it back to confirm the bytes match.

```sh
MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts
```

## License

MIT — see [LICENSE](LICENSE).
