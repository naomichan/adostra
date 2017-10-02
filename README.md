# hotsapiclient

A TypeScript ES5 library to interface with hotsapi.net's api.

## usage

```js
var hotsapi = new (require("hotsapiclient"))();

hotsapi.getReplays().then(replays => {
  console.log(replays);
}).catch(ex => {
  console.error(ex);
});
```
