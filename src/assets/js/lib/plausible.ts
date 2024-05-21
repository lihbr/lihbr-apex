import Plausible from "plausible-tracker"

const isDev = import.meta.env.DEV
const staging = "staging.lihbr.com"

const plausible = Plausible(
	isDev
		? {
				domain: staging,
				trackLocalhost: true,
			}
		: {
				apiHost: "/p7e",
			},
)

type Event<
	TType = string,
	TProps extends Record<string, string | number | boolean> | void = void,
> = TProps extends void
	? { event: TType, props?: Record<string, never> }
	: {
			event: TType
			props: TProps
		}

type PageViewEvent = Event<"pageView">
type PageTime120Event = Event<"pageTime:120">
type OutboundLinkClickEvent = Event<"outboundLink:click", { url: string }>

type TrackEventArgs = PageViewEvent | OutboundLinkClickEvent | PageTime120Event

const MachineToHumanEventTypes: Record<TrackEventArgs["event"], string> = {
	"pageView": "pageview",
	"pageTime:120": "Page time: 2 minutes",
	"outboundLink:click": "Outbound Link: Click",
}

export function trackEvent(args: TrackEventArgs): Promise<void> {
	return new Promise((resolve) => {
		plausible.trackEvent(MachineToHumanEventTypes[args.event], {
			callback: resolve,
			props: args.props,
		})
	})
}
