/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("r9oikaughrm8cl6")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "rvyqqj2k",
    "name": "lastDecayAt",
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

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "a7imxgwl",
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
  const collection = dao.findCollectionByNameOrId("r9oikaughrm8cl6")

  // remove
  collection.schema.removeField("rvyqqj2k")

  // remove
  collection.schema.removeField("a7imxgwl")

  return dao.saveCollection(collection)
})
