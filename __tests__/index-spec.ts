import * as index from '../src/index';

test('Should have Greeter available', () => {
  expect(index.Greeter).toBeTruthy();
});

test('Should have VuexConnector available', () => {
  expect(index.VuexConnector).toBeTruthy();
});
