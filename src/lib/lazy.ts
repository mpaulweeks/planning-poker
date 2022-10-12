export class Lazy<T> {
  private instance: T | undefined;
  constructor(readonly initializer: () => T) {}

  get get() {
    return this.instance ?? (this.instance = this.initializer());
  }
}
