import Plausible from "plausible-tracker";

const isDev = process.env.NODE_ENV === "development";
const staging = "staging.lihbr.com";

const plausible = Plausible(
	isDev
		? {
				domain: staging,
				trackLocalhost: true,
		  }
		: {
				apiHost: "/p7e/js/script.js",
		  },
);

plausible.enableAutoPageviews();
plausible.enableAutoOutboundTracking();

type Event<
	TType = string,
	TData extends Record<string, string | number | boolean> | void = void,
> = TData extends void
	? { event: TType; data?: Record<string, never> }
	: {
			event: TType;
			data: TData;
	  };

type OutboundLinkClickEvent = Event<"outboundLink:click">;
type PageTime120Event = Event<"pageTime:120">;

type TrackEventArgs = OutboundLinkClickEvent | PageTime120Event;

const MachineToHumanEventTypes: Record<TrackEventArgs["event"], string> = {
	"outboundLink:click": "Outbound Link: Click",
	"pageTime:120": "Page time: 2 minutes",
};

export const trackEvent = (args: TrackEventArgs): Promise<void> => {
	return new Promise((resolve) => {
		plausible.trackEvent(
			MachineToHumanEventTypes[args.event],
			{
				callback: resolve,
			},
			args.data,
		);
	});
};
