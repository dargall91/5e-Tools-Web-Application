# 5e Tools Web Application

"Forked" from [5e Tools](https://github.com/dargall91/5e-Tools) which housed both the Java backend API and this frontend client.

## Project setup

1. `npm install`
2. `npm install -g serve`

### Compiles and hot-reloads for development
```
npm run serve
```

### Publish Production Build:

1. `npm run build`
2. `scp -r ./dist/* username@server:./5e-Tools/5e-Tools-Web-Application`

### Run Prooduction Build

`serve -s -l 3000`

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
