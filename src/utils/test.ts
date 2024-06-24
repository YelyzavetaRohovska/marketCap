function mul1(n) {
  return (m) => {
    if (m === undefined) return n;
    return mul1(n * m);
  }
}

mul1(1)(2)(3)();

function mul2(...args: number[]): number {
  return args.reduce((m, v) => m = m*v, 1);
}

mul2(1, 2, 3);

function mul3(n) {
  let res = n;
  this.mul = (m) => mul3.call(this, m*res);
  this.result = res;

  return this;
}

mul3(1).mul(2).mul(3).mul(4).mul(5).result