# Fetch Messages

Fetches messages from the Wonder Simple Message Queue Service

**URL** : `/fetch`

**URL Parameters** : [optional]: `?count=[integer]` where `count` is the amount of messages desired. Returns either the max amount of messages configured by the service, the remaining amount of messages, or the amount specified in the query string, whichever is the least. Returns only 1 message if unused.

**Method** : `GET`

**Auth required** : NO (for now)

**Permissions required** : NONE

**Data** : `{}`

## Success Response

**Condition** : There are messages available for consuming.

**Code** : `200 OK`

**Content** : 
A JSON object with integer indices mapped to a message ID and message.
`{ [integer] : { "messageID": [integer], "message": [JSON], [integer] : { "messageID": [integer], "message": [JSON], [integer] : { "messageID": [integer], "message": [JSON], ... }` 

**Example** : `{
  "0": {
    "id": 1,
    "message": {
      "": "U"
    }
  },
  "1": {
    "id": 2,
    "message": {
      "1ZhHtru": "61Fx811cCB"
    }
  },
  "2": {
    "id": 3,
    "message": {
      "v64KM": "O2L8N"
    }
  }
}`

**Condition** : There are no messages available for consuming.

**Code** : `204 NO CONTENT`

**Content** : `{}`

## Error Responses

**Condition** : Invalid count used in query string.

**Code** : `400 BAD REQUEST`

**Content** : `{}`


