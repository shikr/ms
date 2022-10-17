# ms

Convert string to milliseconds.

## Install

```sh
$ npm install @sabier/ms
```

## Examples

```js
const { ms } = require('@sabier/ms')

ms('1h') // 3600000
ms('2h 30m') // 9000000
ms('3d 4h', true) // { name: '3 days, 4 hours', value: 273600000 }
ms('Hello world!', true) // null
```

## License

[MIT © Cristo](./LICENSE.md)
