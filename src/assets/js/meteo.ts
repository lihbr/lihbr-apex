import { applyOnEvent } from "./lib/applyOnEvent"
import { dateToUSDate, dateToUSDay, dateToUSRelativeDays, dateToUSTime, numberToUS } from "./lib/format"
import "./_base"

const $search = document.querySelector<HTMLInputElement>("#search")
if (!$search) {
	throw new Error("Search element not found")
}

const $suggestions = document.querySelector<HTMLDataElement>("#suggestions")
if (!$suggestions) {
	throw new Error("Suggestions element not found")
}

const $forecast = document.querySelector("main")
if (!$forecast) {
	throw new Error("Forecast element not found")
}

let currentLocation: Location | null = null

type RawForecast = {
	ts: number
	hourly_units: {
		temperature_2m: string
	}
	hourly: {
		time: string[]
		temperature_2m: number[]
		precipitation_probability: number[]
	}
	daily_units: {
		temperature_2m_max: string
		temperature_2m_min: string
		wind_speed_10m_max: string
	}
	daily: {
		time: string[]
		temperature_2m_max: number[]
		temperature_2m_min: number[]
		sunrise: string[]
		sunset: string[]
		weather_code: number[]
		wind_speed_10m_max: number[]
	}
}

type Forecast = Pick <RawForecast, "ts" | "hourly_units" | "daily_units"> & {
	ts: number
	temperature: {
		min: number
		max: number
	}
	days: {
		date: string
		sunrise: string
		sunset: string
		maxWindSpeed: number
		wmo: number
		temperature: {
			min: number
			max: number
			hourly: { time: string, value: number }[]
		}
		precipitation: {
			hourly: { time: string, value: number }[]
		}
	}[]
}

class Location {
	lat: number
	lng: number

	city: string
	region: string
	country: string

	timezone: string = Intl.DateTimeFormat().resolvedOptions().timeZone

	#forecast: Forecast | null = null

	constructor(options: {
		lat: number
		lng: number
		city: string
		region: string
		country: string
		timezone?: string
	}) {
		this.lat = options.lat
		this.lng = options.lng
		this.city = options.city
		this.region = options.region
		this.country = options.country
		if (options.timezone) {
			this.timezone = options.timezone
		}
	}

	distanceTo(to: Location): number {
		// https://www.movable-type.co.uk/scripts/latlong.html
		// https://en.wikipedia.org/wiki/Haversine_formula
		const R = 6371e3
		const φ1 = this.lat * Math.PI / 180
		const φ2 = to.lat * Math.PI / 180
		const Δφ = (to.lat - this.lat) * Math.PI / 180
		const Δλ = (to.lng - this.lng) * Math.PI / 180

		const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
			Math.cos(φ1) * Math.cos(φ2) *
			Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
		const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

		return R * c
	}

	toString(): string {
		let suffix = ""
		if (currentLocation) {
			if (this.lat === currentLocation.lat && this.lng === currentLocation.lng) {
				suffix = " (current location)"
			} else if (currentLocation) {
				suffix = ` (${numberToUS(Math.round(this.distanceTo(currentLocation) / 1000))}km away)`
			}
		}

		return `${this.city}, ${this.region}, ${this.country}${suffix}`
	}

