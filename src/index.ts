import { Commit, Dispatch, Store } from 'vuex';
import Vue, {
  CreateElement,
  VueConstructor,
  FunctionalComponentOptions,
} from 'vue';

interface functionMap {
  (data: any): any;
}
interface mapOptions {
  [index: string]: any;
}

export default class VuexConnector {
  private store: Store<any>;
  constructor(store: Store<any>) {
    this.store = store;
  }

  public connect({
    mapStateToProps = {},
    mapGettersToProps = {},
    mapDispatchToProps = {},
    mapCommitToProps = {},
  } = {}): (Component: typeof Vue) => FunctionalComponentOptions<any> {
    return (Component: typeof Vue) => {
      return {
        functional: true,
        render: (createElement: CreateElement, context: any) => {
          return createElement(
            Component,
            Object.assign(context.data, {
              props: Object.assign(
                {},
                context.data.props,
                this.dataToProps(mapStateToProps, 'state'),
                this.dataToProps(mapGettersToProps, 'getters'),
                this.functionToProps(mapDispatchToProps, 'dispatch'),
                this.functionToProps(mapCommitToProps, 'commit')
              ),
            }),
            context.children
          );
        },
      };
    };
  }

  private dataToProps(map: mapOptions = {}, type: 'getters' | 'state') {
    return Object.keys(map).reduce((pre: mapOptions, cur: string) => {
      let option = map[cur];
      let fn;
      switch (typeof option) {
        case 'function':
          fn = option;
          break;
        case 'string':
          fn = (data: any) => data[option];
          break;
      }

      pre[cur] = fn(this.store[type]);
      return pre;
    }, {});
  }

  private functionToProps(map: mapOptions = {}, type: 'commit' | 'dispatch') {
    return Object.keys(map).reduce((pre: mapOptions, cur) => {
      let option = map[cur];

      pre[cur] = (...args: any[]) => {
        let fn: any = this.store[type];
        return fn(option, ...args);
      };
      return pre;
    }, {});
  }
}
