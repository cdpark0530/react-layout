import type React from "react";
import type SectionData from "./SectionData";


export default interface Listable<D, K extends React.Key> {
	sectionData: SectionData<D, K> | SectionData<D, K>[];
}
