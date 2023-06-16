# `afrobank-sdk`

SDK for afrobank

## `Description`

Afrobank Software Development Kit built to ease developement process and access to prebuilt APIs

```
npm i https://github.com/Akinolae/afrobank-sdk.git#master
```

```
yarn add https://github.com/Akinolae/afrobank-sdk.git#master
```
---
sidebar_position: 2
---

# Usage

Documents are **groups of pages** connected through:

## `Authentication`

In your `auth page` or `@core/services` page, add the code below

## `Login Auth`

Made to ease the login process by masking endpoints, helps to speed up coding process.

```jsx title="auth/index.auth.ts"
import { Auth } from "afrobank-sdk";

const auth = new Auth(reduxStore, endpointUrl, optionalData);

interface LoginParams {
  email: string;
  password: string;
}

async function login(data: LoginParams) {
  try {
    const response = await auth.login(data);
    return response;
  } catch (e) {
    throw e;
  }
}
```

## `Register Auth`

Made to ease the register process by masking endpoints, helps to speed up coding process.

```jsx title="auth/index.auth.ts"
import { Auth } from "afrobank-sdk";

const auth = new Auth(reduxStore, endpointUrl, optionalData);

async function register(data) {
  try {
    const response = await auth.register(data);
    return response;
  } catch (e) {
    throw e;
  }
}
```
## `2FA Auth`

Made to ease the register process by masking endpoints, helps to speed up coding process.

```jsx title="auth/index.auth.ts"
import { Auth } from "afrobank-sdk";

const auth = new Auth(reduxStore, endpointUrl, optionalData);

async function validate2FA(data) {
  try {
    const response = await auth.validate2FA(data);
    return response;
  } catch (e) {
    throw e;
  }
}
```

## Params

- reduxStore: type `redux-toolkit/`
- **endpointUrl**: type `string`
- **optionalData**: type `object`

