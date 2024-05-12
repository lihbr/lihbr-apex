---
first_publication_date: 2023-04-14
last_publication_date: 2023-04-14
---

I've spent some time over the last few weeks [[notes/Learning Rust]]. As always, when you pick up a language *- last time for me it was TypeScript -* you need to get back to the basics: how variables are declared, what a `for` loop looks like, yadda, yadda.

Rust had its dose of fun things during that process. [[notes/Impls and Traits With Rust]] are really cool, so is memory management with [[notes/Rust, the Cool Part|Ownership and Borrowing]].

However, things get really exciting for me when we start to learn about *"How people are actually developing with the language?"*, *"What patterns are they using?"*, etc.

Indeed, learning how to write it only gets you so far, at one point you also need to know how to actually get an application running, architect a library, etc.

This starts with code organization.

Contrary to JavaScript, Rust doesn't have an `import`/`export` system so to say because you don't import files. Instead Rust has "modules", which reminds me vaguely of PHP namespaces (for which I have a *vague* and *distant* memory of) and C includes.
```rust[src/greetings/mod.rs]
// `greetings` module root, `mod.rs` is recognized as such

// `hello` is a public function of the `greetings` module
pub fn hello() {
  println!("Hello, world!");
}
```

You cannot *import* modules, instead you have to *reference* them, which you can if they are exposed to the file you're working on.
```rust[src/main.rs]
mod greetings; // reference of the `greetings` module

fn main() {
  greetings::hello(); // usage of module's public function `hello`
}
```

I find it quite interesting because module resolution is file system-based (when ignoring crate modules), so it kind of forces you adopt a given file structure for your project, making them standardized? I don't know, more coding ahead!
