import { Store } from 'vuex';
import Vue, { CreateElement, FunctionalComponentOptions } from 'vue';

declare module 'vue/types/vue' {
  interface VueConstructor {
    $store: Store<any>;
  }
}

interface IMapOptions {
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
    mapCommitToProps = {}
  }: any = {}): (component: typeof Vue) => FunctionalComponentOptions<any> {
    return (component: typeof Vue): any => {
      return {
        functional: true,
        render: (createElement: CreateElement, context: any): any => {
          return createElement(
            component,
            Object.assign(context.data, {
              props: Object.assign(
                {},
                context.data.props,
                this.dataToProps(mapStateToProps, 'state', context.data.props),
                this.dataToProps(mapGettersToProps, 'getters', context.data.props),
                this.functionToProps(mapDispatchToProps, 'dispatch'),
                this.functionToProps(mapCommitToProps, 'commit')
              )
            }),
            context.children
          );
        }
      };
    };
  }

  private dataToProps(
    map: IMapOptions = {},
    type: 'getters' | 'state',
    props: any
  ): any {
    return Object.keys(map).reduce((pre: IMapOptions, cur: string) => {
      const option: any = map[cur];
      let fn: any;
      switch (typeof option) {
        case 'function':
          fn = option;
          break;
        case 'string':
          fn = (data: any): any => data[option];
          break;
      }

      pre[cur] = fn.call(null, this.store[type], props);
      return pre;
    }, {});
  }
  private functionToProps(
    map: IMapOptions = {},
    type: 'commit' | 'dispatch'
  ): any {
    return Object.keys(map).reduce((pre: IMapOptions, cur: string) => {
      const option: string = map[cur];

      pre[cur] = (...args: any[]): any => {
        const fn: any = this.store[type];
        return fn(option, ...args);
      };
      return pre;
    }, {});
  }
}
