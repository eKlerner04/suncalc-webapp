/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("r9oikaughrm8cl6")

  // remove
  collection.schema.removeField("0nnduerc")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "wwdfleqy",
    "name": "ttlDays",
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
  const collection = dao.findCollectionByNameOrId("r9oikaughrm8cl6")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "0nnduerc",
    "name": "ttlDays",
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

  // remove
  collection.schema.removeField("wwdfleqy")

  return dao.saveCollection(collection)
})
