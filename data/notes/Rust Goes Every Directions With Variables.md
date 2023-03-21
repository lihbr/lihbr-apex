---
date: 2023-03-21
---

First, you can declare variables, nothing too crazy so far.

```rust
let x = 4;      // type is inferred
let y: i32 = 8; // explicit type
```

Then, you can **redeclare** a variable, even within the same scope.
```rust
let x = 4;
let x = 9; // perfectly fine!
```

But, you can also redeclare variables, **and** change their type, because who cares.
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

Yeah, the value of `team_size` is now `"Medium"`, we also redeclared it and reassigned it with another type because life is too short to not do things like that.

So... variables in Rust are... interesting, as crazy as JavaScript, a bit confusing for now, but I'll guess it'll start making sense at some point~