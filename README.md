![SIZE](https://img.shields.io/github/languages/code-size/ngyngcphu/elearning-system)
![FILE](https://img.shields.io/github/directory-file-count/ngyngcphu/elearning-system)
![LANG](https://img.shields.io/github/languages/count/ngyngcphu/elearning-system)
![formatter: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)
![CI](https://github.com/ngyngcphu/elearning-system/actions/workflows/ci.yml/badge.svg)
![CD](https://github.com/ngyngcphu/elearning-system/actions/workflows/release.yml/badge.svg)

<div align="center">
  <a href="https://github.com/ngyngcphu/elearning-system">
    <img src="public/elearning-logo.png" alt="Logo" width="80" height="80">
  </a>

<h1 align="center">Elearning System</h1>

</div>


## About the Project
This is front-end of Elearning System. See [Document](https://github.com/ngyngcphu/elearning-system/tree/main/docs) and [Back-end](https://github.com/hoangluong202/Database_231) for more details about our project.

## Technical stacks
- ReactJS
- ViteJS
- TailwindCSS
- Material Tailwind
- Zustand
- React Query
- React Table
- Docker

## Prerequisites
- `node` v18.15.0
- `yarn` v1.22.19

or if you installed [Docker Engine](https://docs.docker.com/engine/install/):
- `docker` v23.0.1
- `docker compose` v2.16.0

**NOTE**: Fill in `.env` file (use template from `.env.example`) before installing.

## Installation with yarn

1. Install dependencies

```sh
yarn install
```

2. Start project:

```sh
yarn start
```

## Installation with docker

1. Pull image:

```sh
docker pull ghcr.io/ngyngcphu/elearning-system:latest
```

2. Run container:

```sh
docker compose up -d elearning-system
```

## Project structure

```py
📦src
 ┣ 📂assets                     # All assets such as jpg, svg, icon ... goes here
 ┣ 📂components                 # Reusable components across the web page
 ┣ 📂constants                  # Constants and routes name
 ┣ 📂hooks                      # Contain all custom hooks
 ┣ 📂interfaces                 # Interfaces of class, function ...
 ┣ 📂layouts                    # Contain different layouts of project
 ┣ 📂pages                      # Screen components
 ┣ 📂services                   # Action to call api from server
 ┣ 📂states                     # Global states
 ┣ 📂types                      # Types for variables, objects ...
 ┣ 📂utils                      # connect to URL server
 ┣ 📜App.tsx                    # App component
 ┗ 📜main.tsx                   # Program entry
 ┗ 📜index.css                  # config tailwindcss
```
## Project configurations

### Code linting & formating

We use [`eslint`](https://eslint.org/) to find and fix problem in code, such as:

- Unused variables
- Use `var` declaration
- Loosely comparation using `==`
- ...

You can run this command to test eslint script:

```bash
yarn lint
```

To maintain only one style coding across members, we use [`prettier`](https://prettier.io/). Try:

```bash
yarn format
```

You don't need to run these scripts regularly or before commiting code. They are run automatically before `git commit` command by setting as a precommit script. In some circumstances, precommit script is not enabled by default, just type two commands below to fix it:

```bash
chmod ug+x .husky/*
chmod ug+x .git/hooks/*
```

### Barrelsby & Path alias

With configurations in `.barrelsby.json`, barrelsby can import your entire code base in a specific folder, and re-export them in `index.ts` file.  
Try this:

```sh
yarn barrels
```

To avoid using many `..` in relative path, config path alias in `tsconfig.json`. See the guideline [here](https://www.typescriptlang.org/docs/handbook/module-resolution.html#path-mapping).

## Git working culture

- For every updates, DO NOT push directly to `main` branch. Create a new branch, commit, publish branch and create a pull request (PR) instead.
- A branch should have prefix `feature/` for a feature update, prefix `hotfix/` for a hotfix, `test/` for a testing ...
- A PR should be small enough to review. To split a large PR, use [stacked PRs](https://blog.logrocket.com/using-stacked-pull-requests-in-github/).