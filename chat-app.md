# Aula Hypothetical Real Time Chat App

A succinct(with specifics in selected areas) guide, from tool choices to architecture design to team dynamics, on how to 
build a scalable real-time chat app.

## Methodology
It is beneficial to abide by a set of common maxims providing a robust foundation to base our application upon:

1. There is no **one** right way to build an application 
    * Different approaches bring different benefits and drawbacks
    * Its about strategically picking a combination which best addresses business goals from all angles

2. One should strive to be economic and efficient regardless of abundant resource availability or inexpensiveness.
    * One benefit from such an approach is inherently reduced complexity 
      * `100 servers with 1,000 connections each` vs. `2 servers with 50,000 connections apiece`.
      * The operational complexity of the latter is much more favorable.
    * Every resource that is saved by optimizing/refactoring is another resource available in times of high traffic
3. All technologies used should either not be rare or can be easily learned by competent developers
    * Current general purpose toolsets in web development and technologies already provide vast capabilities
    * Support is generally higher with general purpose technologies and more time can be focused on additional goals
    
## Business Goals
An application is desired that will provide:

###### Minimum
1. Reliable transmission of messages between users on the individual and group level
2. Effective search on  messages

###### Original assignment vaguely mentions `should offer similar functionality of whatsapp` so lets include
3. Useful feedback regarding status of transmission
4. Sharing of (limited)media
5. Push notifications

## Tools
![tool-logos](https://user-images.githubusercontent.com/44700926/48934005-02799000-ef0b-11e8-8f43-91bc0f73f36f.png)

| Command | Description |
| --- | --- |
| Cassandra | Scalable, hard to bring down NoSQL database |
| Elasticsearch(Ellasandra) | Juggernaut search provider |
| RabbitMQ | Enterprise message broker |
| NodeJS | Javascript :-) and concurrency beast |
| Socket.io | Robust WebSocket library with all-around useful features |
| Redux | Robust state manager and container |
| ReactJs | Light-weight, yet powerful view library and methodology |
| ReactNative | Lean, mean mobile version of ReactJS |

### Cassandra as DB store
#### Benefits
The benefits of Cassandra are several:
  1. Exceptionally performant 
      * Writes are especially cheap and optimized for high throughput
      * Almost all writes are equally efficient regardless of partition size
      * Achievable blazing fast reads by:
        * Ensuring even distribution
        * Designing table schemas oriented towards target queries
2. Calculable and straightforward scalability
3. Extremely resilient and fault tolerant
    * No single point of failure
    * Implemented as a masterless cluster meaning all nodes are equal
4. Column oriented
    * Short learning curve
    * Much more flexible schema design and, if done right, number of reads can be minimized

#### Model Design
Cassandra takes the unique approach of encouraging modeling the schema structure around the main application queries.

Target queries should be conceptualized ahead of time taking into account:
   
   1. Which attributes are `grouped by`
   2. Which parts of the data need ensured uniqueness
   3. Which data is ordered by specific attributes


Based on **minimum requirements** for our chat application, a majority of our data needs can be attained with these queries:

