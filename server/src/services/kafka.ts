import { Consumer, Kafka, Producer } from "kafkajs";

//types
type consumetype<t> = (data: t) => Promise<t>;

const kafka: Kafka = new Kafka({
  clientId: "patchit",
  brokers:
    process.env.NODE_ENV === "prod" ? ["kafka:9092"] : ["localhost:9092"],
});

const init = async () => {
  const admin = kafka.admin();
  await admin.connect();

  console.log("admin connected");
  console.log("createing topics");

  await admin.createTopics({
    topics: [
      {
        topic: "NEW-MESSAGE",
        numPartitions: 1,
      },
    ],
  });

  console.log("topics created");
  await admin.disconnect();
  console.log("admin disconnected");
};

let producer: null | Producer = null;

const createProducer = async () => {
  if (producer) return producer;

  const _producer: Producer = kafka.producer();
  await _producer.connect();

  console.log("producer connected");

  producer = _producer;
  return producer;
};

async function getProducer<P>(topic: string, message: P): Promise<boolean> {
  const producer = await createProducer();
  try {
    const msgString = JSON.stringify(message);

    await producer.send({
      topic: topic,
      messages: [{ value: msgString }],
    });

    return true;
  } catch (err) {
    console.log("Error in kafka publishing: ", err);
    throw new Error("Error in publishing");
  }
}

async function getConsumer<T>(
  topic: string,
  group: string,
  consume: consumetype<T>
) {
  const consumer: Consumer = kafka.consumer({ groupId: group });
  await consumer.connect();
  await consumer.subscribe({ topic: topic, fromBeginning: true });
  await consumer.run({
    eachMessage: async ({ message }) => {
      if (!message.value) return;
      await consume(JSON.parse(message.value.toString()));
    },
  });
}

export { getConsumer, getProducer };
