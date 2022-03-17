const Router = require('@koa/router');
const mongoose = require('mongoose');
const { getBody } = require('../../helpers/utils/index')

const BOOK_CONST = {
  IN: 'IN_COUNT',
  OUT: 'OUT_COUNT'
}

const Book = mongoose.model('Book');
const InventoryLog = mongoose.model('InventoryLog')

const findBookOne = async (id) =>{
  const one = Book.findOne({
    _id: id,
  }).exec();

  return one;
}

const router = new Router({
  prefix: '/book'
});

router.post('/add', async(ctx) => {
  const {
    name,
    price,
    author,
    publishDate,
    classify,
    count
  } = getBody(ctx);

  const book = new Book({
    name,
    price,
    author,
    publishDate,
    classify,
    count
  });

  const res = await book.save();

  ctx.body = {
    data: res,
    code: 1,
    msg: '添加成功'
  }
});

router.get('/list', async(ctx) => {
  //拿到url中的分页数据
  //https://aa.cc.com/user?page=2&size=20&#gdsahj
  const {
    page = 1,
    keyword = ''
  } = ctx.query;
  
  let {
    size = 10,
  } = ctx.query;
  size = Number(size);

  const query = {};

  if(keyword) {
    query.name = keyword
  }

  const list = await Book
    .find(query)
    .sort({
      _id: -1,
    })
    .skip((page - 1) * size)
    .limit(size)
    .exec();

  const total = await Book.countDocuments();
  
  ctx.body = {
    data: {
      total,
      list,
      page,
      size
    },
    code: 1,
    msg: '获取列表成功'
  }
})

router.delete('/:id', async (ctx) => {
  const {
    id
  } = ctx.params;

  const delMsg = await Book.deleteOne({
    _id: id
  });

  ctx.body = {
    data: delMsg,
    msg: '删除成功',
    code: 1
  }
});

router.post('/update/count', async (ctx) => {
  const {
    id,
    type
  } = ctx.request.body;
  let {
    num 
  } = ctx.request.body;

  num = Number(num);

  const book = await findBookOne(id);

  if(!book) {
    ctx.body = {
      code: 0,
      msg: '没有找到书籍'
    }
    return;
  }

  //找到了书
  if(type === BOOK_CONST.IN) {
    //入库操作
    num = Math.abs(num);
  }else {
    // 出库操作
    num = -Math.abs(num)
  }

  book.count = book.count + num;

  if(book.count < 0) {
    ctx.body = {
      code: 0,
      msg: '剩下的量不足以出库'
    };
    return;
  };

  const res =  await book.save();

  const log = new InventoryLog({
    num: Math.abs(num),
    type
  });

  log.save();

  ctx.body = {
    data: res,
    code: 1,
    msg: '操作成功'
  }
})

router.post('/update', async (ctx) => {
  const {
    id,
    // name,
    // price,
    // author,
    // publishDate,
    // classify
    ...others
  } = ctx.request.body;

  const one = await findBookOne(id);

  //没有找到书
  if(!one) {
    ctx.body = {
      msg: '没有找到书籍',
      code: 0
    }
    return;
  }

  const newQuery = {};

  Object.entries(others).forEach(([key, value]) => {
    if(value) {
      newQuery[key] = value;
    };
  });
  Object.assign(one, newQuery);

  const res = await one.save();

  ctx.body = {
    code: 1,
    data: res,
    msg: '保存成功'
  }
});

router.get('/detail/:id', async (ctx) => {
  const {
    id
  } = ctx.params;

  const one = await findBookOne(id);

  // 没有找到书
  if(!one) {
    ctx.body = {
      code: 0,
      msg: '没有找到书籍'
    };
    return;
  }

  ctx.body = {
    msg: "查询成功",
    code: 1,
    data: one
  }
})

module.exports = router;