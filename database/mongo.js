(async () => {
  const { MongoClient: MongoDB } = require("mongodb");
  const client = new MongoDB("mongodb://localhost:27017", {
    useNewUrlParser: true,
  });
  let ret;

  ret = await client.connect();
  const db = client.db('test')
  const fruits = db.collection('fruits')
  ret = await fruits.insertOne({
      name: '芒果',
      price: 0.1
  })
  ret = await fruits.findOne()

  ret = await fruits.updateOne({name: '芒果'}, {
      $set: {
          name: '苹果'
      }
  })

  ret = await fruits.deleteOne({name: '苹果'})
  console.log('ret:', ret)
})();
