import { VuexConnector } from '../src/vuex-connector';

test('Should greet with message', () => {
  const greeter = new VuexConnector('friend');
  expect(greeter.greet()).toBe('Bonjour, friend!');
});