##### Primary
| Channels | Messages |
| --- | --- |
| ![select-channels](https://user-images.githubusercontent.com/44700926/48784894-417dca80-ecec-11e8-88e9-6d5cdf68e95d.png) | ![select-messages](https://user-images.githubusercontent.com/44700926/48784895-417dca80-ecec-11e8-88c3-32367422df49.png) |

##### Secondary
| Users | Users By Channel |
| --- | --- |
| ![select-users](https://user-images.githubusercontent.com/44700926/48785061-a1747100-ecec-11e8-9658-ee1c54b696b7.png) | ![select-users-by-channel](https://user-images.githubusercontent.com/44700926/48785062-a1747100-ecec-11e8-82ee-af150ef5446b.png) |


Thus, the actual layout and design of the model should accommodate the above queries.

Two main goals should be kept in mind when constructing the schema:
   1. Ensure data will be spread as evenly as possible
   2. Minimize the number of partitions needed to be read to attain the target query results
   
Due to how Cassandra is designed and internally works, the more the above two points are realized, the higher the performance 
gains and seamless scalability. This requires data denormalization since there aren't `JOIN`s in `CQL`.

The contents of the returned data can be visualized given the following schemas

##### Primary
| Channels | Messages |
| --- | --- |
| ![create-channels-by-username](https://user-images.githubusercontent.com/44700926/48785494-776f7e80-eced-11e8-9826-487478726054.png) | ![create-messages-by-channel](https://user-images.githubusercontent.com/44700926/48785497-78081500-eced-11e8-95e7-a3c93bdd85b9.png) |

##### Secondary
| Users | Users By Channel |
| --- | --- |
| ![create-users](https://user-images.githubusercontent.com/44700926/48785500-78a0ab80-eced-11e8-9562-43b4df4e4960.png) | ![create-users-by-channel](https://user-images.githubusercontent.com/44700926/48785501-78a0ab80-eced-11e8-9bd2-861caf9f5fd7.png) |

<sub>Note: Only minimum columns included in above queries for illustration purposes</sub>

### RabbitMQ
We should utilize a robust message broker in our application for two main reasons:
1. Queue database(and potentially other) tasks for workers
2. Facilitate communication(especially later) between different nodes and other consumers in our system

Why do we choose RabbitMQ and not Redis(for example)? 

Simple. 

1. To ensure message persistence as much as possible. We should not accept the `occasional message left behind`
2. RabbitMQ has matured and was developed as a message broker from the very start(as opposed to a memory database) 
3. RabbitMQ provides radically cool, builtin features
    * An acknowledgment/confirm mechanism between broker and client
    * Security layer which allows communication via SSL certificates(this can help prevent sniffing attacks)
    * Built-in priority support for messages
    * An effective routing system for directing messages to different queues

### Search
While Cassandra already comes with an effective solution([DSE Search](https://docs.datastax.com/en/dse/6.0/dse-dev/datastax_enterprise/search/searchTOC.html)), we cannot get much further than advanced search
without making significant model changes. Thus, let us use Cassandra in what it does best, fast reads and writes.

Regarding Elasticsearch, the benefits of integrating it are many:

1. Advanced search capabilities and management
2. Realtime aggregations for search
3. Notable execution speed.
4. Using integrations from other potential 3rd party tools is abundant and straightforward

Fortunately, a really good candidate tool([Ellasandra](https://github.com/strapdata/elassandra)) exists for integrating Elasticsearch into our system. 

At a basic level, Ellasandra

1. Integrates Elasticsearch with our Cassandra data store as a search engine
2. Cleanly embeds Elastsearch into our Cassandra nodes 
3. Provides an interface for search requests
4. Allows regular CQL queries to go through directly to Cassandra.

Elassandra is a good choice given the seamless integrated scaling and non-need of having to sync Cassandra 
data with a separate datastore to be used by Elasticsearch.

![image](https://user-images.githubusercontent.com/44700926/48934135-964b5c00-ef0b-11e8-96cd-e6f83d7d932f.png)

 <sub>Source: [Ellasandra Github](https://github.com/strapdata/elassandra)</sub>


### Backend runtime

NodeJS is an exceptional choice given it excels in:
1. Development ease, speed, and handling asynchrony and concurrency
2. Making effective use of streaming, callbacks, and the event loop 
3. Providing significant advantages hosting realtime applications and handling a large number of concurrent requests

#### Hardware

Many make the mistake of acquiring extensive hardware resources by overestimating the potential traffic they will need to serve.
Fortunately, NodeJS doesn't require extensive server resources and can get you a long way with very little:

> I had a University management system built with NodeJS, running on an old P4 system (Prescott 1.8ghz CPU) with 3 GB of RAM, that was able to withstand 
the barrage of request/responses during the University Exam results day (approx 500,000 students checking their results).

<sub>[source](https://www.quora.com/What-kind-of-server-do-I-need-to-use-in-a-powerful-Node-js-app)</sub>

### Socket.io
Taking an alternative approach to polling with HTTP, we can utilize the powerful concurrency capabilities NodeJS provides using WebSockets. 

The WebSocket domain has made recent gains in terms of usability and performance and is a viable contender to alternative protocols(XMPP).

Socket.io is a decent candidate as an *initial* provider given:

1. It provides exceptional client support, especially for older browsers. 
    * Socket.io resorts to(eventually) the native WebSocket if it is available
    * Uses long-polling in the worst case scenario that native WebSockets are not supported(older legacy browsers). 
    * This feature is extremely valuable since some users do not have control over which client browser they use.
2. It takes away alot of the tedious work required when working with raw WebSockets.
3. It provides robust features such as room communication. This saves us from having to implement channel communication logic.

On the downside, Socket.io is not the highest in performance which may force you to look for alternatives once a certain threshold 
is reached and extensive horizontal scaling is not an option.


### Frontend
After years of experience trying different approaches(AngularJS, Angular2, ReactJS, Vanilla), I believe ReactJS 
comes out on top as being an effective and pragmatic choice assuming the team is well-versed in using this library. 

The potential pitfalls ReactJS avoids in frontend development are: 
1. Coupled event-handling
2. Messy component composition
3. Numerous(in a bad way) ways to achieve the same thing in the same codebase 
4. Overhead in binding view code with model data and logic
5. Numerous sources of truth in the same webpage
6. Non-dry code

Regarding managing state, redux is a good choice generally since it:
1. Facilitates unidirectional data flow
2. Clean state via immutability 
3. Manages business rules while easily interconnecting(albeit manually) with other data sources (such as local storage for browsers or sqlLite for mobile) 

![redux-benefits](https://user-images.githubusercontent.com/44700926/48943020-737c7000-ef2a-11e8-9dd3-f7a741773571.png)

 <sub>Source: [React - Redux framework presentation](https://www.slideshare.net/binhqdgmail/006-react-redux-framework)</sub>

Finally, React Native allows you to compose mobile UI/UX components declaratively while maintaining performance. The best part
is the end result is a real, native mobile app and not some sort of hybrid.

## Technical Implementation

For the initial application architecture and design, it should be a straightforward manifestation using a single node backend with a 
Cassandra data store and RabbitMQ messaging queue.

#### Team Dynamics
We want to start initially with, at most, six developers, one playing as team/technical leader:

1. It is well-known(Mythical Man Month) that passed a certain threshold, adding more developers to a project may actually degrade rather than help it
2. Code quality and creatively increase when there is more direct 'ownership'

A nice but not necessarily concrete distribution can be:
1. 2 Frontend
2. 2 Backend
3. 1 Fullstack
4. 1 Teamlead

It is critical also that at least 2 of the team members are heavily **devops** leaning.

##### Role Description
###### Team Lead
  The ultimate role of the team lead is alignment. Providing clear project requirements from both business and technical
  aspects accomplishes a significant part of the effort required to conduct the team in coordination and harmony. 
  
 A team lead must pay attention to:
 1. Autonomy and how to utilize and encourage it
 2. Avoid micro-managing mentality and delegate effectively
 3. Learning how to inspire team members subconsciously and allow them to take more responsibility and ownership 
 4. All the while, make sure that the members direction is in alignment with the project goals
  
  For those whom believe that leadership roles are about authority and imposing tyranny need not apply.
  
  
  Success as a leader can be measured by team member engagement and empowerment. The trick is in finding
  methods to inspire members to move forward without being direct or commanding about it.

![team-alignment](https://user-images.githubusercontent.com/44700926/48933305-74040f00-ef08-11e8-9a90-19b15642dea6.png)

 <sub>Source: [Spotify engineering culture (part 1)](https://labs.spotify.com/2014/03/27/spotify-engineering-culture-part-1/)</sub>

###### Software Engineer 
  Besides technical competence and capability, attitude and communication play just as an important of a role. 
  
  Ultimately, we should seek members whom:
  1. Possess a 'can do' attitude and are ready to take effective ownership
  2. Can take on suitable parts of the project without having to be handheld or pushed. 
  3. Can expect to wear different hats throughout the project lifecycle based on the needs of the project. 
  
  Developers with the "I was not hired to be a QA tester or document writer" mode of thinking when these parts of the project 
  are currently in need, need not apply. 
  
  It should be noted that the team leader is also not immune from these tasks and should be he first to volunteer for such tasks(given no higher priority tasks are
  at hand).
 

#### Technical Design
##### Data Flow
Design can best be visualized by going through an actual work flow:
1. Client opens app. WebSocket and authentication handshake is made and connection is established with NodeJS backend.

| Client | Server |
| -- | -- |
| ![client-socket-connect](https://user-images.githubusercontent.com/44700926/48791627-cb349480-ecfa-11e8-8b4d-2262573efc85.png) | ![server-socket-connect](https://user-images.githubusercontent.com/44700926/48792146-24e98e80-ecfc-11e8-910e-807128d06921.png) |

2. NodeJS backend communicates with DB API to retrieve user channels and messages(last ten messages for each channel).


| CQL Get Channels | CQL Get Messages |
| -- | -- |
| ![select-channels](https://user-images.githubusercontent.com/44700926/48792479-09cb4e80-ecfd-11e8-883d-00bbb5a0c994.png) | ![select-messages-with-limit](https://user-images.githubusercontent.com/44700926/48792480-09cb4e80-ecfd-11e8-9ce2-76ef2188a076.png) |

3. NodeJS backend emits this data to user socket in the frontend.
4. NodeJS, after the response, goes through each of the users channels and subscribes their socket to a 'room' which is
the id of the channel.

    ![join-channel](https://user-images.githubusercontent.com/44700926/48818589-99501c00-ed54-11e8-9e2a-828ab8f6e103.png)

5. Frontend receives the data and handles rendering different channels with messages inside each channel.
6. Client wishes to send message to another client:
   * Client opens channel(note a channel can either be a personal conversation or a group with channel name) in chat.
   * Client composes message and hits send.
   * Socket emits to server event with message and channel id in content.
    ![emit-message-client](https://user-images.githubusercontent.com/44700926/48818590-99e8b280-ed54-11e8-87ca-d9f480af3c6a.png)
   * Socket server receives event.
   * Socket server publishes message to room with name channel id.
    ![server-broadcast-message](https://user-images.githubusercontent.com/44700926/48818591-99e8b280-ed54-11e8-9daf-d9b3b9a907df.png)
   * NodeJS adds message to DB task queue to insert message into table `messages_by_channel`.
    ![insert-message-add-to-queue](https://user-images.githubusercontent.com/44700926/48818592-99e8b280-ed54-11e8-942f-364a5d3b0324.png)
   * All sockets in room with name channel id receive new message and it is confirmed.
   * DB task worker eventually comes along to task in task queue and inserts message into DB.
    ![insert-message-worker](https://user-images.githubusercontent.com/44700926/48818593-99e8b280-ed54-11e8-98e8-442366addecc.png)
7. Client wishes to search all messages for the term `thermodynamics` because they remember a useful summarized post on the
topic from a colleague.
   * Colleague types search term into search bar in main header of app and hits `Search`
   * Socket emits to server event with search term and event type as search.
   * Socket server receives event.
   * Search query request is inserted into search task queue with reference to client socket handle.
    ![search-request](https://user-images.githubusercontent.com/44700926/48818594-9a814900-ed54-11e8-84ad-4396329673f8.png)
   * Worker comes along and processes Ellasandra request and pushes result into different `search results` queue.
    ![search-request-worker](https://user-images.githubusercontent.com/44700926/48818595-9a814900-ed54-11e8-8e1a-f255759c352a.png)
   * Sever consumes `search results` event and emits response back to client.
    ![search-result](https://user-images.githubusercontent.com/44700926/48818596-9a814900-ed54-11e8-8557-8b4faeff5b5b.png)
8. Client wishes to initiate new channel with one of their contacts
   * Client finds contact in user list and clicks the '+' button to indicate desire to send message
   * Socket emits to server event with contacts username and event type as create channel.
    ![create-channel-request](https://user-images.githubusercontent.com/44700926/48818597-9b19df80-ed54-11e8-84e5-5a672d658d5e.png)
   * Socket server receives event.
   * NodeJS adds message to DB task queue to insert channel into table `channels_by_username`.
    ![create-channel-worker](https://user-images.githubusercontent.com/44700926/48818598-9b19df80-ed54-11e8-86d7-023ba4c9b3b6.png)
   * Sever consumes `channel created` event and emits response back to client.
    ![channel-created](https://user-images.githubusercontent.com/44700926/48818599-9b19df80-ed54-11e8-8672-2bf94ae31ce3.png)
   * Client proceeds to go through 'send message' flow from #6 above after loading indicator disappears to reveal channel.
9. Client closes app
   * Socket disconnects from server
   * `disconnect` callback should be used to clean up any resources.
    
      ![disconnect](https://user-images.githubusercontent.com/44700926/48818600-9b19df80-ed54-11e8-9b61-d764ee84b7f5.png)


![architecture-diagram](https://user-images.githubusercontent.com/44700926/48943363-aa9f5100-ef2b-11e8-995a-e8284189babb.png)

### Scaling
Our scaling approach is two phases:
1. Optimizing and refactoring with limited hardware upscaling
2. Scaling out

#### Phase 1: Refactoring and Optimization
The first phase is to ensure maximum efficiency and squeeze as much as possible from your system before deciding to scale out. 
Optimizations aiming to increase concurrency is a practical approach with NodeJS and can delay the operational complexity 
from scaling out until it is needed.
 
##### NodeJS
General profiling and code reviews can prove to come a long way in removing bottlenecks or avoiding code structure mistakes.
1. Make sure your [loops are optimized](https://medium.com/tech-tajawal/loops-performances-in-node-js-9fbccf2d6aa6)
2. Make sure everything is asynchronous such as reading resources, establishing connections, etc
3. Make sure the [event loop isn't being blocked](https://nodejs.org/en/docs/guides/dont-block-the-event-loop/)
4. Make sure you are streaming everything where possible as opposed to loading and then sending
5. Make sure to [upgrade consistently](https://github.com/petkaantonov/bluebird/wiki/Optimization-killers)
 
###### Cluster
 Make use of the [cluster module](https://nodejs.org/api/cluster.html)] in NodeJS to utilize all of the CPU cores on the machine. 
 
 Instantiating child processes and workers is straightforward:
 
 ![cluster-example](https://user-images.githubusercontent.com/44700926/48819342-2c3e8580-ed58-11e8-856c-5f737c4d1647.png)

If there is going to be a large number of worker processes and high messaging throughput, it is worth checking out the [PM2](https://github.com/Unitech/PM2/)
process manager module:

1. Supports cluster mode and handles balancing between multiple processes
2. Provides robust production features such as load-balancing between different kinds of network requests
3. Auto restart/reload in the event of resource limit errors or code changes
 
###### Hardware Upscaling
 When scaling up using hardware, the key is in finding the sweet spot for the biggest performance gains before it becomes more economical
 to just add another machine.
 
 **Ram**      
  Increasing ram may prove to make significant performance increase:
  1. Increase allocated heap space for Cassandra, but avoid over-allocation which will cause garbage collection to slow down.
  2. Naturally, RabbitMQ and regular node processes should also be the biggest beneficiaries to any modest memory increase.
  
 **SSD**  
    Consider adding a [separate ssd](https://community.hortonworks.com/questions/31827/what-to-do-for-performance-tuning-of-cassandra-dat.html) dedicated to commit logs in Cassandra so that the `sstables` will be partitioned away from logs
  and enable better write performance.
    
    
##### Messages
One immediate significant improvement can be realized by reducing the load and requests on our database by changing our approach to reading the last ten messages of only the *five* most(instead of all) recent channels. 

This is just one example from a general strategy. We should reduce data demand and resource consumption by moving responsibilities around where applicable
without impacting user experience.

It is highly unlikely, for example, that users will be immediately browsing older channels so with this approach we save a significant 
amount database reads while minimally effecting the user experience.

Another modification is micro optimization on the messages themselves by using a serialization library like [MessagePack](https://msgpack.org/)
 
 ![image](https://user-images.githubusercontent.com/44700926/48938626-6ce5fc80-ef1a-11e8-919e-4975eac76d5d.png)

  <sub>Source: [MessagePack: Efficient, Cross Language Binary Object Serialization](http://www.rubyinside.com/messagepack-binary-object-serialization-3150.html)</sub>


##### RabbitMQ
 There are several steps one can take to ensure maximum performance and efficiency when working with RabbitMQ:
 1. Ensure queues are always as short as possible by ensuring faster consumption
 2. Building upon the above point, use the [Consistent Hash Exchange Plugin](https://github.com/rabbitmq/rabbitmq-consistent-hash-exchange/blob/v3.7.9/README.md) to load balance and efficiently route messages
 3. Make sure to have as many queues as there are cores in the CPU since Queues are single threaded in RabbitMQ
 4. If super quick start up time is not critical, consider enabling [RabbitMQ HiPE](https://www.cloudamqp.com/blog/2014-03-31-rabbitmq-hipe.html) which compiles RabbitMQ at startup time
 5. Modify the config to not use `detailed` mode for RabbitMQ Management statistics rate

##### WebSocket

Optimize  Websocket usage by using [sticky-session](https://github.com/indutny/sticky-session) alongside `cluster` o bridge the gab for socketio between different NodeJS processes. 

As a more [extreme alternative](https://blog.jayway.com/2015/04/13/600k-concurrent-websocket-connections-on-aws-using-node-js/), one might want to experiment with changing the WebSocket implementation if legacy client/browser support is not critical and the dev team is willing to code room/channel logic manually.

##### Frontend
Consider Redux-Saga

If we decide to take a more collaborative approach of moving data and 
business processing responsibility around, Redux-saga may help us in making the process easier and more seamless given its thread-like and pause/start capabilities:


> Redux-saga was a better bet for us. It provides high level abstraction and patterns, like debounces, retries or throttles. It leaves actions as plain objects easier to unit test, and isolate all the side-effects in nice looking sagas, leaving your Redux code pristine.

##### Capacity testing
Now that we have optimized our single node, it is helpful to gauge and get an idea of the capabilities it possesses.
[Artillery](https://artillery.io/) is a good candidate tool for load testing and obtaining performance metrics.

#### Phase 2: Scaling Out
Phase 1 optimizations will not guarantee a magical number of 1k, 5k, 10k, 20k userbase support or concurrent connections.

However, now that we have a better idea of the maximum capacity a single machine can handle, we can a little more reliably estimate 
capacity when scaling out. 

It must be noted that scaling out isn't necessarily linear in terms of improvement since other factors like 
inner network calls and resource distribution will effect some performance aspects.

In order to proceed scaling out, we need to 

1. Move RabbitMQ To A Standalone Web Server(and potential cluster)
    * This way we are capable of increasing the request load throughput
    * This way we decouple the implementation from any one server instance

2. Move Cassandra To A Cluster 
    * Cassandra is good with using commodity hardware as storage and to scale
    * Will need to install load balancer

3. Will need to configure socket channel listening to communicate via messaging broker
    * May be able to use [messaging-adapter](https://github.com/sensibill/socket.io-amqp) to help in this
    * Otherwise, will have to manually facilitate cross-node channel communication using messaging queues

![socket-distribution](https://user-images.githubusercontent.com/44700926/48950392-a717c400-ef43-11e8-94ac-4a40bd886855.png)

4. Separate server nodes themselves between socket servers and worker nodes

![revised-architecture](https://user-images.githubusercontent.com/44700926/48950462-df1f0700-ef43-11e8-8561-dbb2e552610a.png)

#### Changes To Support Development At Scale
First and foremost, install a strong monitoring system to provide as much awareness as possible. [Sentry](https://sentry.io) is a decent error-detection software.

Work extensively to enhance and automate deployment and releasing. These activities should be as simple as possible and
provide the least amount of overhead. One step is to use a deployment engine such as docker to automate and implement
an environment agnostic solution.

Also, inner concerns and components should be separated and decoupled as much as possible so that there can be different teams.
Thereafter, we can add additional members to our different teams

1. Frontend team
2. Search team
3. Chat(backend) team
4. Database and workers team
5. Devops team.

Finally, use versioning and feature toggling. 

Versioning should support 'legacy' clients and feature toggling by way of flags in code and configuration should allow for flexible dev environments and de-coupled dependencies.

### Secondary Features

As stated in the `Business Goals` section, there should be some similar functionality of whatsapp or other popular messaging applications.

#### Status of message transmission

The first step is defining different statuses. Once a message is sent, the following sequence is desired:

1. :white_check_mark: The server has received the message
2. :heavy_check_mark: The message has been persisted
3. :heavy_check_mark::heavy_check_mark: The message has been received by all clients
4. :squirrel: The message has been read by all clients

<sub>Emoji symbols picked due to limited options :wink: </sub>

We must be aware that there are numerous edge cases regarding transmission status such as what constitutes `read` or potential
edge case where users are on/offline at the time of message transmission.

Being creative, we can address most of the statuses above using a combination of callbacks, modifications to the `messages_by_channel` schema,
and using the `confirm/acknowledge` feature in RabbitMQ.

1. :white_check_mark: The simplest one. This can be emitted back to the client from our socket server once the message has been received
2. :heavy_check_mark: Upon `confirm/acknowledge` from RabbitMQ once the `insert_message` worker has completed its task, a separate signal(possibly requiring a different queue) can be given and the result emitted back to the client
3. :heavy_check_mark::heavy_check_mark: This one is a little more tricky in that we will need to add a field to our `messages_by_channel` table, `read_by` perhaps as an array of usernames. Once the number of users read is equal to the number of channel participants, this means the message has been delivered
4. :squirrel: This is similar to the above but with a twist: we will need a separate indicator calculating the number of users that opened said channel after the last message received time and once the number equals the number of participants in the channel, the message has been `read`


#### Sharing Media

As a start, we can enable media sharing in our application using these straight forward steps:

1. Integrate YAWS servers to our architecture
<sub> Or we can look into using a cloud provider such as [S3](https://aws.amazon.com/s3/) if it is more economical</sub>

2. In order to send media, the client will upload it to media servers from step 1.=

3. Upon upload confirmation the link to the media resource is provided in the response

4. The client then sends a `message` event with `type` media and the link embedded to our Socket/NodeJS app

5. Message with link is broadcast to participants in channel.

#### Push Notifications

It is best to use a third-party tool that supports sending notifications to different platforms and in different formats(APNS, GCM, MPNS/WNS).

One such library is [air-notifier](https://github.com/airnotifier/airnotifier).

Structural changes would require adding appropriate queues to our messaging broker and dedicated worker servers for push notifications.
