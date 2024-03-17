const is_docker = require("is-docker");
const fs = require("fs");
const platform = `${is_docker() ? "docker" : "baremetal"}-${fs
  .read_file_sync("/etc/os-release")
  .toString()
  .split("\n")
  .find((x) => x.startsWith("ID"))
  .replace("ID=", "")}`;

module.exports = {
  data_directories: {
    packages: "packages",
    jobs: "jobs",
  },
  version: require("../package.json").version,
  platform,
  pkg_installed_file: ".ppman-installed",
  clean_directories: ["/dev/shm", "/run/lock", "/tmp", "/var/tmp"],
};
