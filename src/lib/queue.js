
import Bee from 'bee-queue';
import WelcomeJob from '../app/job/WelcomeMail';
import redisConfig from '../config/redis';
import AnswerJob from '../app/job/AnswerMail';

const jobs = [WelcomeJob, AnswerJob];

class Queue {
  constructor() {
    this.queues = {};

    this.init();
  }

  init() {
    jobs.forEach(({ key, handle }) => {
      this.queues[key] = {
        bee: new Bee(key, {
          redis: redisConfig
        }),
        handle
      }
    });
  }

  add(queue, job) {
    return this.queues[queue.key].bee.createJob(job).save();
  }

  processQueue() {
    jobs.forEach(job => {
      const { bee, handle } = this.queues[job.key];

      bee.on('failed', this.handleFailure).process(handle);
    });
  }

  handleFailure(job, err) {
    console.log(`Queue ${job.queue.name}: FAILED`, err);
  }
}

export default new Queue();
