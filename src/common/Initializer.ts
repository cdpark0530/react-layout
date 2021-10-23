class Initializer {
	static clazz<T extends new (...args: any[]) => Object>(cb: (constructor: T) => void) {
		return function (constructor: T) {
			cb(constructor);
		};
	}

	static property<T>(cb: (object: T, property: string) => void) {
		return function (object: T, property: string) {
			cb(object, property);
		};
	}
}

export default Initializer;