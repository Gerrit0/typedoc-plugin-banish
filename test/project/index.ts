export class Foo extends HTMLElement {
  /**
   * This should show up, but not stuff from HTMLElement.
   */
  fooMethod(): string {
    return "hi";
  }
}

export class Bar extends Foo {
  /** This should also show up. */
  barMethod(): void {}
}
