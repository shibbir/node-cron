import { Queue, Worker } from 'bullmq';
import IORedis from 'ioredis';

const connection = new IORedis();

const myQueue = new Queue('foo', { connection });

async function addJobs() {
    await myQueue.add('myJobName', { foo: 'bar' });
    await myQueue.add('myJobName', { qux: 'baz' });
}

await addJobs();

const worker = new Worker('foo', async job => {
    console.log(job.data);
}, { connection });

worker.on('completed', job => {
    console.log(`${job.id} has completed!`);
});

worker.on('failed', (job, err) => {
    console.log(`${job.id} has failed with ${err.message}`);
});
