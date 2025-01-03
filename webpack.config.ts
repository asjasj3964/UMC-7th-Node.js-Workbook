import path from 'path';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import webpack from 'webpack';

const config: webpack.Configuration = {
  entry: './src/index.ts', // TypeScript 엔트리 파일
  output: {
    path: path.resolve(__dirname, 'dist'), // 출력 디렉토리
    filename: 'server.js', // 출력 파일 이름
  },
  target: 'node', // Node.js 환경을 타겟으로 설정
  mode: 'production', // 프로덕션 모드
  resolve: {
    extensions: ['.ts', '.js'], // TypeScript와 JavaScript 파일 처리
  },
  module: {
    rules: [
      {
        test: /\.ts$/, // TypeScript 파일을 처리
        use: 'ts-loader',
        exclude: /node_modules/, // node_modules 제외
      },
    ],
  },
  node: {
    __dirname: false, // __dirname의 실제 경로 유지
    __filename: false,
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        { from: './node_modules/swagger-ui-dist/swagger-ui.css', to: 'swagger-ui/' },
        { from: './node_modules/swagger-ui-dist/swagger-ui-bundle.js', to: 'swagger-ui/' },
        { from: './node_modules/swagger-ui-dist/swagger-ui-standalone-preset.js', to: 'swagger-ui/' },
        { from: './node_modules/swagger-ui-dist/favicon-16x16.png', to: 'swagger-ui/' },
        { from: './node_modules/swagger-ui-dist/favicon-32x32.png', to: 'swagger-ui/' },
      ],
    }),
  ],
};

export default config;