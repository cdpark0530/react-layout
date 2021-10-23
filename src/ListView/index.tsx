import "./index.scss";

import React, {memo, useCallback, useMemo, useState} from "react";

import View from "../View";
import LinearLayout from "layout/LinearLayout";

import useIntersectionObserver from "layout/useIntersectionObserver";
import useMount from "layout/useMount";

import type Listable from "layout/Listable";
import type Scrollable from "layout/Scrollable";
import type SectionData from "layout/SectionData";


function ListView<D, K extends React.Key>(props: ListView.Props<ListView.Clazz, D, K>) {
	const {
		onMounts,
		sectionData,
		endObserverMargin,
		endObserverThreshold,
		onEndVisible,
		...restProps
	} = props;

	console.log("render ListView");

	const [onEndMounts, setOnEndMounts] = useState<View.onMount[]>([]);
	const endObserverOptions: IntersectionObserverInit = useMemo(
		() => ({threshold: endObserverThreshold, rootMargin: endObserverMargin}),
		[endObserverThreshold, endObserverMargin]
	);
	const endObserverCallback = useCallback((entry: IntersectionObserverEntry) => {
		const view = entry.target as View;
		if (entry.isIntersecting) {
			onEndVisible!(!view.nextElementSibling);
		}
	}, [onEndVisible]);
	const initEndObserver = useIntersectionObserver(endObserverCallback, setOnEndMounts, endObserverOptions);

	const onSelfMounts = useMemo(() => onMounts ? [...onMounts, initEndObserver] : [initEndObserver], [onMounts, initEndObserver]);
	const [onMount] = useMount(onSelfMounts);

	return (
		<list-view
			{...restProps}
			ref={onMount}
		>
			{!!onEndVisible && <LinearLayout onMounts={onEndMounts} />}
			{
				useMemo(
					() => sectionData instanceof Array
						? sectionData.map((sectionData, idx) => (
							<linear-layout key={sectionData.sectionId ?? idx} scrollable="true" orientation={restProps.orientation}>
								{bindSection(sectionData)}
							</linear-layout>
						))
						: bindSection(sectionData),
					[sectionData]
				)
			}
			{!!onEndVisible && <LinearLayout onMounts={onEndMounts} />}
		</list-view>
	);
}


function bindSection<D, K extends React.Key>(sectionData: SectionData<D, K>) {
	return (
		<>
			{
				sectionData.onBindHeader?.(sectionData.sectionId)
			}
			{
				sectionData.items.map((item, idx) => sectionData.onBind(item, idx, sectionData.sectionId))
			}
			{
				sectionData.onBindFooter?.(sectionData.sectionId)
			}
		</>
	);
}


namespace ListView {
	export interface Props<V extends ListView.Clazz, D, K extends React.Key> extends View.Props<V>, Attrs<V>, Listable<D, K>, Scrollable<V> {
	}

	export interface Attrs<V extends ListView.Clazz> extends View.Attrs<V> {
	}

	export class Clazz extends View {
	}

	customElements.define("list-view", Clazz);
}


declare global {
	namespace JSX {
		interface IntrinsicElements {
			"list-view": React.DetailedHTMLProps<ListView.Attrs<ListView.Clazz>, ListView.Clazz>;
		}
	}
}


export default ListView;
