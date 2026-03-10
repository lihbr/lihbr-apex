#include "/node_modules/lygia/generative/random.glsl"
#include "/node_modules/lygia/generative/srandom.glsl"
#include "/node_modules/lygia/generative/snoise.glsl"

uniform sampler2D u_image;
uniform vec2 u_image_resolution;

vec2 coverScreen(vec2 fragCoord, vec2 resolution, float aspect) {
	vec2 uv = 0.5 * (2.0 * fragCoord - resolution);
	if (resolution.x / resolution.y > aspect) {
		uv = 0.5 - uv / vec2(resolution.x, -resolution.x / aspect);
	} else {
		uv = 0.5 - uv / vec2(resolution.y * aspect, -resolution.y);
	}
	return uv;
}

void main() {
	vec2 uv = gl_FragCoord.xy;
	vec2 st = uv/u_resolution.xy;
	vec2 st_b = floor(uv/4.0)*4.0/u_resolution.xy;

	float grain_a = random(st);
	float grain_b = random(st_b);
	float noise_a = snoise(st * 2.0) * 0.5 + 0.5;
	float noise_b = snoise(st * 50.0) * 0.5 + 0.5;

	float a = smoothstep(0.6, 1.0, noise_b * grain_b) * noise_a;

	// a = noise_a;

	vec3 img = texture2D(u_image, coverScreen(uv, u_resolution, u_image_resolution.x / u_image_resolution.y)).rgb;

	a += grain_a;
	a = a * 0.25 + 0.75;

	vec3 rgb = mix(vec3(1.0), img, a);

	gl_FragColor = vec4(rgb, 1.0);
}
