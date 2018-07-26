# Send Message

Sends a message to the Wonder Simple Message Queue Service

**URL** : `/send/`

**Method** : `POST`

**Auth required** : NO (for now)

**Permissions required** : NONE

**Data** : `{}` (JSON)

## Success Response

**Condition** : If the Account exists.

**Code** : `200 OK`

**Content** : `{ "messageID": [integer]}`

## Error Responses

**Condition** : Non-valid JSON is sent in the message body.

**Code** : `400 BAD REQUEST`

**Content** : `{}`

## Notes

* Batch sends to be implemented
