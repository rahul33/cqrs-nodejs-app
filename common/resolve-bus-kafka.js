import kafka from 'kafka-node';

const defaultOptions = {
    channel: 'DEFAULT',
    address: '127.0.0.1:2181'
};

const producer = null, consumer;

function runBroker({ address }) {
    //subSock init
    const Consumer = kafka.HighLevelConsumer;
    const client = new kafka.Client(defaultOptions.address);
    consumer = new Consumer(
        client,
        [{ topic: defaultOptions.channel, partition: 0 }],
        {
        autoCommit: true,
        fetchMaxWaitMs: 1000,
        fetchMaxBytes: 1024 * 1024,
        encoding: 'utf8',
        fromOffset: false
        }
    );

    //pubSock init
    const Producer = kafka.Producer;
    const client = new kafka.Client(defaultOptions.address);
    producer = new Producer(client);
    const kafka_topic = defaultOptions.channel;
    console.log(kafka_topic);
    let payloads = [
        {
        topic: kafka_topic,
        messages: defaultOptions.channel
        }
    ];

    //subSock bind
    try {
        consumer.on('message', async function(message) {
            console.log('here');
            console.log('kafka-> ',message.value);
        });
        consumer.on('error', function(err) {
            console.log('error', err);
        });
    } catch(e) {
        console.log(e);
    }

    //pubSock bind
    try {
        producer.on('ready', async function() {
            let push_status = producer.send(payloads, (err, data) => {
                if (err) {
                    console.log('[kafka-producer -> '+kafka_topic+']: broker update failed');
                } else {
                    console.log('[kafka-producer -> '+kafka_topic+']: broker update success');
                }
            });
        });
        producer.on('error', function(err) {
            console.log(err);
            console.log('[kafka-producer -> '+kafka_topic+']: connection errored');
            throw err;
        });
    } catch(e) {
        console.log(e);
    }

}

function getPublisher({ channel }) {
    return (event) => {
        const message = `${channel} ${event}`;
        producer.send(message);
    };
}

function buildConsumer({ channel }, trigger) {
    consumer.on('message', (message) => {
        const data = message.toString().substring(channel.length + 1);
        trigger(JSON.parse(data));
    });
}



function init(options, trigger) {
    return Promise.resolve()
        .then(() => runBroker(options))
        .catch(err => err) // Broken may not run if already started
        .then(() => {
            const publisher = getPublisher(options);
            buildConsumer(options, trigger);
            return { publisher };
        });
}

function createAdapter(options) {
    let handler = () => {};
    const config = { ...defaultOptions, ...options };
    const initPromise = init(config, event => handler(event));

    return {
        publish: event => initPromise.then(({ publisher }) => publisher(JSON.stringify(event))),
        subscribe: callback => initPromise.then(() => (handler = callback))
    };
}

export default createAdapter;