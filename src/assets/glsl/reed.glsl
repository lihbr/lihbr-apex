#include "/node_modules/lygia/generative/random.glsl"
#include "/node_modules/lygia/generative/snoise.glsl"

const vec3 FLAMINGO_400 = vec3(0.91, 0.26, 0.07);
const float OUTER_SIZE = 1.0 / 2.0;
const float ICON_INNER_RATIO = 1.0 / 3.0;

const float REED_COUNT = 2.0;
const float REED_DISTORTION = 24.0;
const float REED_DEPTH = 0.15;
const float REED_ANIMATION = -0.4;

uniform sampler2D u_texture;
uniform vec2 u_texture_resolution;

float iconMask(vec2 center, float size) {
	float outer_mask = step(abs(center.x), size) * step(abs(center.y), size);
	float inner_mask = step(abs(center.x), size * ICON_INNER_RATIO) * step(abs(center.y), size * ICON_INNER_RATIO);
	return outer_mask * (1.0 - inner_mask);
}

int round(float x) {
	return int(floor(x + 0.5));
}

float toGray(vec3 col) {
	return 0.3 * col.r + 0.59 * col.g + 0.11 * col.b;
}

vec2 coverScreen(vec2 fragCoord, vec2 resolution, float aspect) {
	vec2 uv = 0.5 * (2.0 * fragCoord - resolution);
	if (resolution.x / resolution.y > aspect) {
		uv = 0.5 - uv / vec2(resolution.x, -resolution.x / aspect);
	} else {
		uv = 0.5 - uv / vec2(resolution.y * aspect, -resolution.y);
	}
	return uv;
}

// Get reed displacement amount at a given x position
float reedDisplacement(vec2 st, vec2 resolution) {
	float count = float(round(resolution.x / 40.0)) * REED_COUNT;
	float reedPhase = st.x * count * 6.28318 + u_time * REED_ANIMATION + u_mouse.x / 1000.0;

	float reed = sin(reedPhase);
	float reed2 = sin(reedPhase * 2.3 + 1.7) * 0.3;
	float displacement = (reed + reed2) * REED_DISTORTION;

	float reedCenter = abs(cos(reedPhase));
	return displacement * reedCenter;
}

// Light modulation from reed curvature (fresnel-like)
float reedLight(vec2 uv, vec2 st, vec2 resolution) {
	float count = float(round(resolution.x / 40.0)) * REED_COUNT;

	float reedPhase = st.x * count * 6.28318 + u_time * REED_ANIMATION + u_mouse.x / 1000.0;

	// Derivative of sine gives us the slope/angle of the glass
	float slope = cos(reedPhase);

	// Add subtle variation
	float slope2 = cos(reedPhase * 2.3 + 1.7) * 0.3;

	// Combine and normalize to 0-1 range with depth control
	return 1.0 + (slope + slope2) * REED_DEPTH;
}

void main() {
	vec2 uv = gl_FragCoord.xy;
	vec2 st = uv/u_resolution.xy;

	// Apply reeded glass distortion to coordinates
	float d_displacement = reedDisplacement(st, u_resolution);
	vec2 d_uv = vec2(uv.x + d_displacement, uv.y + d_displacement * 0.1);
	float d_light = reedLight(uv, st, u_resolution);

	vec3 img = texture2D(u_texture, coverScreen(d_uv, u_resolution, u_texture_resolution.x / u_texture_resolution.y)).rgb;
	img *= d_light;

	// Square (apply reed displacement to distort the icon edges)
	vec2 center = gl_FragCoord.xy - u_resolution * 0.5;
	center.x += d_displacement;
	center.y += d_displacement * 0.1;
	float u_min_resolution = min(u_resolution.x, u_resolution.y);
	float icon = iconMask(center, 0.5 * OUTER_SIZE * u_min_resolution) * (d_light * 0.4 + 0.6);

	// Composition
	vec4 base = mix(vec4(vec3(0.5), smoothstep(0.4, 0.6, toGray(img))), vec4(FLAMINGO_400, 1.0), icon * 0.9);

	// Noise
	float random_noise = random(vec3(st.x * 2.0, st.y * 2.0, floor(mod(u_time, 60.0) * 2.0)));
	float simplex_noise = snoise(vec3(st.x * 4.0, st.y * 1.0, u_time * 0.01));
	float noise = random_noise * 0.5;
	base.a *= noise * 0.4 + 0.6;

	// Fade
	float wave_position = 1.0 - (u_time - 1.0) * 1.0;
	float fade = smoothstep(wave_position - 0.75, wave_position + 0.75, st.y);
	vec4 with_fade = base * fade;

	gl_FragColor = with_fade;
}
