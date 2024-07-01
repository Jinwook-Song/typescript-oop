{
  type Video = {
    title: string;
    author: string;
  };
  // [1, 2].map(item => item * item); // [1, 4]

  type Optional<T> = {
    [P in keyof T]?: T[P]; // for...in
  };

  type ReadOnly<T> = {
    readonly [P in keyof T]: T[P];
  };
  type VideoOptional = Optional<Video>;

  type Animal = {
    name: string;
    age: number;
  };
  const animal: Optional<Animal> = {
    name: 'dog',
  };
  animal.name = 'ellie';

  const video: ReadOnly<Video> = {
    title: 'hi',
    author: 'ellie',
  };

  // type VideoOptional = {
  //   title?: string;
  //   author?: string;
  // };

  // type VideoReadOnly = {
  //   readonly title: string;
  //   readonly author: string;
  // };

  type Nullable<T> = { [P in keyof T]: T[P] | null };
  const obj2: Nullable<Video> = {
    title: 'hi',
    author: null,
  };

  // 어떤 오브젝트의 모든 키들에 대해 읽고 쓰는 (get/set) 함수를 정의하는 타입
  type Proxy<T> = {
    get(): T;
    set(value: T): void;
  };

  type Proxify<T> = {
    [P in keyof T]: Proxy<T[P]>;
  };

  function proxify<T extends object>(o: T): Proxify<T> {
    const result = {} as Proxify<T>;
    for (const key in o) {
      let rawValue = o[key];
      result[key] = {
        get: () => rawValue,
        set: (value) => {
          rawValue = value;
        },
      };
    }
    return result;
  }

  const props = { rooms: 4 };
  const proxifiedProps = proxify(props);
  proxifiedProps.rooms.set(5);
  console.log(proxifiedProps.rooms.get()); // output 5
}
