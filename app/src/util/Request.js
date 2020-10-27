import { Config } from '../Config';
import superagent from 'superagent';
import { Auth } from '../middleware/Auth';
import Q from 'q';

export class Request {
  static requests = {};

  static init() {}

  static abort(id) {
    if (Request.requests[id]) {
      Request.requests[id].abort();
    }
  }

  static getFullPath(path) {
    return path.indexOf('http') !== -1 ? path : Config.server.url + '/' + path;
  }

  static getParams(params = {}, config = {}) {
    if (config.secure) {
      let accessToken = Auth.getAccessToken();
      if (accessToken) {
        params[Auth.queryName] = accessToken;
      }
    }

    return params;
  }

  static post(path, params = {}, id = null, config = {}) {
    if (id) {
      Request.abort(id);
    }

    let deferred = Q.defer();
    let request = superagent
      .post(this.getFullPath(path))
      .type('form')
      .send(this.getParams(params, config))
      .accept('json')
      .end((err, res) => {
        res = res || {};
        if (err) {
          deferred.reject(res.body, { status: res.status || 0 });
        } else {
          deferred.resolve(res.body);
        }
      });

    if (id) {
      Request.requests[id] = request;
    }

    return deferred.promise;
  }

  static get(path, id = null, params = {}, config = {}) {
    if (id) {
      Request.abort(id);
    }

    let deferred = Q.defer();
    let request = superagent
      .get(this.getFullPath(path))
      .query(this.getParams(params, config))
      .accept('json')
      .end((err, res) => {
        res = res || {};
        if (err) {
          deferred.reject(res.body, { status: res.status || 0 });
        } else {
          deferred.resolve(res.body);
        }
      });

    if (id) {
      Request.requests[id] = request;
    }

    return deferred.promise;
  }

  static put(path, params = {}, id = null, config = {}) {
    if (id) {
      Request.abort(id);
    }

    let deferred = Q.defer();
    let request = superagent
      .put(this.getFullPath(path))
      .type('form')
      .send(this.getParams(params, config))
      .accept('json')
      .end((err, res) => {
        res = res || {};
        if (err) {
          deferred.reject(res.body, { status: res.status || 0 });
        } else {
          deferred.resolve(res.body);
        }
      });

    if (id) {
      Request.requests[id] = request;
    }
    return deferred.promise;
  }

  static delete(path, params = {}, id = null, config = {}) {
    if (id) {
      Request.abort(id);
    }

    let deferred = Q.defer();
    let request = superagent
      .del(this.getFullPath(path))
      .query(this.getParams(params, config))
      .accept('json')
      .end((err, res) => {
        res = res || {};
        if (err) {
          deferred.reject(res.body, { status: res.status || 0 });
        } else {
          deferred.resolve(res.body);
        }
      });

    if (id) {
      Request.requests[id] = request;
    }

    return deferred.promise;
  }
}
