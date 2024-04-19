 export const webpackConfigDev = {
   mode: "development",
   entry: {
     main: "./src/js/main.js",
   },
   output: {
     filename: "[name].js",
   },
   watch: false,
   devtool: "source-map",
   module: {
     rules: [
       {
         test: /\.css$/,
         use: ["style-loader", "css-loader"],
       },
     ],
   },
 };



  export const webpackConfigProd = {
    mode: "production",
    entry: {
      main: "./src/js/main.js",
    },
    output: {
      filename: "[name].js",
    },
    watch: false,
    module: {
      rules: [
        {
          test: /\.css$/,
          use: ["style-loader", "css-loader"],
        },
      ],
      rules: [
        {
          test: /\.m?js$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: "babel-loader",
            options: {
              presets: [
                [
                  "@babel/preset-env",
                  {
                    debug: false,
                    corejs: 3,
                    useBuiltIns: "usage",
                  },
                ],
              ],
            },
          },
        },
      ],
    },
  };
