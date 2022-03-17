const getMata = () => {
  return{
    createdAt: {
      type: Number,
      default: (new Date()).getTime(),
    },
   updateAt: {
     type: Number,
     default: (new Date()).getTime()
   }
  }
}

const preSave = function(next) {
  if(this.isNew) {
    const ts = Date.now();

    this['meta'].createdAt = ts;
    this['meta'].updateAt = ts;
  }else {
    this['meta'].updateAt = Date.now()
  }

  next();
}

module.exports = {
  getMata,
  preSave
}