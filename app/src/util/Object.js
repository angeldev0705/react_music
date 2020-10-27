export class ObjectUtil {
  static bytesToSize(bytes) {
    let sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 Byte';
    let i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
  }

  static merge(obj1, obj2) {
    for (let p in obj2) {
      if (obj2.hasOwnProperty(p)) {
        try {
          // Property in destination object set; update its value.
          if (obj2[p].constructor === Object) {
            obj1[p] = ObjectUtil.merge(obj1[p], obj2[p]);
          } else {
            obj1[p] = obj2[p];
          }
        } catch (e) {
          // Property in destination object not set; create it and set its value.
          obj1[p] = obj2[p];
        }
      }
    }

    return obj1;
  }

  static serialize(obj, prefix) {
    let str = [];
    for (let p in obj) {
      if (obj.hasOwnProperty(p)) {
        let k = prefix ? prefix + '[' + p + ']' : p,
          v = obj[p];
        str.push(
          typeof v === 'object'
            ? ObjectUtil.serialize(v, k)
            : encodeURIComponent(k) + '=' + encodeURIComponent(v)
        );
      }
    }
    return str.join('&');
  }
}
