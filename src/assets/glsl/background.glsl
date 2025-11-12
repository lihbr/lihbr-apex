const float OUTER_SIZE = 1.0 / 2.0;
const vec3 FLAMINGO_400 = vec3(0.91, 0.26, 0.07);
const float ASCII_RESOLUTION = 16.0;

const float ICON_INNER_RATIO = 1.0 / 3.0;

uniform sampler2D u_image;
uniform vec2 u_image_resolution;
uniform sampler2D u_camera;
uniform vec2 u_camera_resolution;

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

// Returns the bit (0 or 1) at position idx (0 = LSB) from integer n without using bitwise operators.
// Uses base-2 division: floor(mod(n / 2^idx, 2)).
float bitAt(int n, int idx) {
	float nf = float(n);
	float power = pow(2.0, float(idx));
	return floor(mod(nf / power, 2.0));
}

float character(int n, vec2 p) {
	p = floor(p * vec2(-4.0, 4.0) + 2.5);
	if(clamp(p.x, 0.0, 4.0) == p.x) {
		if(clamp(p.y, 0.0, 4.0) == p.y) {
			int a = round(p.x) + 5 * round(p.y);
			if(bitAt(n, a) > 0.5) return 1.0;
		}
	}
	return 0.0;
}

vec4 asciify(vec2 uv, vec3 col) {
	float gray = toGray(col);

	int n = 31744;                // -
	if (gray > 0.2) n = 4329604;  // |
	if (gray > 0.3) n = 10824019; // ru
	if (gray > 0.4) n = 9086044;  // shi
	if (gray > 0.5) n = 469440;   // icon
	if (gray > 0.6) n = 338225;   // ha
	if (gray > 0.7) n = 5317313;  // be
	if (gray > 0.8) n = 14694476; // ra

	vec2 p = mod(uv/ASCII_RESOLUTION, 2.0) - vec2(1.0);

	float is_character = character(n, p);
	// return vec4(is_character);
	return vec4(col*is_character, is_character);
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

void main() {
	vec2 st = gl_FragCoord.xy/u_resolution.xy;

	vec2 uv = gl_FragCoord.xy;
	vec3 col = texture2D(
		u_camera,
		coverScreen(
			floor(uv / (ASCII_RESOLUTION * 2.0)) * ASCII_RESOLUTION * 2.0,
			u_resolution,
			u_camera_resolution.x / u_camera_resolution.y
		)
	).rgb;
	vec3 img = texture2D(u_camera, coverScreen(uv, u_resolution, u_camera_resolution.x / u_camera_resolution.y)).rgb;

	// ASCII image
	// col = texture2D(
	// 	u_image,
	// 	coverScreen(
	// 		floor(uv / (ASCII_RESOLUTION * 2.0)) * ASCII_RESOLUTION * 2.0,
	// 		u_resolution,
	// 		u_image_resolution.x / u_image_resolution.y
	// 	)
	// ).rgb;
	// img = texture2D(u_image, coverScreen(uv, u_resolution, u_image_resolution.x / u_image_resolution.y)).rgb;

	// Square
	vec2 center = gl_FragCoord.xy - u_resolution * 0.5;
	float u_min_resolution = min(u_resolution.x, u_resolution.y);
	float icon = iconMask(center, 0.5 * OUTER_SIZE * u_min_resolution);

	col = mix(vec3(1.0 - toGray(col)), FLAMINGO_400, icon * 0.8);
	// col = mix(col, FLAMINGO_400, icon * 0.8);

	float wave_position = 1.0 - (u_time - 1.0) * 1.0;
	float fade_in = smoothstep(wave_position - 0.75, wave_position + 0.75, st.y);

	// gl_FragColor = mix(asciify(uv, col) * 0.8, vec4(FLAMINGO_400, 1.0), 0.0) * fade_in;
	// gl_FragColor = asciify(uv, col) * fade_in;
	// gl_FragColor = asciify(uv, col) * (0.4 + icon * 0.5) * fade_in;

	vec4 ascii = asciify(uv, col) * 0.5;
	vec4 solid = vec4(mix(img, FLAMINGO_400, 0.9), 1.0);

	gl_FragColor = mix(ascii, solid, icon) * fade_in;
}
