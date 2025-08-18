/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("r9oikaughrm8cl6")

  collection.listRule = ""
  collection.viewRule = ""
  collection.createRule = ""
  collection.updateRule = ""

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("r9oikaughrm8cl6")

  collection.listRule = "@request.auth.id != \"\" || @request.auth.role = \"admin\""
  collection.viewRule = "@request.auth.id != \"\" || @request.auth.role = \"admin\""
  collection.createRule = "@request.auth.id != \"\" || @request.auth.role = \"admin\""
  collection.updateRule = "@request.auth.id != \"\" || @request.auth.role = \"admin\""

  return dao.saveCollection(collection)
})