	async getForecast(): Promise<Forecast> {
		if (!this.#forecast) {
			const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${this.lat}&longitude=${this.lng}&hourly=temperature_2m,precipitation_probability&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset,weather_code,wind_speed_10m_max&timezone=${this.timezone}`)

			if (!res.ok) {
				throw new Error("Failed to get forecast")
			}

			const rawForecast = await res.json() as RawForecast

			this.#forecast = {
				ts: Date.now(),
				hourly_units: rawForecast.hourly_units,
				daily_units: rawForecast.daily_units,
				temperature: {
					min: Math.min(...rawForecast.daily.temperature_2m_min),
					max: Math.max(...rawForecast.daily.temperature_2m_max),
				},
				days: [],
			}

			for (let i = 0; i < rawForecast.daily.time.length; i++) {
				const date = rawForecast.daily.time[i]
				const sunrise = rawForecast.daily.sunrise[i]
				const sunset = rawForecast.daily.sunset[i]
				const maxWindSpeed = rawForecast.daily.wind_speed_10m_max[i]
				const wmo = rawForecast.daily.weather_code[i]
				const temperature = {
					min: rawForecast.daily.temperature_2m_min[i],
					max: rawForecast.daily.temperature_2m_max[i],
					hourly: rawForecast.hourly.temperature_2m
						.map((temperature, index) => [rawForecast.hourly.time[index], temperature] as const)
						.filter(([time]) => time.startsWith(date))
						.map(([time, value]) => ({ time, value })),
				}
				const precipitation = {
					hourly: rawForecast.hourly.precipitation_probability
						.map((precipitation, index) => [rawForecast.hourly.time[index], precipitation] as const)
						.filter(([time]) => time.startsWith(date))
						.map(([time, value]) => ({ time, value })),
				}

				this.#forecast.days.push({ date, sunrise, sunset, maxWindSpeed, wmo, temperature, precipitation })
			}
		}

		return this.#forecast
	}

	async use(): Promise<void> {
		$forecast!.innerHTML = /* html */ `
			<header class="section space-y-6">
				<h2 class="heading-2" id="forecast">
					<a href="#forecast" title="Permalink to Forecast" class="hocus:after:content-['_#'] hocus:underline">Loading Forecast</a>
				</h2>
			</header>`

		const forecast = await this.getForecast()

		$forecast!.innerHTML = /* html */ `
			<header class="section space-y-6">
				<h2 class="heading-2" id="forecast">
					<a href="#forecast" title="Permalink to Forecast" class="hocus:after:content-['_#'] hocus:underline">
						${this.city}
					</a>
				</h2>
				<p>
					<a href="https://google.com/maps?q=${this.lat},${this.lng}" target="_blank" rel="noreferrer" id="subtitle" class="underline">${this.toString()}</a>
				</p>
				<p>
					Last updated: <time datetime="${new Date(forecast.ts).toISOString()}" class="ff-numeric">
						${dateToUSTime(forecast.ts)}
					</time>
				</p>
			</header>
			${forecast.days.map((day) => {
				return /* html */ `
					<article class="section space-y-6">
						<h3 class="heading-3" id="${day.date}">
							<a href="#${day.date}" title="Permalink to ${dateToUSDate(day.date)}" class="hocus:after:content-['_#'] hocus:underline">
								<time datetime="${day.date}" class="ff-numeric">
									${dateToUSRelativeDays(day.date)}
								</time>
							</a>
						</h3>
						<dl class="dl">
							<div>
								<dt>Weather</dt>
								<dd>${wmoToText(day.wmo)}, ${Math.round(day.temperature.max)}${forecast.daily_units.temperature_2m_max}</dd>
							</div>
							<div>
								<dt>Wind</dt>
								<dd>${Math.round(day.maxWindSpeed)} ${forecast.daily_units.wind_speed_10m_max}</dd>
							</div>
							<div>
								<dt>Sunrise/set</dt>
								<dd>
									<time datetime="${day.sunset}" class="ff-numeric">
										${dateToUSTime(day.sunrise)} / ${dateToUSTime(day.sunset)}
									</time>
								</dd>
							</div>
							<div class="col-span-3">
								<dt>Temperature</dt>
								<dd class="mt-1">
									${lineChart({
										points: day.temperature.hourly,
										min: forecast.temperature.min,
										max: forecast.temperature.max,
										color: "butter",
										getLabel: (point) => `${Math.round(point.value)}${forecast.hourly_units.temperature_2m} ${dateToUSDay(point.time)} ${dateToUSTime(point.time)}`,
									})}
								</dd>
							</div>
							<div class="col-span-3">
								<dt>Precipitation</dt>
								<dd class="mt-1">
									${lineChart({
										points: day.precipitation.hourly,
										min: 0,
										max: 100,
										color: "navy",
										getLabel: (point) => `${point.value}% ${dateToUSDay(point.time)} ${dateToUSTime(point.time)}`,
									})}
								</dd>
							</div>
						</dl>
					</article>`
			}).join("\n")}
		`
	}
}

function wmoToText(wmo: number): string {
	switch (wmo) {
		case 0:
			return "Clear sky"

		case 1:
			return "Mostly cloudy"
		case 2:
		case 3:
			return "Cloudy"

		case 45:
		case 48:
			return "Fog"

		case 51:
			return "Light drizzle"
		case 53:
			return "Drizzle"
		case 55:
			return "Heavy drizzle"

		case 56:
		case 57:
			return "Freezin drizzle"

		case 61:
			return "Light rain"
		case 63:
			return "Rain"
		case 65:
			return "Heavy rain"

		case 66:
		case 67:
			return "Freezing rain"

		case 71:
			return "Light snow"
		case 73:
			return "Snow"
		case 75:
			return "Heavy snow"

		case 77:
			return "Snow grains"

		case 80:
			return "Light showers"
		case 81:
			return "Showers"
		case 82:
			return "Heavy showers"

		case 85:
			return "Snow showers"
		case 86:
			return "Heavy snow showers"

		case 95:
		case 96:
		case 99:
			return "Thunderstorm"

		default:
			return `Unknown (${wmo})`
	}
}

function lineChart(config: {
	points: { time: string, value: number }[]
	min: number
	max: number
	color: string
	getLabel: (point: { time: string, value: number }) => string
}): string {
	const PADDING_TOP = 20
	const PADDING_BOTTOM = 20

	const getY = (value: number) =>
		100 - (value - config.min) / (config.max - config.min) *
		(100 - PADDING_TOP - PADDING_BOTTOM) - PADDING_BOTTOM

	const labels: string[] = []

	// Start with the first point as "M x y"
	let d = `M 0 ${getY(config.points[0].value)}`

	// Add the rest of the points as "L x y"
	for (let i = 1; i < config.points.length; i++) {
		const x = i / (config.points.length - 1) * 500
		const y = getY(config.points[i].value)
		d += ` L ${x} ${y}`

		if (i % 3 === 2 && i !== config.points.length - 1) {
			labels.push(
				/* html */ `
				<span class="absolute -translate-x-1/2 text-xs leading-none" style="left: ${x / 5}%; bottom: calc(${100 - y}% + 0.125rem);" aria-label="${config.getLabel(config.points[i])}">
					${Math.round(config.points[i].value)}
				</span>`,
				/* html */ `
				<span class="absolute -translate-x-1/2 text-xs leading-none" style="left: ${x / 5}%; bottom: 0.125rem;" aria-hidden="true">
					${dateToUSTime(config.points[i].time)}
				</span>`,
			)
		}
	}

	return /* html */ `
		<figure class="relative">
			<svg
				width="100%"
				height="100%"
				viewbox="0 0 500 100"
				preserveAspectRatio="none"
				xmlns="http://www.w3.org/2000/svg"
				class="border border-current"
			>
				<path d="${d} L 510 110 L -10 110" class="${config.color} fill-theme-o-20 stroke-theme" style="vector-effect: non-scaling-stroke;" />
			</svg>
			<figcaption>
				${labels.join("\n")}
			</figcaption>
		</figure>
	`
}

async function getCurrentLocation(): Promise<Location> {
	if (!currentLocation) {
		const coords = await new Promise<GeolocationCoordinates>((resolve, reject) => {
			navigator.geolocation.getCurrentPosition((position) => resolve(position.coords), reject)
		})

		const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${coords.latitude}&lon=${coords.longitude}&format=json`)

		if (!res.ok) {
			throw new Error("Failed to get current location")
		}

		const data = await res.json()

		currentLocation = new Location({
			lat: coords.latitude,
			lng: coords.longitude,
			city: data.address.city,
			region: data.address.state || data.address.postcode,
			country: data.address.country,
		})
	}

