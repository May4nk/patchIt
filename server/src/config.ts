import { Consumer, Kafka, Producer } from "kafkajs";

const kafka = new Kafka({
  clientId: "patchit",
  brokers: ["kafka1:9092"]
});

let producer: null | Producer = null;

const createProducer = async() => {
  if (producer) return producer;

  const _producer: Producer = kafka.producer()
  await _producer.connect();

  producer = _producer;

  return producer;  
}

export const getProducer: (topic: string, message: string) => Promise<boolean>= async(topic: string, message: string) => {
  const producer = await createProducer();
  await producer.send({
    topic: topic,
    messages: [
      { value: message },
    ],
  })
  
  return true;
}

export const getConsumer = async(topic: string) => {
  const consumer: Consumer = kafka.consumer({ groupId: 'test-group' })
  
  await consumer.connect()
  await consumer.subscribe({ topic: topic, fromBeginning: true })
  
  await consumer.run({
    eachMessage: async ({ message }) => {
      console.log({
        value: message?.value?.toString(),
      })
    },
  })
}