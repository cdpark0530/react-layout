import {Dispatch, SetStateAction, useCallback} from "react";

import type View from "./View";


function useIntersectionObserver(onChange: (entry: IntersectionObserverEntry) => void, setOnChildMounts: Dispatch<SetStateAction<View.onMount<View>[]>>, options?: IntersectionObserverInit) {
	return useCallback((root?: View) => {
		if (!options) {
			options = {};
		}
		options.root = root;

		const observer = new IntersectionObserver(
			entries => {
				entries.forEach(onChange);
			},
			options
		);

		const onMount: View.onMount = (view: View) => {
			observer.observe(view);

			return () => {
				observer.unobserve(view);
			};
		};
		setOnChildMounts(onChildMounts => [...onChildMounts, onMount]);

		return () => {
			observer.disconnect();
			setOnChildMounts(onChildMounts => onChildMounts.filter(onChildMount => onChildMount !== onMount));
		};
	}, [onChange, options]);
}


export default useIntersectionObserver;
