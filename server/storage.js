import Store from 'jfs'
import Promise from 'bluebird'
import _ from 'lodash'

class Storage {
  constructor() {
    this.db = Promise.promisifyAll(new Store("data", { pretty: true }))
    this.status = {}
  }

  index(type) {
    return this.getData(type)
  }

  show(type, id) {
    return this.getData(type)
      .then(json => {
        if (!json[id]) {
          return {}
        }
        return json[id]
      })
  }

  update(type, id, data) {
    return this.getData(type)
      .then((json) => {
        json[id] = _.assign(json[id] || {}, data)
        return this.saveData(type, json)
          .then(() => json[id])
      })
  }

  saveData(type, json) {
    if (type == 'status') {
      this.status = json
      return Promise.resolve(json)
    } else {
      return this.db.saveAsync(type, json)
        .then(() => json)
    }
  }

  // if there is exception, just return empty json
  getData(type) {
    let p
    if (type == 'status') {
      p = Promise.resolve(this.status)
    } else {
      p = this.db.getAsync(type)
    }
    return p.then(json => json)
      .catch(e => {
        console.log('data loading error:', type, e)
        return {}
      })
  }
}

Storage.instance = null
Storage.getInstance = function() {
  if (this.instance == null) {
    this.instance = new Storage()
  }
  return this.instance
}
export default Storage.getInstance()
