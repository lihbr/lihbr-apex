const ALBUMS_KEY = "lihbr_albums"

type Album = {
	date: string
	title: string
	slug: string
}

function sort(albums: Album[]): Album[] {
	return albums.sort((a, b) => b.date.localeCompare(a.date))
}

export function read(): Album[] {
	const albums = localStorage.getItem(ALBUMS_KEY)
	return albums ? sort(JSON.parse(albums)) : []
}

function write(albums: Album[]): void {
	localStorage.setItem(ALBUMS_KEY, JSON.stringify(albums))
}

export function add(album: Album): void {
	const albums = read()

	write(sort([...albums, album].filter(
		(album, index, self) => self.findIndex((a) => a.slug === album.slug) === index,
	)))
}
