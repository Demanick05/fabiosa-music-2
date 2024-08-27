import Airtable from "airtable"

function transformString(input) {
  return input.toLowerCase().replace(/ /g, '_');
}

function transformKeys(obj) {
  const result = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const newKey = transformString(key);
      result[newKey] = obj[key];
    }
  }
  return result;
}

const isValid = (record) => {
  if (record.get('Added to web library')) {
    return true
}}

async function fetchRecords() {
  const base = new Airtable({ apiKey: 'patEkzfh9uDzj5eTE.515a621d3a35173df9d7938e521dbad26595267ba3507ffd24352467ee8ea1de' }).base('appheHTrjNkAXYc1Z');
  let Records = []

  await new Promise((resolve, reject) => {
    base('Music').select({
      // Selecting the first 3 records in Grid view:
      maxRecords: 1500,
      view: "Grid view"
    }).eachPage(function page(records, fetchNextPage) {
      const formatterRecords = records.filter(record => isValid(record)).map(record => transformKeys(record.fields))
      Records.push(...formatterRecords)
      fetchNextPage();

    },
      function done(err) {
        if (err) { reject(err)}
        else {resolve(Records)}
      });
  }
  );
  return Records;
}

export default fetchRecords; 