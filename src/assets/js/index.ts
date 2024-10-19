import "./_base"

// nav ul
const $nav = document.querySelector("nav ul")
if (!$nav) {
	throw new Error("Nav element not found")
}

if (localStorage.admin === "true") {
	$nav.innerHTML += /* html */ `<li><a href="/admin" class="current:text-theme underline">Admin</a></li>`
}
