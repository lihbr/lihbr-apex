---
first_publication_date: 2023-03-24
last_publication_date: 2023-03-24
---

Last week I went through the basics with [[notes/Rust Variables]], today while [[notes/Learning Rust]] I read about structures (`struct`), implementations (`impl`) and traits `trait`.  They quite made sense to me (I think?), so let's try explaining those with some F1 team examples~

Let's start with structures, basically they allow you to define, among other things, an object (from a JavaScript point of view) properties, **not** its methods!
```rust
struct Team {
	name: String,
	balance_cts: i32,
}

let alpine = Team {
	name: "Alpine".to_string(),
	balance_cts: 100_00,
};
```

So with structures we have properties, but we need methods! That's what implementations are for, defining "an object methods".
```rust
struct Team {
	name: String,
	balance_cts: i32,
}

impl Team {
	// static methods
	fn new(name: &str, balance_cts: i32) -> Team {
		Team {
			name: name.to_string(),
			balance_cts: balance_cts,
		}
	}

	// instance methods
	fn update_balance(&mut self, new_balance_cts: i32) {
		self.balance_cts = new_balance_cts;
	}
}

let mut haas = Team::new("HAAS", 50_00);

haas.update_balance(75_00);
```

Finally, we have traits. They can be seen as interfaces to implement, but they can also provide their own default implementation.
```rust
trait Cheers {
	// with default implementation
	fn cheers(&self) {
		println!("Cheers!");
	}

	// with no default implementation
	fn cheers_from(&self);
}

struct Team {
	name: String,
	balance_cts: i32,
}

impl Cheers for Team {
	fn cheers_from(&self) {
		println!("Cheers from {}!", self.name);
	}
}

let williams = Team {
	name: "Williams".to_string(),
	balance_cts: 20_00,
};

williams.cheers(); // "Cheers!"
williams.cheers_from(); // "Cheers from Williams!"
```

Voilà! I'm sure you can do a lot more with `struct`, `impl`, and `trait`, but those are the basics (I guess?)
