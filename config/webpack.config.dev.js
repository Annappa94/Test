const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const mf = require("@angular-architects/module-federation/webpack");
const path = require("path");

const customRequired = require("esm")(module);
const env= customRequired("../src/environments/environment.dev.ts")
const  common = customRequired("./webpack.common.js")

const sharedMappings = new mf.SharedMappings();
sharedMappings.register(
  path.join(__dirname, '../tsconfig.json'),
);
console.log(env);
module.exports ={
    output: {
      uniqueName: "resha-farms",
      publicPath: env.environment.uiUrl+'/'
    },
    optimization: {
      runtimeChunk: false
    },  
    resolve: {
      alias: {
        ...sharedMappings.getAliases(),
      }
    },
    experiments: {
      outputModule: true
    },  
    plugins: [
      new ModuleFederationPlugin({
          library: { type: "module" },
  
          name: "resha-farms",
          filename: "remoteEntry.js",  // 2-3K w/ Meta Data
          exposes: {
              './Module': '/src/app/app.farms.module.ts',
          },
          shared: {
            ...common.sharedLib,
            ...sharedMappings.getDescriptors()
          }
          
      }),
      // Uncomment for sharing lib of an Angular CLI or Nx workspace
      sharedMappings.getPlugin(),
    ],
  };