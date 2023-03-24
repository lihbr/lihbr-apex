---
first_publication_date: 2023-03-17
last_publication_date: 2023-03-24
---


First session of [[notes/Learning Rust]], and you gotta start with the basics, right?

So let's discuss variables in Rust, some interesting things I've learned along the way, and some cursed ones (as someone who's mainly working with JavaScript/TypeScript these days)

First, you can declare variables, nothing too crazy so far.
```rust
let x = 4;      // type is inferred
let y: i32 = 8; // explicit type
```

However, you **cannot** reassign a variable, unless it's declared as a `mut` (mutable), I guess this makes sense from a memory optimization point of view.
```rust
let x = 4;
x = 9; // wrong!

let mut y = 8;
y = 9; // now Rust is happy
```

On the other hand, it's perfectly fine to **redeclare** a variable, even within the same scope.
```rust
let x = 4;
let x = 9; // perfectly fine!
```

And while you're redeclaring variables, why not also **change** their types? No biggy.
```rust
let y: i32 = 8;
let y: &str = "Hello World";
```

A last one to go, you're able to *"assign result of control flow structures (if, else, etc.)"* to a variable.
```rust
let team_size = 7;
let team_size = if team_size < 5 {
    "Small"
} else if team_size < 10 {
    "Medium"
} else {
    "Large"
};
```

In the above, the value of `team_size` is now `"Medium"`, we also redeclared it and reassigned it with another type because life is too short to not do things like that.

So... variables in Rust are... interesting, a bit confusing for now, but I'll guess it'll start making sense at some point~
