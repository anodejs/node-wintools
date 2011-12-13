# wintools - Some windows tools for node.js

Only runs on Windows

 * wintools.ps - process info
 * wintools.iis - control iis (through appcfg)

## Installation

```bash
npm install wintools
```

## Usage

```javascript
var wintools = require('wintools');
```

### wintools.ps(callback)

```javascript
wintools.ps(function(err, list)) {
    console.log('processes:', list);
});
```

### wintools.iis

 * wintools.iis.vdirs
 * ...

```
## License

MIT
