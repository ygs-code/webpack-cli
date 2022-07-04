class ModelsStore {
  constructor() {
    this.store = {};
  }
  get(key) {
    if(key in this.store && this.store.hasOwnProperty(key) && this.store[key]){
      return this.store[key];
    }
    this.set(key, {}); 
    return {};
  }
  set(key, value) {
    this.store = {
      ...this.store,
      [key]: value,
    };
  }
  del(key) {
    delete this.store[key];
  }
}

export default new ModelsStore();
