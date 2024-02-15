import * as fs from "fs";

const amqp = require("amqplib/callback_api");

export class RabbtiMQService {
  amqpConn: any = null;
  pubChannel: any = null;
  offlinePubQueue: Array<any> = [];

  init() {
    this.start();
  }

  start() {
    console.log("RabbitMQ Service is starting");
    console.log("RabbitMQ URL: ", process.env.CLOUDAMQP_URL);
    amqp.connect(
      process.env.CLOUDAMQP_URL + "?heartbeat=60",
      (err: any, conn: any) => {
        if (err) {
          console.error("[AMQP]", err.message);
          return setTimeout(() => this.start(), 1000);
        }
        conn.on("error", function (err: any) {
          console.error(err);
          if (err.message !== "Connection closing") {
            console.error("[AMQP] conn error", err.message);
          }
        });
        conn.on("close", () => {
          console.error("[AMQP] reconnecting");
          return setTimeout(() => this.start(), 1000);
        });
        console.log("[AMQP] connected");
        this.amqpConn = conn;
        this.whenConnected();
      },
    );
  }

  whenConnected() {
    this.startPublisher();
    this.startWorker();
  }

  closeOnErr(err: any) {
    if (!err) return false;
    console.error("[AMQP] error", err);
    this.amqpConn.close();
    return true;
  }

  startPublisher() {
    if (this.amqpConn) {
      this.amqpConn.createConfirmChannel((err: any, ch: any) => {
        if (this.closeOnErr(err)) return;
        ch.on("error", function (err: any) {
          console.error("[AMQP] channel error", err.message);
        });
        ch.on("close", function () {
          console.log("[AMQP] channel closed");
        });

        this.pubChannel = ch;
        // TODO Ver forma de carregar ações pendentes.
        // while (true) { // Ver form
        //   // console.log("offlinePubQueue", this.offlinePubQueue);
        //   if(this.offlinePubQueue.length){            
        //     var [exchange, routingKey, content] = this.offlinePubQueue.shift();
        //     this.publish(exchange, routingKey, content);
        //   }
        // }
      });
    }
  }

  publish(exchange: any, routingKey: any, content: any) {
    if (!this.pubChannel) throw new Error("PubChannel is not initialized");

    try {
      this.pubChannel.publish(
        exchange,
        routingKey,
        content,
        { persistent: true },
        (err: any, ok: any) => {
          if (err) {
            console.error("[AMQP] publish error: ", err);
            this.offlinePubQueue.push([exchange, routingKey, content]);
            this.pubChannel.connection.close();
          }
        },
      );
    } catch (e: any) {
      console.error("[AMQP] publish call error: ", e.message);
      this.offlinePubQueue.push([exchange, routingKey, content]);
    }
  }

  // A worker that acks messages only if processed successfully
  startWorker() {
    this.amqpConn.createChannel((err: any, ch: any) => {
      if (this.closeOnErr(err)) return;
      ch.on("error", function (err: any) {
        console.error("[AMQP] channel error", err.message);
      });
      ch.on("close", function () {
        console.log("[AMQP] channel closed");
      });

      ch.prefetch(10);
      ch.assertQueue("jobs", { durable: true }, (err: any, _ok: any) => {
        if (this.closeOnErr(err)) return;
        ch.consume("jobs", (msg: any) => this.processMsg(msg, ch), {
          noAck: false,
        });
        console.log("Worker is started");
      });
    });
  }

  processMsg(msg: any, ch: any) {
    this.work(msg, (ok: any) => {
      try {
        if (ok) ch.ack(msg);
        else ch.reject(msg, true);
      } catch (e) {
        this.closeOnErr(e);
      }
    });
  }

  work(msg: any, cb: any) {
    const content = msg.content.toString();
    console.log("PDF processing of ", content);
    fs.writeFileSync(`./reports/${content}.pdf`, content);
    cb(true);
  }
}

export const rabbitMQServiceInstance = new RabbtiMQService();
