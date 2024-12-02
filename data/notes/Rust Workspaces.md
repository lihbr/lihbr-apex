---
first_publication_date: 2023-04-28
last_publication_date: 2023-04-28
---

Since I started [[notes/Learning Rust]], I've been quite amazed by the amount of built-in, standardized, coding tools it is provided with, from a package manager, to build tools, style guides, and more!

I'm not sure yet if this comes as a result of great design and thoughtful architecture, or as a sign of a small community and/or a young language, probably a bit of both. *Maybe* one day people will start creating their own Rust build tools, runtime, and compiler like [pnpm](https://pnpm.io) is today an alternative to npm, and [Deno](https://deno.com) an alternative to Node.js. In the meantime, I quite enjoy the standardization.

Anyway. Today I've learned about Rust built-in workspace support. Similarly to [npm's workspaces](https://docs.npmjs.com/cli/v7/using-npm/workspaces), they allow you to develop multiple packages within the same codebase, i.e. developing within a monorepo.

To leverage them, we just need to create a directory featuring a root `Cargo.toml` declaring our workspace.
```toml [Cargo.toml]
[workspace]
members = [
  "src",
  "examples/hello-world"
]
```

From here we can just create those crates using `cargo`
```bash
cargo new src --lib
cargo new examples/hello-world
```

And here we go! Now running `cargo build` or other commands will execute them across all crates declared within the workspace.
