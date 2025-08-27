/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("kkimjq01mhtg4ji")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "mk4phtah",
    "name": "source",
    "type": "text",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("kkimjq01mhtg4ji")

  // remove
  collection.schema.removeField("mk4phtah")

  return dao.saveCollection(collection)
})
