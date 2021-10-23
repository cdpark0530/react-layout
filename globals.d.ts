export type {};


declare global {
	type Callback = () => void;

	type CommonObject = {
		[K: string]: any;
	};

	type Clazz<T extends Object> = new (...args: any[]) => T;

	type Values<O> = O[keyof O];

	type Tuple = readonly any[];

	type TupleMap = {
		[P: string]: Tuple;
	};

	type PickEquals<X, Y, Return>
		= (<T>() => T extends X ? 1 : 2) extends (<T>() => T extends Y ? 1 : 2)
		? Return
		: never;

	type ReadonlyKeys<T> = {
		[P in keyof T]: PickEquals<
			{
				[a in P]: T[P]
			},
			{
				readonly [a in P]: T[P]
			},
			P
		>
	}[keyof T];

	type WritableKeys<T> = {
		[P in keyof T]: PickEquals<
			{
				[Q in P]: T[P]
			},
			{
				-readonly [Q in P]: T[P]
			},
			P
		>
	}[keyof T];

	type KeyOfTupleMapIn<T extends TupleMap, M> = {
		[P in keyof T]: T[P][number] extends keyof M ? P : never;
	}[keyof T];

	type KeyOfType<O, T> = {
		[P in keyof O]: O[P] extends T ? P : never;
	}[keyof O];
}


declare module "react" {
	export function memo<T extends ComponentType<any>>(
		Component: T,
		propsAreEqual?: (prevProps: Readonly<ComponentProps<T>>, nextProps: Readonly<ComponentProps<T>>) => boolean
	): T;
}
