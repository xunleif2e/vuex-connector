import { Store } from 'vuex';
import Vue, { CreateElement, FunctionalComponentOptions } from 'vue';

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
                this.dataToProps(mapStateToProps, 'state', component),
                this.dataToProps(mapGettersToProps, 'getters', component),
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
    vm: typeof Vue
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

      // 执行环境为要连接的组件，这样map函数内就可以访问this
      pre[cur] = fn.call(vm, this.store[type]);
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
