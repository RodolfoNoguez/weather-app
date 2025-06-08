# weather-app

to make webpack work some basic steps:

1. initiallize package.json - npm init -y

2. install webpack and its dependencies:
    npm install --save-dev webpack webpack-cli webpack-dev-server html-webpack-plugin style-loader css-loader html-loader

3. add to package.json:
    "scripts": {
    "build": "webpack",
    "start": "webpack serve"
    }

4. to build project: npm run build

5. to start the deveolpemental server npm run start


