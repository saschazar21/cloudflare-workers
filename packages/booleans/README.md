<div align="center">
  <h1>Booleans REST API</h1>
  <strong>Booleans. In an API. Enough said.</strong><br />
  <br />
  <br />
  <br />
  <br />
  <br />
</div>

## API

This project exposes a collection of [json:api](https://jsonapi.org/)-conform endpoints to create, update & delete boolean values.

### `GET /api/v1/:key`

Reads the boolean value stored under the key `:key`.

#### Parameters

- **`key`** - the key of the boolean value. _(e.g. bFNTGNhRNphnqb)_

#### Example Request

```bash
curl -X GET https://booleans.saschazar.workers.dev/api/v1/bFNTGNhRNphnqb
```

#### Success Response

If a boolean value exists under the given `key`, a response like the following is returned:

```json
{
  "data": {
    "id": "bFNTGNhRNphnqb",
    "attributes": {
      "value": true
    },
    "type": "boolean",
    "link": {
      "self": "https://booleans.saschazar.workers.dev/api/v1/bFNTGNhRNphnqb"
    }
  },
  "meta": {
    "createdAt": 1633348116000,
    "updatedAt": 1633348116000,
    "version": 1
  }
}
```

#### Error Response

Should the given `key` not exist, an object containing `null` values is returned:

```json
{
  "data": {
    "id": "bFNTGNhRNphnqb",
    "attributes": {
      "value": null
    },
    "type": "boolean",
    "link": {
      "self": "https://booleans.saschazar.workers.dev/api/v1/bFNTGNhRNphnqb"
    }
  }
}
```

### `POST /api/v1/:key/:value`

Creates/updates a boolean value with the given `:value`.

#### Parameters

Both parameters may be omitted; then a new boolean with value `true` will be created. If only the `value` parameter is present, it will be used as initial value. If only the `key` parameter is present, it will result in an error.

- **`key`** - the key of the boolean value. **Optional**, _(e.g. bFNTGNhRNphnqb)_
- **`value`** - the updated value of the boolean. **Optional**, _(e.g. true)_

##### Search Parameters

Further metadata may be appended to the boolean value using the following search parameters:

- **`expires`** - self-destroy a boolean value after a given amount of seconds (min. 60 seconds).
- **`label`** - attach a label to the boolean value, for custom purposes.

#### Example Requests

POST requests can be performed in three different ways:

> **Note:** only the `content-type` methods allow setting an initial value when creating a new boolean entry.

- using URL parameters

  ```bash
    curl -X POST https://booleans.saschazar.workers.dev/api/v1/bFNTGNhRNphnqb/true
  ```

- using `application/json` content-type

  ```bash
    curl -X POST \
        -H "Content-Type: application/json" \
        -d '{ "key": "bFNTGNhRNphnqb", "value": "true" }' \
        https://booleans.saschazar.workers.dev/api/v1
  ```

- using `application/x-www-form-urlencoded` content-type

  ```bash
    curl -X POST \
        -H "Content-Type: application/x-www-form-urlencoded" \
        -d "key=bFNTGNhRNphnqb&value=true" \
        https://booleans.saschazar.workers.dev/api/v1
  ```

An example request for creating a new boolean with initial value `false`, expiring after 60 seconds and attached with a custom label would look like the following:

```bash
curl -X POST \
    -H "Content-Type: application/x-www-form-urlencoded" \
    -d "value=false" \
    https://booleans.saschazar.workers.dev/api/v1?expires=60&label=Custom
```

#### Success Response

Whenever a boolean has been created or updated, a response like the following is returned:

> **Note:** the `metadata` object may contain an `expiresAt` and/or `label` entry, whenever the boolean has been created using one of those settings in the search parameters.

```json
{
  "data": {
    "id": "bFNTGNhRNphnqb",
    "attributes": {
      "value": true
    },
    "type": "boolean",
    "link": {
      "self": "https://booleans.saschazar.workers.dev/api/v1/bFNTGNhRNphnqb"
    }
  },
  "meta": {
    "createdAt": 1633348116000,
    "updatedAt": 1633348116000,
    "version": 1
  }
}
```

#### Error Response

Whenever the creation/update has failed, the server will return either a `400 Bad Request` or `500 Internal Server Error` HTTP response.

```json
{
  "errors": [
    {
      "status": 400,
      "title": "Only true or false allowed for value, but received \"truee\"."
    }
  ]
}
```

### `PUT /api/v1/:key/:value`

This endpoint is just a shallow clone of the [POST endpoint](#post-apiv1keyvalue).

### `DELETE /api/v1/:key`

Deletes the boolean value stored under the key `:key`.

#### Parameters

- **`key`** - the key of the boolean value. _(e.g. bFNTGNhRNphnqb)_

#### Example Request

```bash
curl -X DELETE https://booleans.saschazar.workers.dev/api/v1/bFNTGNhRNphnqb
```

#### Success Response

An empty response with status code `200 OK` is returned, without any further information attached.

> **Note:** this does not infer whether the boolean actually existed before. The response just marks the execution of a successful operation without any runtime errors.

#### Error Response

Whenever something has failed other than deleting the boolean entry, the server will return either a `400 Bad Request` or `500 Internal Server Error` HTTP response. See [POST Error Response](#error-response-1)

## Credits

This project has been inspired by [booleans.io](https://booleans.io).

## License

Licensed under the MIT license.

Copyright ©️ 2021 [Sascha Zarhuber](https://sascha.work)
