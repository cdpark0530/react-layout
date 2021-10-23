import React, {useState} from "react";

import LinearLayout from "layout/LinearLayout";
import RecyclerView from "layout/RecyclerView";
import ListView from "layout/ListView";

import type SectionData from "layout/SectionData";


const initialItems = new Array<SectionData<number, number>>(5);
const sectionLength = 3;
for (let i = 0; i < initialItems.length; i++) {
	initialItems[i] = {
		sectionId: i + 1,
		items: new Array<number>(sectionLength),
		onBind,
		onBindHeader,
	};

	const items = initialItems[i].items;

	for (let j = 0; j < sectionLength; j++) {
		items[j] = j + 1;
	}
}


function onBind(item: number, idx: number) {
	const padding = "1rem";

	return (
		<LinearLayout
			key={idx}
			mSize="150px"
			style={{padding}}
		>
			{item}
		</LinearLayout>
	);
}


function onBindHeader(sectionId: number) {
	const rb = `0${(255 - sectionId * 30).toString(16)}`.slice(-2);
	const g = (255 - sectionId * 20).toString(16);

	const padding = "1rem";

	return (
		<LinearLayout
			key={sectionId}
			bgColor={`#${rb}${g}${rb}`}
			style={{
				justifyContent: "center",
				padding,
			}}
		>
			{`Section ${sectionId}`}
		</LinearLayout>
	);
}


function App() {
	const [sectionData] = useState(initialItems);

	return (
		<>
			<linear-layout orientation="x" style={{textAlign: "center"}}>
				{/* <linear-layout
					onClick={_ => {
						setItems(items => [...items, items.length ? items.at(-1)! + 1 : 0]);
					}}
					style={{flexGrow: 1}}
				>
					Add Last
				</linear-layout>
				<linear-layout
					onClick={_ => {
						if (items.length) {
							setItems(items => items.slice(1));
						}
					}}
					style={{flexGrow: 1}}
				>
					Remove First
				</linear-layout> */}
			</linear-layout>
			<RecyclerView
				sectionData={sectionData}
				Layout={ListView}
				// orientation="x"
				// endObserverMargin="100%"
				onEndVisible={isRear => {
					console.log(isRear ? "Reached Footer" : "Reached Header");
				}}
			/>
		</>
	);
}

export default App;
