import "./View.scss";

import Process from "./Process";

import Initializer from "./common/Initializer";


declare global {
	interface HTMLCollection extends ReadonlyArray<View> {
	}

	interface WindowEventMap {
		"DOMContentLoaded": Event;
	}
}

Process.forEachKey(Array.prototype, (key, ap) => {
	if (Process.isWritable(HTMLCollection.prototype, key)) {
		HTMLCollection.prototype[key] = ap[key];
	}
});


class View extends HTMLElement {
	@Initializer.property(() => {
		try {
			const options = {
				get passive() {
					// @ts-expect-error
					View.isPassiveSupported = true;
					return false;
				}
			};

			// @ts-expect-error
			window.addEventListener("test", null, options);
			// @ts-expect-error
			window.removeEventListener("test", null, options);
		}
		catch (e) {
			console.info("passive event option is not supported");
		}
	})
	public static readonly isPassiveSupported = false;
	public static readonly passiveOption: Readonly<AddEventListenerOptions> = {
		passive: true,
	};
	public static readonly passiveAndCaptureOptions: Readonly<AddEventListenerOptions> = {
		passive: true,
		capture: true,
	};

	public static listen<E extends keyof WindowEventMap>(event: E, listener: (this: Window, ev: WindowEventMap[E]) => any, options?: AddEventListenerOptions) {
		window.addEventListener(event, listener, View.isPassiveSupported ? options : options?.capture);
	}


	@Initializer.property(() => {
		function onResize() {
			// @ts-expect-error
			View.width = window.innerWidth;
			// @ts-expect-error
			View.height = window.innerHeight;
		}
		View.listen("resize", onResize, View.passiveOption);

		View.onDomLoaded(() => {
			onResize();
		});
	})
	public static readonly width = 0;
	public static readonly height = 0;


	public static readonly LoadedResources = {
		doc: 1,
		scripts: 2,
		resources: 3,
		all: 4,
	};

	@Initializer.property(() => {
		View.onDomLoaded(() => {
			console.info("Parsed scripts.");
			// @ts-expect-error
			View.state = View.LoadedResources.scripts;
		});

		View.onResLoaded(() => {
			console.info("Loaded resources such as images, stylesheets, and frames.");
			// @ts-expect-error
			View.state = View.LoadedResources.resources;
		});

		View.onLoaded(() => {
			console.info("Start serving the page...");
			// @ts-expect-error
			View.state = View.LoadedResources.all;
		});
	})
	public static readonly state: Values<typeof View.LoadedResources> = View.LoadedResources.doc;


	public static isResourceLoaded(resource: keyof typeof View.LoadedResources) {
		return View.state >= View.LoadedResources[resource];
	}

	public static onDomLoaded(cb: Callback) {
		View.isResourceLoaded("scripts") ? cb() : View.listen("DOMContentLoaded", cb);
	}

	public static onResLoaded(cb: Callback) {
		View.isResourceLoaded("resources") ? cb() : document.addEventListener("readystatechange", () => {
			if (document.readyState === "complete") {
				cb();
			}
		});
	}

	public static onLoaded(cb: Callback) {
		View.isResourceLoaded("all") ? cb() : View.listen("load", cb);
	}


	public listen<K extends keyof HTMLElementEventMap>(type: K, listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any, options?: AddEventListenerOptions) {
		this.addEventListener(type, listener, View.isPassiveSupported ? options : options?.capture);
	}

	public ignore<K extends keyof HTMLElementEventMap>(type: K, listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any, options?: EventListenerOptions) {
		this.removeEventListener(type, listener, View.isPassiveSupported ? options : options?.capture);
	}


	public isNonDisplayed() {
		return this.offsetParent === null;
	}
}


namespace View {
	export type onMount<V extends View = View> = (view: V) => (void | (onUnmount));
	export type onUnmount = () => void;

	export interface Props<V extends View> extends Attrs<V> {
		onMounts?: onMount<V>[];
	}

	export interface ParentProps<V extends View> extends Props<V> {
	}

	export interface Attrs<V extends View> extends React.HTMLAttributes<V> {
		orientation?: "x" | "y";
		mSize?: string;
		cSize?: string;
		bgColor?: string;
	}

	export class RootView extends View {
	};

	customElements.define("root-view", RootView);
}

export default View;
