import React, {useCallback} from "react";

import type View from "layout/View";
import type ListView from "layout/ListView";


function RecyclerView<D, K extends React.Key>(props: RecyclerView.Props<D, K>) {
	const {Layout, ...restProps} = props;

	console.log("render RecyclerView");

	const onScrollInternal = useCallback((ev: React.UIEvent<View>) => {
		const el = ev.target as View;
	}, []);

	return (
		<Layout
			{...restProps}
			onScroll={onScrollInternal}
		/>
	);
}


namespace RecyclerView {
	export interface Props<D, K extends React.Key> extends ListView.Props<ListView.Clazz, D, K> {
		Layout: React.FC<ListView.Props<ListView.Clazz, D, K>>;
	}
}


export default RecyclerView;
