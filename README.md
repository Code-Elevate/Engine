# CodeElevate Code Execution Engine

A high performance code execution engine for running code in a secure and isolated environment.

## API

### Runtimes Endpoint

`GET /api/runtimes`

This endpoint will return the supported languages along with the current version and aliases. To execute
code for a particular language using the `/api/execute` endpoint, either the name or one of the aliases must
be provided, along with the version.
Multiple versions of the same language may be present at the same time, and may be selected when running a job.

```json
HTTP/1.1 200 OK
Content-Type: application/json

[
    {
        "language": "c++",
        "version": "10.2.0",
        "aliases": [
            "cpp",
            "g++"
        ]
    },
    {
        "language": "python",
        "version": "3.12.0",
        "aliases": [
            "py",
            "py3",
            "python3",
            "python3.12"
        ]
    },
    ...
]
```

### Execute Endpoint

`POST /api/execute`

This endpoint requests execution of some arbitrary code.

- `language` (**required**) The language to use for execution, must be a string and must be installed.
- `version` (**required**) The version of the language to use for execution, must be a string containing a SemVer selector for the version or the specific version number to use.
- `files` (**required**) An array of files containing code or other data that should be used for execution. The first file in this array is considered the main file.
- `files[].name` (_optional_) The name of the file to upload, must be a string containing no path or left out.
- `files[].content` (**required**) The content of the files to upload, must be a string containing text to write.
- `files[].encoding` (_optional_) The encoding scheme used for the file content. One of `base64`, `hex` or `utf8`. Defaults to `utf8`.
- `stdin` (_optional_) The text to pass as stdin to the program. Must be a string or left out. Defaults to blank string.
- `args` (_optional_) The arguments to pass to the program. Must be an array or left out. Defaults to `[]`.
- `compile_timeout` (_optional_) The maximum time allowed for the compile stage to finish before bailing out in milliseconds. Must be a number or left out. Defaults to `10000` (10 seconds).
- `run_timeout` (_optional_) The maximum time allowed for the run stage to finish before bailing out in milliseconds. Must be a number or left out. Defaults to `3000` (3 seconds).
- `compile_memory_limit` (_optional_) The maximum amount of memory the compile stage is allowed to use in bytes. Must be a number or left out. Defaults to `-1` (no limit)
- `run_memory_limit` (_optional_) The maximum amount of memory the run stage is allowed to use in bytes. Must be a number or left out. Defaults to `-1` (no limit)

```json
{
  "language": "python",
  "version": "3.12.0",
  "files": [
    {
      "name": "main.py",
      "content": "print('Hello, World!')"
    }
  ],
  "stdin": "",
  "args": [],
  "compile_timeout": 10000,
  "run_timeout": 3000,
  "compile_memory_limit": -1,
  "run_memory_limit": -1
}
```

A typical response upon successful execution will contain 1 or 2 keys `run` and `compile`.
`compile` will only be present if the language requested requires a compile stage.

Each of these keys has an identical structure, containing both a `stdout` and `stderr` key, which is a string containing the text outputted during the stage into each buffer.
It also contains the `code` and `signal` which was returned from each process.

```json
HTTP/1.1 200 OK
Content-Type: application/json

{
    "language": "python",
    "version": "3.12.0",
    "run": {
        "stdout": "Hello, World!\n",
        "stderr": "",
        "output": "Hello, World!\n",
        "code": 0,
        "signal": null
    }
}
```

If a problem exists with the request, a `400` status code is returned and the reason in the `message` key.

```json
HTTP/1.1 400 Bad Request
Content-Type: application/json

{
    "message": "html-5.0.0 runtime is unknown"
}
```

## Supported Languages

The following runtimes are currently supported:

- dart: 2.19.6
- c: 10.2.0
- c++: 10.2.0
- go: 1.16.2
- java: 15.0.2
- javascript: 18.15.0
- perl: 5.36.0
- php: 8.2.3
- python: 3.12.0
- rscript: 4.1.1
- ruby: 3.0.1
- rust: 1.68.2
- sqlite3: 3.36.0
- swift: 5.3.3
- typescript: 5.0.3

## Deployment

This Engine is designed to be deployed as a Docker container. It is recommended to use the provided `docker-compose.yml` file to deploy the engine.

### Host System Package Dependencies

- Docker
- Docker Compose
- Node JS (>= 13, preferably >= 15)

### After system dependencies are installed, clone this repository:

```sh
git clone https://github.com/Code-Elevate/Engine
```

### Navigate to the repository

```sh
cd Engine
```

### Start the API container

```sh
docker-compose up -d api
```

The API will now be online with no language runtimes installed. To install runtimes, [use the CLI](#cli).

### CLI

The CLI is the main tool used for installing packages within engine, but also supports running code.

You can execute the cli with `cli/index.js`.

Install the CLI dependencies:

```sh
cd cli
npm install
```

#### Usage

```sh
# List all available packages
./index.js ppman list

# Install latest python
./index.js ppman install python

# Install specific version of python
./index.js ppman install python=3.12.0

# Run a python script using the latest version
echo 'print("Hello world!")' > test.py
./index.js run python test.py

# Run a python script using a specific version
echo 'print("Hello world!")' > test.py
./index.js run python test.py -l 3.12.0
./index.js run python test.py -l 3.x
./index.js run python test.py -l 3
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
