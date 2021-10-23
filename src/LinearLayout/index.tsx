import "./index.scss";

import React, {memo, ReactNode} from "react";

import View from "../View";

import useMount from "layout/useMount";


function LinearLayout(props: LinearLayout.Props<LinearLayout.Clazz>) {
	const {children, onMounts, ...restProps} = props;

	const [onMount] = useMount(onMounts);

	return (
		<linear-layout
			{...restProps}
			ref={onMount}
		>
			{children}
		</linear-layout>
	);
}


namespace LinearLayout {
	export interface Props<V extends LinearLayout.Clazz> extends View.ParentProps<V>, Attrs<V> {
	}

	export interface Attrs<V extends LinearLayout.Clazz> extends View.Attrs<V> {
		scrollable?: "true";
	}

	export class Clazz extends View {
	}

	customElements.define("linear-layout", Clazz);
}


declare global {
	namespace JSX {
		interface IntrinsicElements {
			"linear-layout": React.DetailedHTMLProps<LinearLayout.Attrs<LinearLayout.Clazz>, LinearLayout.Clazz>;
		}
	}
}


export default memo(LinearLayout);
