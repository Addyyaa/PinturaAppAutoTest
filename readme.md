解决js文件编译报错的命令：
tsc test/src/common/common.ts --outDir test/src/common --module esnext --resolveJsonModule --esModuleInterop --moduleResolution node --skipLibCheck


1. `--module esnext`: 支持 JSON import assertions
2. `--resolveJsonModule`: 支持 JSON import assertions
3. `--esModuleInterop`: 支持 ES6 模块导入
4. `--moduleResolution node`: 使用 Node.js 的模块解析策略
5. `--skipLibCheck`: 跳过库检查
