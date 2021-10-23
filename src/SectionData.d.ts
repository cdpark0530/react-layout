export default interface SectionData<D, S extends number | string> {
	sectionId: S;
	onBind: (item: SectionData<D, S>["items"][number], idx: number, sectionId: S) => React.ReactNode;
	onBindHeader?: (sectionId: S) => React.ReactNode;
	onBindFooter?: (sectionId: S) => React.ReactNode;
	items: D[];
}
