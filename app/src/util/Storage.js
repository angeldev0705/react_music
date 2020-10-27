import Q from 'q';
import simpleStorage from 'simplestorage.js';

export class Storage {
  static init() {}

  static set(key, value) {
    let deferred = Q.defer();
    let result = simpleStorage.set(key, value);

    setTimeout(() => {
      deferred.resolve(result);
    }, 100);

    return deferred.promise;
  }

  static get(key) {
    let deferred = Q.defer();
    let value = simpleStorage.get(key);

    setTimeout(() => {
      deferred.resolve(value);
    }, 100);
    return deferred.promise;
  }

  static deleteKey(key) {
    let deferred = Q.defer();
    let value = simpleStorage.deleteKey(key);

    setTimeout(() => {
      deferred.resolve(value);
    }, 100);
    return deferred.promise;
  }
}
