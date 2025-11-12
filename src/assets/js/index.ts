import backgroundGLSL from "../glsl/background.glsl"
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
$sdTexture.setAttribute("name", "u_image")
$shader.appendChild($sdTexture)

const $sdCamera = document.createElement("sd-texture")
$sdCamera.setAttribute("webcam", "")
$sdCamera.setAttribute("name", "u_camera")
$shader.appendChild($sdCamera)

const $script = document.createElement("script")
$script.type = "x-shader/x-fragment"
$script.textContent = backgroundGLSL
$shader.appendChild($script)

$shader.classList.add("w-full", "h-screen")
document.body.prepend($shader)
