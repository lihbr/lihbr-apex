---
first_publication_date: 2023-06-02
last_publication_date: 2023-06-16
---

I have to admit, I was quite excited getting to that part when I started [[notes/Learning Rust]]. Nothing particular about it, aside that the name is fun, I named: *Rust panicking mechanism*.

![Kalm and Panik meme gif](https://images.prismic.io/lihbr/e65747ca-0b1b-41b6-bdd9-ffd71c90ebc3_panik-kalm.gif?auto=compress,format)

So when do you panic in Rust? Well, just like in real life, you do when something happens and you cannot do anything about it.

Put more precisely, panicking is what you do when you encounter an unrecoverable error in Rust. As it's a thread-based mechanism, I assume it kills it in some way(?) while other threads can carry around their work, handling the panicked thread if needed.
```rust[src/main.rs]
fn main() {
	if (something_bad) {
		panic!();

		// Alternative with a message
		panic!("{:#?}", something_bad)
	}
}
```

There exist some more "precise" types of panic. I've learned about `unimplemented!()`, for unfinished code, and `unreachable!()` for code scenarios that shouldn't be possible (e.g. calculated [GPA](https://en.wikipedia.org/wiki/Academic_grading_in_the_United_States) is above 4)

But that's it for now, `panicking == fatal errors`, and it's the first Rust error handling *- in that case, error not-handling -* API I've read about!