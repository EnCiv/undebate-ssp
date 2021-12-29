# Events Dirctory

Within the server, components can listen for and generate events. Each file in the events directory represents an event listener, and can define the name of an Event.

To create an event listener create a file in app/events like this:

```
import { serverEvents } from 'civil-server'

function eventListener(p1,p2,...){
 ...
}

serverEvents.on(serverEvents.eNames.EventName, eventListener)

```

In the code that is going to generate the event, do this:

```
import { Iota, serverEvents } from 'civil-server'

serverEvents.eNameAdd('EventName')

serverEvents.emit(serverEvents.eNames.EventName, p1, p2, ...)
```

All the files in the events directory are required at the end of the server startup process. So code the generates events, typically in socket-apis will be loaded first.
