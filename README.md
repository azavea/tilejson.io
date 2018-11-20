# tilejson.io

A simple way to view, share and compare map layers.

### Requirements

* Vagrant 2.1+
* VirtualBox 5.2+
* Ansible 2.4+

### Getting Started

Install the application and all required dependencies.

```sh
./scripts/setup
```

#### Development

Start Webpack development server.

```sh
vagrant ssh
./scripts/server
```

### Ports

| Service            | Port                            |
| ------------------ | ------------------------------- |
| Webpack Dev Server | [`4567`](http://localhost:4567) |

### Testing

Lints the application source code with `eslint`.

```
./scripts/test
```

### Scripts

| Name      | Description                                        |
| --------- | -------------------------------------------------- |
| `cibuild` | Build project for CI                               |
| `console` | Run interactive shell inside application container |
| `server`  | Run Webpack development server                     |
| `setup`   | Provision Vagrant VM and run `update`              |
| `test`    | Run linters                                        |
| `update`  | Install project dependencies                       |

### Adding NPM Packages

To add a new NPM package to the project:

- manually add the package to the project's `package.json` file, ensuring that
you pin it to a specific version
- add the package to the `vendor` array in `webpack.developer.common.config.js`
or `webpack.marketing.common.config.js`
- run `./scripts/update` in the VM
- commit the changes to the following files to git: `package.json`, `yarn.lock`, and either `webpack.developer.common.config` or `webpack.marketing.common.config`
