const { allFakers } = require("@faker-js/faker");
const { AsyncParser } = require("@json2csv/node");

const express = require("express");
const port = 3000;
const app = express();
app.use(express.json());

app.use(express.static(__dirname + "/dist"));

function generateRecord(faker) {
  const sex = faker.helpers.arrayElement(["male", "female"]);

  return {
    id: faker.database.mongodbObjectId(),
    fullName:
      faker.person.lastName(sex) +
      " " +
      faker.person.firstName(sex) +
      " " +
      faker.person.middleName(sex),
    address:
      faker.location.state() +
      ", " +
      faker.location.city() +
      ", " +
      faker.location.streetAddress({ useFullAddress: true }),
    tel: faker.phone.number(),
  };
}

function generateRecords(seed, locale, page = 1, count = 20) {
  const faker = allFakers[locale];
  faker.seed(seed + page);
  let result = [];
  for (let i = 0; i < count; i++) {
    result.push(generateRecord(faker));
  }
  return result;
}

app.get("/api/users", (req, res) => {
  const query = req.query;
  if (!("seed" in query) || !("locale" in query))
    return res.status(400).send("Missing query parameters");
  res.json(
    generateRecords(
      Number(query.seed),
      query.locale,
      Number(query.page),
      query.count
    )
  );
});

app.post("/api/users", async (req, res) => {
  res.setHeader("content-type", "text/csv");
  res.setHeader("Content-Disposition", "Users_Generated");
  const opts = {};
  const transformOpts = {};
  const asyncOpts = {};
  const parser = new AsyncParser(opts, transformOpts, asyncOpts);

  // const csv = await parser.parse(data).promise();

  // The parse method return the transform stream.
  // So data can be passed to a writable stream (a file, http request, etc.)
  const data = await req.body;
  parser.parse(data).pipe(res);
});

app.get("/*", (req, res) => {
  res.sendFile(__dirname + "/dist/index.html");
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
