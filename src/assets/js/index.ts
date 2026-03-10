import backgroundGLSL from "../glsl/dot.glsl"
import "shader-doodle"

import "./_base"

// nav ul
const $nav = document.querySelector("nav ul")
if (!$nav) {
	throw new Error("Nav element not found")
}

if (localStorage.admin === "true") {
	$nav.innerHTML += /* html */ `<li><a href="/admin" class="current:text-theme underline">Admin</a></li>`
}

// ask for webcam permission
const $shader = document.createElement("shader-doodle")

const $sdTexture = document.createElement("sd-texture")
$sdTexture.setAttribute("src", "https://images.prismic.io/lihbr/aBbmXfIqRLdaB2Y0_250509-japan-0042.jpg?auto=format&h=600")
$sdTexture.setAttribute("name", "u_texture")
// $shader.appendChild($sdTexture)

const $sdVideo = document.createElement("sd-texture")
$sdVideo.setAttribute("src", "/dunkerque_min.mp4")
$sdVideo.setAttribute("name", "u_texture")
$shader.appendChild($sdVideo)

const $sdCamera = document.createElement("sd-texture")
$sdCamera.setAttribute("webcam", "")
$sdCamera.setAttribute("name", "u_texture")
// $shader.appendChild($sdCamera)

const $script = document.createElement("script")
$script.type = "x-shader/x-fragment"
$script.textContent = backgroundGLSL
$shader.appendChild($script)

$shader.classList.add("w-full", "h-screen")
document.body.prepend($shader)
