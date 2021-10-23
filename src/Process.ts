
declare global {
	interface ProtectedArray<T> {
		assertRange(idx: number): void;
		assertInsertionRange(idx: number): void;

		at(idx: number): T;
	}

	interface Array<T> extends ProtectedArray<T> {
		add(e: T, idx?: number): void;
		addAll<U extends T>(array: U[], idx: number): void;

		remove(e: T): T;
		removeAt(idx: number): T;
		removeFrom(idx: number, count: number): T[];
	}

	interface ReadonlyArray<T> extends ProtectedArray<T> {
	}

	interface Map<K, V> {
		remove(key: K): V | undefined;
	}
}


const ap = Array.prototype;

ap.assertRange = function (idx) {
	if (idx < 0 || idx >= this.length) {
		Process.throwIndexOutOfBoundsError({left: 0, right: this.length - 1, index: idx});
	}
};

ap.assertInsertionRange = function (idx) {
	if (idx < 0 || idx > this.length) {
		Process.throwIndexOutOfBoundsError({left: 0, right: this.length, index: idx});
	}
};

ap.at = function (idx) {
	if (idx < 0) {
		idx += this.length;
	}
	this.assertRange(idx);
	return this[idx];
};

ap.add = function (this: Array<any>, obj, idx = this.length) {
	if (!idx) {
		idx = this.length;
	}
	this.assertInsertionRange(idx);
	this.splice(idx, 0, obj);
};

ap.addAll = function (array, idx) {
	this.assertInsertionRange(idx);
	this.splice(idx, 0, ...array);
};

ap.remove = function (obj) {
	for (let i = this.length - 1; i >= 0; i--) {
		if (this[i] === obj) {
			return this.splice(i, 1)[0];
		}
	}
	return undefined;
};

ap.removeAt = function (idx) {
	if (idx < 0) {
		idx += this.length;
	}
	this.assertRange(idx);
	return this.splice(idx, 1)[0];
};

ap.removeFrom = function (idx, count) {
	if (count < 1) {
		Process.throwCountOutOfBoundError({left: 1, count});
	}
	if (idx < 0 || idx + count > this.length) {
		Process.throwRangeOutOfBoundsError({left: 0, right: this.length - 1, index: idx, count});
	}
	return this.splice(idx, count);
};


const mp = Map.prototype;
mp.remove = function (key: Object): Object | undefined {
	let result = this.get(key);
	if (result) {
		this.delete(key);
	}
	return result;
};


class Process {
	public static isWritable<T extends Object>(prototype: T, key: any): key is WritableKeys<T> {
		const descriptor = Object.getOwnPropertyDescriptor(prototype, key);

		return !descriptor || !!descriptor.writable;
	}

	public static forEachKey<T>(object: T, callback: (key: keyof T, object: T) => void) {
		for (const key in object) {
			callback(key, object);
		}
	}

	public static keyOf<O extends CommonObject>(val: Values<O>, object: O): keyof O {
		for (const key in object) {
			if (object[key] === val) {
				return key;
			}
		}
		throw new TypeError(`value not found: ${val}`);
	}

	public static throwIndexOutOfBoundsError(props: {left?: number, right?: number, index: number;}) {
		throw new RangeError(`index out of bounds ${props.left === undefined ? "(" : `[${props.left}`}, ${props.right === undefined ? ")" : `${props.right}]`}: ${props.index}`);
	}

	public static throwCountOutOfBoundError(props: {left: number, right?: number, count: number;}) {
		throw new RangeError(`count out of bounds [${props.left}, ${props.right === undefined ? ")" : `${props.right}]`}: ${props.count}`);
	}

	public static throwRangeOutOfBoundsError(props: {left?: number, right?: number, index: number, count: number;}) {
		throw new RangeError(`range out of bounds ${props.left === undefined ? "(" : `[${props.left}`}, ${props.right === undefined ? ")" : `${props.right}]`}: [${props.index}, ${props.index + props.count - 1}]`);
	}
}

export default Process;
