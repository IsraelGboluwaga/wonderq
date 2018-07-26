# Confirm Message Processed

Sends a confirmation to the Wonder Simple Message Queue Service indicating that the fetched message was successfully processed. One or more messages ID's can be confirmed at a time.

**URL** : `/confirm/`

**Method** : `POST`

**Auth required** : NO (for now)

**Permissions required** : NONE

**Data** : `{ "messageID": null, "messageID": null, ...}` (JSON)

## Success Response

**Condition** : If the message exists, was previously fetched, and hasn't expired yet.

**Code** : `200 OK`

**Content** : `{ }`

## Error Responses

**Condition** : Invalid message ID is used.

**Code** : `400 BAD REQUEST`

**Content** : `{}`
