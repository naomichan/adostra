# adostra

A TypeScript ES6 library to interface with hotsapi.net's api.

## usage

```js
var hotsapi = new (require("adostra"))();

hotsapi.getReplays().then(replays => {
  console.log(replays);
}).catch(ex => {
  console.error(ex);
});
```
