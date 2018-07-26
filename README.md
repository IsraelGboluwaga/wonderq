# Wonder Simple Message Queue

A quick implementation of a message queue service that stores and distributes JSON messages. Messages can be configured with a limited lifetime, where if a consumer fails to confirm it completed processing the message by the end of the duration, the message is re-entered into the front of the queue.

### Prerequisites

Node.js

## Running the tests

Run TestApp/app.js in Node after the Wonder Simple Message Queue has been initialized.

Test suite with unit tests still needs to be finalized.

### End-to-end Test

The TestApp generates JSON messages with random characters and sends them at random intervals to the message queue.

It also fetches messages at random intervals from the queue (set at a slower rate), pseudo-processes them, and returns a confirmation to the service, indicating that it was successful and that the queue no longer needs to keep track of the message.

## Deployment

Navigate to the repo directory and run `node app`

## API

## Message Queue Service Endpoints

* [Send](documentation/send.md) : `POST /send/`
* [Fetch](documentation/fetch.md) : `GET /fetch/`
* [Confirm](documentation/confirm.md) : `POST /confirm/`

## State View Developer Tool - Commands

The message queue service comes with a command line tool that allows you to view the state of the service while it's running.

**Commands:**

 **queue:** View the current messages in the queue.
 
 **database:** View messages that have been persisted to the database.
 
 **pending**: View jobs that are being processed by consumers and awaiting completion, along with its remaining duration.
 
 **cmds**: Reprint the command list.
 
 **pause**: TODO

## Built With

* [Node.js](https://nodejs.org/en/)

## Authors

* **Lyle Le**


## Requirements
WonderQ - Design a simple queuing system

Look at Amazon's Simple Queuing System for some guidance (which is what we actually use): http://goo.gl/Bn8qaD

We want you to design something similar, but simpler:

WonderQ is a broker that allows multiple producers to write to it, and multiple consumers to read from it. It runs on a single server. Whenever a producer writes to WonderQ, a message ID is generated and returned as confirmation. Whenever a consumer polls WonderQ for new messages, it gets those messages which are NOT processed by any other consumer that may be concurrently accessing WonderQ.

NOTE that, when a consumer gets a set of messages, it must notify WonderQ that it has processed each message (individually). This deletes that message from the WonderQ database. If a message is received by a consumer, but NOT marked as processed within a configurable amount of time, the message then becomes available to any consumer requesting again.

**Tasks:**

• Design a module that represents WonderQ. You can abstract the logic around database storage.

• Setup a test app that will generate messages and demonstrate how WonderQ works.

• Setup a quick and dirty developer tool that can be used to show the current state of WonderQ at any time.

• Write documentation for potential API endpoints. Talk about their inputs/ outputs, formats, methods, responses, etc.

• Discuss how would you go about scaling this system to meet high-volume requests? What infrastructure / stack would you use and why?

• We'd prefer if you use Node.js and ES6/ES7 as that is what we use.


We are looking for your software design skills, use of design principles, code clarity, testability, your thinking skills and ability to add your own ideas.

