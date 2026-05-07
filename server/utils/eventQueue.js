const Click = require('../models/Click');

class EventQueue {
  constructor() {
    this.queue = [];
    this.isProcessing = false;
    this.processInterval = 2000; // 2 seconds
    
    // Start background processor
    setInterval(() => this.process(), this.processInterval);
  }

  async addClick(clickData) {
    this.queue.push(clickData);
    console.log(`[Queue] Click added. Current size: ${this.queue.length}`);
  }

  async process() {
    if (this.isProcessing || this.queue.length === 0) return;
    
    this.isProcessing = true;
    const batch = [...this.queue];
    this.queue = [];

    try {
      console.log(`[Queue] Processing batch of ${batch.length} events...`);
      await Click.insertMany(batch);
      console.log(`[Queue] Successfully processed ${batch.length} events.`);
    } catch (err) {
      console.error('[Queue] Error processing batch:', err);
      // Re-add to queue for retry
      this.queue.push(...batch);
    } finally {
      this.isProcessing = false;
    }
  }
}

module.exports = new EventQueue();
