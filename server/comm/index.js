import Comm from './comm'

// keep just one instance
Comm.instance = null
Comm.getInstance = function() {
  if (this.instance == null) {
    this.instance = new Comm("FTDI")
  }
  return this.instance
}
export default Comm.getInstance()
