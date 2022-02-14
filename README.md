# router-count

## Description
The callback parameter will be called, before the time when the website back to an empty interface.

## Dependence
vue3@3 vue-router@4

## Install
```javascript
import routerCount from 'router-count';
```

## Usage
```javascript
import router from './router';
import routerCount from 'router-count';

routerCount(router, () => {
  alert(1)
});
```