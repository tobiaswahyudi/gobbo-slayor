const PROGRESS_KEY =
  "what are you snooping around for? you some kind of pervert?";

class GameProgress {
  constructor() {
    this.progress = {};

    for (const zoneId in ZONE_LEVELS) {
      this.progress[zoneId] = {};
      for (const level of ZONE_LEVELS[zoneId].levels) {
        this.progress[zoneId][level.id] = {
          completed: false,
          bestMoves: Infinity,
        };
      }
    }

    this.loadProgress();
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
    return this.progress[zoneId][levelId];
  }

  setProgress(zoneId, levelId, moves) {
    this.progress[zoneId][levelId].completed = true;
    this.progress[zoneId][levelId].bestMoves = Math.min(
      this.progress[zoneId][levelId].bestMoves,
      moves
    );
    this.saveProgress();
  }
}