	return currentLocation
}

async function useCurrentLocation() {
	const location = await getCurrentLocation()

	location.use()
}

let currentCitySearchAC: AbortController | null = null
let suggestedLocations: Record<string, Location> = {}
async function suggestLocations(event: Event) {
	if (!event.target || !("value" in event.target) || typeof event.target.value !== "string") {
		return
	}

	if (event.target.value in suggestedLocations) {
		return
	}

	if (currentCitySearchAC) {
		currentCitySearchAC.abort()
	}

	currentCitySearchAC = new AbortController()

	let res: Response
	try {
		res = await fetch(
			`https://geocoding-api.open-meteo.com/v1/search?name=${event.target.value}&count=6&language=en&format=json`,
			{ signal: currentCitySearchAC.signal },
		)
	} catch (error) {
		if (error instanceof Error && error.name === "AbortError") {
			return
		}

		throw error
	}

	if (!res.ok) {
		throw new Error("Failed to search city")
	}

	const data = await res.json()

	if (!Array.isArray(data.results)) {
		return
	}

	suggestedLocations = {}
	$suggestions!.innerHTML = data.results.map(
		(result: { name: string, admin1: string, country: string, latitude: number, longitude: number, timezone: string }) => {
			const location = new Location({
				lat: result.latitude,
				lng: result.longitude,
				city: result.name,
				region: result.admin1,
				country: result.country,
				timezone: result.timezone,
			})

			const keyValue = location.toString()
			suggestedLocations[keyValue] = location

			return /* html */ `<option value="${keyValue}" />`
		},
	).join("\n")
}

function pickLocation(event: Event) {
	if (!event.target || !("value" in event.target) || typeof event.target.value !== "string") {
		return
	}

	const location = suggestedLocations[event.target.value]
	if (!location) {
		return
	}

	event.target.value = ""
	if ("blur" in event.target && typeof event.target.blur === "function") {
		event.target.blur()
	}

	location.use()
}

applyOnEvent("input", "suggest-locations", suggestLocations)
applyOnEvent("change", "pick-location", pickLocation)
applyOnEvent("submit", "prevent-default", (event) => event.preventDefault())
applyOnEvent("click", "use-current-location", useCurrentLocation)

useCurrentLocation()
