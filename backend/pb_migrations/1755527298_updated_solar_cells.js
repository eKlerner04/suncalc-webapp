/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("r9oikaughrm8cl6")

  collection.listRule = null
  collection.viewRule = null
  collection.createRule = null
  collection.updateRule = null

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("r9oikaughrm8cl6")

  collection.listRule = "@request.auth.id != \"\" || @request.auth.id = \"\""
  collection.viewRule = "@request.auth.id != \"\" || @request.auth.id = \"\""
  collection.createRule = "@request.auth.id != \"\" || @request.auth.id = \"\""
  collection.updateRule = "@request.auth.id != \"\" || @request.auth.id = \"\""

  return dao.saveCollection(collection)
})
