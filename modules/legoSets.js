const setData = require("../data/setData");
const themeData = require("../data/themeData");

class LegoData {
  constructor() {
    this.sets = [];
  }

  initialize() {
    return new Promise((resolve, reject) => {
      try {
        setData.forEach(set => {
          const theme = themeData.find(t => t.id === set.theme_id);
          this.sets.push({
            ...set,
            theme: theme ? theme.name : "Unknown"
          });
        });
        resolve();
      } catch (err) {
        reject("Failed to initialize data");
      }
    });
  }

  getAllSets() {
    return new Promise((resolve, reject) => {
      if (this.sets.length > 0) {
        resolve(this.sets);
      } else {
        reject("No sets available");
      }
    });
  }

  getSetByNum(setNum) {
    return new Promise((resolve, reject) => {
      const foundSet = this.sets.find(set => set.set_num === setNum);
      if (foundSet) {
        resolve(foundSet);
      } else {
        reject(`Unable to find set: ${setNum}`);
      }
    });
  }

  getSetsByTheme(theme) {
    return new Promise((resolve, reject) => {
      const matches = this.sets.filter(set =>
        set.theme.toLowerCase().includes(theme.toLowerCase())
      );
      if (matches.length > 0) {
        resolve(matches);
      } else {
        reject(`Unable to find sets with theme: ${theme}`);
      }
    });
  }

  addSet(newSet) {
    return new Promise((resolve, reject) => {
      const exists = this.sets.some(set => set.set_num === newSet.set_num);
      if (exists) {
        reject("Set already exists");
      } else {
        const theme = themeData.find(t => t.id === newSet.theme_id);
        this.sets.push({
          ...newSet,
          theme: theme ? theme.name : "Unknown"
        });
        resolve();
      }
    });
  }
}

module.exports = LegoData;
