/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("pzqh5qtayrukdir")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "rjnegpht",
    "name": "decayCount",
    "type": "number",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "noDecimal": false
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("pzqh5qtayrukdir")

  // remove
  collection.schema.removeField("rjnegpht")

  return dao.saveCollection(collection)
})
