/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("r9oikaughrm8cl6")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "8ajofpge",
    "name": "accessCount",
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

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "q1xapkob",
    "name": "popularityScore",
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

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "cbsaje7h",
    "name": "isHot",
    "type": "bool",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {}
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "vypvngdp",
    "name": "locationWeight",
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

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "pgygpobn",
    "name": "recencyBonus",
    "type": "number",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": 0,
      "max": 3,
      "noDecimal": false
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("r9oikaughrm8cl6")

  // remove
  collection.schema.removeField("8ajofpge")

  // remove
  collection.schema.removeField("q1xapkob")

  // remove
  collection.schema.removeField("cbsaje7h")

  // remove
  collection.schema.removeField("vypvngdp")

  // remove
  collection.schema.removeField("pgygpobn")

  return dao.saveCollection(collection)
})
