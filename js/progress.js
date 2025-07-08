const PROGRESS_KEY = "what are you snooping around for? you some kind of pervert?";

class GameProgress {
  constructor() {
    this.progress = {};

    for (const zoneId in ZONE_LEVELS) {
      this.progress[zoneId] = {};
      for (const levelId in ZONE_LEVELS[zoneId].levels) {
        this.progress[zoneId][levelId] = 0;
      }
    }
  }

  saveProgress() {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(this.progress));
  }

  loadProgress() {
    const progressString = localStorage.getItem(PROGRESS_KEY);
    if (progressString) {
      this.progress = JSON.parse(progressString);
    }
  }

  getProgress(zoneId, levelId) {
    return this.progress[zoneId]?.[levelId] || 0;
  }
