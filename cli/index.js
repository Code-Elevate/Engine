#!/usr/bin/env node

require("nocamel");
const axios = require("axios").default;

const axios_instance = (argv) => {
  argv.axios = axios.create({
    baseURL: argv["engine-url"],
    headers: {
      "Content-Type": "application/json",
    },
  });

  return argv;
};

require("yargs")(process.argv.slice(2))
  .option("engine-url", {
    alias: ["u"],
    default: "http://127.0.0.1:2000",
    desc: "Engine API URL",
    string: true,
  })
  .middleware(axios_instance)
  .scriptName("engine")
  .commandDir("commands")
  .demandCommand()
  .help()
  .wrap(72).argv;
