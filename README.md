# solex-user-front

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).


## File structure in project.

1. config
    - /config/jenkins : dev, live, publish server.
    - /config/local : local server.
    
2. src
    - /src/assets : Not use.
    - /src/components : Components for using each view (page).
    - /src/constants : Immortal datas.
    - /src/lib : Libraries.
    - /src/mixins : Universal functions and datas.
    - /src/model : Classes for oop structure (api response data).
    - /src/plugins : Frequently used functions.
    - /src/router : Routing.
    - /src/store : Vuex codes.
    - /src/styles : Scss files for using css (styling).
    - /src/utils : Frequently used functions.
    - /src/views : Files for page. (A view in MVC pattern)
    
3. static
    - Files used for deploy.
    
4. template
    - index html file.
    
### If you want to change a environment variable, change this files.

- .env : publish
- .env.jenkins.dev : dev (auto setting)
- .env.jenkins.live : live (auto setting)
- .env.local.dev : local