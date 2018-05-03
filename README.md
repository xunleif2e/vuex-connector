# @xunlei/vuex-connector

> 基于 Vue 生态实现的 Vuex store connector，借鉴 React 容器组件（Smart/Container Components）和展示组件（Dumb/Presentational Components）的模式



[![npm (scoped)](https://img.shields.io/npm/v/@xunlei/vuex-connector.svg)](https://www.npmjs.com/package/@xunlei/vuex-connector)
[![GitHub stars](https://img.shields.io/github/stars/xunleif2e/vuex-connector.svg?style=social)](https://github.com/xunleif2e/vuex-connector/stargazers)
[![GitHub license](https://img.shields.io/github/license/xunleif2e/vuex-connector.svg?style=social)](https://github.com/xunleif2e/vuex-connector/blob/master/LICENSE)
 [![](https://badge.juejin.im/entry/5aea78e6518825673614bfc0/likes.svg?style=flat-square)](https://juejin.im/post/5ae9a5545188256709610635)

## 安装

```bash
npm install @xunlei/vuex-connector
```

## 使用

### 初始化

`store/index.js`

```js
import VuexConnector from '@xunlei/VuexConnector';

// 将store传入connecor进行连接
export const connector = new VuexConnector(store);
```

### 生成容器组件

`containers/CounterContainer.vue`

```js
import Counter from '@/components/Counter';
import {connector} from '@/store';

export default connector.connect({
  mapStateToProps: {
    // total是Counter接收的prop之一
    total: state => state.count,
  },
  mapCommitToProps: {
    // onIncrease，onDecrease都是是Counter接收的prop
    onIncrease: 'increment',
    onDecrease: 'decrement',
  },
})(Counter);
```

### 使用容器组件

`App.vue`

```html
<template>
  <div>
    <h1>容器组件-展示组件模式</h1>
    <CounterContainer/>
  </div>
</template>

<script lang="ts">
import CounterContainer from '@/containers/CounterContainer'

export default {
  components: {
    CounterContainer
  }
}
</script>
```

## API

### `class` VuexConnector

### constructor(store: Store)

构造函数需要传入一个 Vuex store 的实例

### connect

typescript 定义

```ts
connect({
  mapStateToProps?,
  mapGettersToProps?,
  mapDispatchToProps?,
  mapCommitToProps?
}): (Component: typeof Vue) => FunctionalComponentOptions<any>
```

connect 函数根据传入配置，生成一个高阶函数，高阶函数传入一个要连接的展示组件，即可生成最终的容器组件。

#### mapStateToProps 配置

```ts
{
  [prop: string]: (state) => anyState;
}
```

例子:

```js
connector.connect({
  mapStateToProps: {
    userId: state => state.userId,
  },
})(Counter);
```

#### mapGettersToProps 配置

```ts
{
  [prop: string]: (getters) => anyGetter;
}
```

例子:

```js
connector.connect({
  mapGettersToProps: {
    isLogin: getters => getters.isLogin,
  },
})(Counter);
```

#### mapDispatchToProps 配置

```ts
{
  [prop: string]: action: string;
}
```

例子:

```js
connector.connect({
  mapDispatchToProps: {
    // onIncrease，onDecrease都是是Counter接收的prop
    onIncrease: 'increment',
    onDecrease: 'decrement',
  },
})(Counter);
```

#### mapCommitToProps 配置

```ts
{
  [prop: string]: mutation: string;
}
```

例子:

```js
connector.connect({
  mapCommitToProps: {
    // onIncrease，onDecrease都是是Counter接收的prop
    onIncrease: 'increment',
    onDecrease: 'decrement',
  },
})(Counter);
```

## License

[MIT](http://opensource.org/licenses/MIT)

Copyright (c) 2017 XunleiF2E
