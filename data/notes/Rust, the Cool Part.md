---
first_publication_date: 2023-04-07
last_publication_date: 2023-04-07
---

In [the (free!) tutorial](https://learning-rust.github.io) I'm following to [[notes/Learning Rust|Learn Rust]], they call this part *"the Tough Part"*. It's for sure not easy, but it's also kinda cool(?) So what is this *"Cool Part"*? It's the notion of *ownership*, *borrowing*, and *lifetime* of data!

*Ownership* and *borrowing* are somewhat straightforward in my opinion.

*Ownership* refers to which variable owns the data it refers to, only one can. If a variable tries to refer to another's data, then the ownership is either copied (for primitives) or moved (for non-primitives) from the former variable.
```rust
let a = [1, 2, 3];
let b = a; // ownership is copied

let c = vec![1, 2, 3];
let d = c; // ownership is moved, `c` cannot be accessed anymore
```

Instead, if we just want to reference another variable's data, we can borrow it from its owner.
```rust
let a = vec![1, 2, 3];
let b = &a; // `a` value is borrowed, `a` can still accessed 
let c = &a; // `a` and `b` can still be accessed
```

Alright, makes sense so far. A bit more subtle, if we need to borrow a variable's data with plans to change it, we need to borrow it as a mutable. In such cases, only one variable can do it at a time.
```rust
let a = vec![1, 2, 3];
let b = &mut a; // `a` value is borrowed as a mutable
b[0] = 4;       // `b` value can be edited, reflects on `a`

let c = &mut a; // will throw, `a` is still being borrowed by `b`
```

OK, so that's for the part that was somewhat straightforward. Let's now talk about *lifetime*.

*Lifetime* refers to how much time a referenced data should remain accessible. It looks like the following.
```rust
fn foo<'a>(x: &'a str) -> &'a str {}
```

In the above, the `'a` notation says that the returned value of `foo` should share the same lifetime as the one of its argument `x`.

Fortunately, we don't have to add those notations every time: the compiler can do it for us most of the time on functions. However, for other patterns, like [[notes/Impls and Traits With Rust]], we have to do it ourselves when referencing other variables.

I have to admit, beyond that small example above, usage of *lifetime* annotations still confuses me a lot. It's indeed *the Tough Part*, but also *the Cool Part* of Rust, as this is part of what's allowing the language's memory safety.
