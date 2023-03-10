# afrobank-sdk

SDK for afrobank

## Description

Afrobank Software Development Kit built to ease developement process and access to prebuilt APIs

```
npm i https://github.com/Akinolae/afrobank-sdk.git#master


yarn add https://github.com/Akinolae/afrobank-sdk.git#master
```

## `Authentication`

```javascript
import { Auth } from "afrobank-sdk;

const auth = new Auth(reduxStore, endpointUrl, optionalData)

async function login (data) {
    try {
        const response = await auth.login(data)
        return response;
    } catch (e) {
        throw e
    }
}

```
