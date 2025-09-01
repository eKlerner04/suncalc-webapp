/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("r9oikaughrm8cl6")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "k2muicw7",
    "name": "solarKey",
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
    "id": "ia0iq8qh",
    "name": "azimuth",
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
    "id": "totgodlb",
    "name": "tilt",
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
    "id": "mfb2pjoa",
    "name": "area",
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
  collection.schema.removeField("k2muicw7")

  // remove
  collection.schema.removeField("ia0iq8qh")

  // remove
  collection.schema.removeField("totgodlb")

  // remove
  collection.schema.removeField("mfb2pjoa")

  return dao.saveCollection(collection)
})
