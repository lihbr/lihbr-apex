// Simplified from https://github.com/dubzzz/pure-rand/blob/main/src/generator/xoroshiro128plus.ts

// XoroShiro128+ with a=24, b=16, c=37,
// - https://en.wikipedia.org/wiki/Xoroshiro128%2B
// - http://prng.di.unimi.it/xoroshiro128plus.c
class XoroShiro128Plus {
	constructor(
		private s01: number,
		private s00: number,
		private s11: number,
		private s10: number,
	) {}

	next(): number {
		const out = (this.s00 + this.s10) | 0
		// a = s0[n] ^ s1[n]
		const a0 = this.s10 ^ this.s00
		const a1 = this.s11 ^ this.s01
		const s00 = this.s00
		const s01 = this.s01
		// s0[n+1] = rotl(s0[n], 24) ^ a ^ (a << 16)
		this.s00 = (s00 << 24) ^ (s01 >>> 8) ^ a0 ^ (a0 << 16)
		this.s01 = (s01 << 24) ^ (s00 >>> 8) ^ a1 ^ ((a1 << 16) | (a0 >>> 16))
		// s1[n+1] = rotl(a, 37)
		this.s10 = (a1 << 5) ^ (a0 >>> 27)
		this.s11 = (a0 << 5) ^ (a1 >>> 27)
		return out
	}
}

export function seedrandom(seed: string): () => number {
	let hash = 0
	for (let i = 0; i < seed.length; i++) {
		hash = seed.charCodeAt(i) + ((hash << 5) - hash)
	}

	const rng = new XoroShiro128Plus(-1, ~hash, hash | 0, 0)

	return () => (rng.next() & 16777215) * 5.960464477539063e-8
}
