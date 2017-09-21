# tilejson.io

A webapp to view and share tiles

### Requirements

* Vagrant 1.8+
* VirtualBox 4.3
* Ansible 2.1+

### Getting Started

Install the application and all required dependencies.

```sh
./scripts/setup.sh
```

#### Development

Rebuild Docker images and run application.

```sh
vagrant up
vagrant ssh
./scripts/update.sh
./scripts/server.sh
```

### Ports

| Service            | Port                            |
| ------------------ | ------------------------------- |
| Webpack Dev Server | [`4567`](http://localhost:4567) |

### Testing

```
./scripts/test.sh
```

### Scripts

| Name           | Description                                                   |
| -------------- | ------------------------------------------------------------- |
| `cibuild.sh`   | Build project for CI                                          |
| `clean.sh`     | Free disk space by cleaning up dangling Docker images         |
| `console.sh`   | Run interactive shell inside application container            |
| `lint.sh`      | Lint source code                                              |
| `server.sh`    | Run Docker Compose services                                   |
| `setup.sh`     | Provision Vagrant VM and run `update.sh`                      |
| `test.sh`      | Run unit tests                                                |
| `update.sh`    | Build Docker images                                           |

### Docker

Here is a list of useful commands that you can run inside the VM.

- `docker images` will show you a list of all your VM's installed images
- `docker rmi <IMAGE-NAME>` will delete the specified image
- `docker run -it usace-program-analysis-react /bin/sh` will log you into the `usace-program-analysis-react` image's shell
- `docker-compose up` will build and start containers according to the instructions in `docker-compose.yml` file
- `docker-compose ps` will show you a list of running containers
- `docker-compose down` will halt these running containers
- `docker-compose build` will rebuild all containers listed in the `docker-compose.yml` file
- `docker-compose build react` will rebuild only the react container per instructions listed in `docker-compose.yml`
- `docker-compose exec <SERVICE> /bin/sh` where `<SERVICE>` is a service name specified in `docker-compose.yml` will open a shell to a currently running container.

See the
[docker](https://docs.docker.com/engine/reference/commandline/) and
[docker-compose](https://docs.docker.com/compose/reference/overview/)
 command line reference guides for more information.

### Adding NPM Packages

To add a new NPM package to the project:

- manually add the package to the project's `package.json` file, ensuring that
you pin it to a specific version
- add the package to the `vendor` array in `webpack.developer.common.config.js`
or `webpack.marketing.common.config.js`
- run `./scripts/update.sh` in the VM
- commit the changes to the following files to git: `package.json`, `yarn.lock`, and either `webpack.developer.common.config` or `webpack.marketing.common.config`

#### Notes

* We usually pin packages to a specific version to minimize build errors.
* For packages in the regular/non-dev dependencies section of `package.json`,
  manually add the package name to the `vendor` array in `webpack.config.json`
