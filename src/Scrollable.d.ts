import type View from "./View";


export default interface Scrollable<V extends View = View> {
	onScroll?: (ev: React.UIEvent<V>) => void;

	endObserverThreshold?: IntersectionObserverInit["threshold"];
	endObserverMargin?: IntersectionObserverInit["rootMargin"];
	onEndVisible?: (isRear: boolean) => void;
}
