{
  type CoffeeCup = {
    shots: number;
    hasMilk: boolean;
  };

  // public
  // private
  // protected
  class CoffeeMaker {
    private static BEANS_GRAMM_PER_SHOT: number = 7; // class level
    private coffeeBeans: number = 0; // instance (object) level

    // makeMachine을 통해서 instance를 생성하기 때문에 private constructor로 사용한다
    private constructor(coffeeBeans: number) {
      this.coffeeBeans = coffeeBeans;
    }

    static makeMachine(coffeeBeans: number): CoffeeMaker {
      return new CoffeeMaker(coffeeBeans);
    }

    fillCoffeeBeans(beans: number) {
      if (beans < 0) {
        throw new Error('value for beans should be greater than 0');
      }
      this.coffeeBeans += beans;
    }

    makeCoffee(shots: number): CoffeeCup {
      if (this.coffeeBeans < shots * CoffeeMaker.BEANS_GRAMM_PER_SHOT) {
        throw new Error('Not enough coffee beans!');
      }
      this.coffeeBeans -= shots * CoffeeMaker.BEANS_GRAMM_PER_SHOT;
      return {
        shots,
        hasMilk: false,
      };
    }
  }

  const maker = CoffeeMaker.makeMachine(32);
  maker.fillCoffeeBeans(32);

  class User {
    // 호출되는 시점에 계산
    get fullName(): string {
      return `${this.firstName} ${this.lastName}`;
    }
    private _age = 4;
    get age(): number {
      return this._age;
    }
    set age(num: number) {
      if (num < 0) {
      }
      this._age = num;
    }
    // private하게 설정하면 값이 자동으로 할당된다.
    constructor(private firstName: string, public lastName: string) {}
  }
  const user = new User('Steve', 'Jobs');
  user.age = 6;
  console.log(user);
}
