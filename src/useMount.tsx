import {useCallback, useEffect, useState} from "react";

import type View from "./View";


function useMount<V extends View = View>(onMounts?: View.onMount[]) {
	const [view, setView] = useState<V>();

	useEffect(() => {
		if (view && onMounts) {
			const onUnmounts = new Array<View.onUnmount>();
			onMounts.forEach(onMount => {
				const onUnmount = onMount(view);
				if (onUnmount) {
					onUnmounts.add(onUnmount);
				}
			});

			if (onUnmounts.length) {
				return () => {
					onUnmounts.forEach(onUnmount => onUnmount());
				};
			}
		}

		return;
	}, [view, onMounts]);

	const onMount = useCallback((newView: V | null) => {
		if (newView) {
			setView(newView);
		}
	}, []);

	return [onMount, view] as const;
}


export default useMount;
