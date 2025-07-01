# 波形图生成器

一个使用Vue3 + Node.js + Plotly.js构建的实时波形图生成器。

## 功能特性

- 🎯 **多种波形类型**: 支持正弦波、余弦波、方波、三角波、锯齿波和噪声
- 📊 **实时图表**: 使用Plotly.js绘制高质量的交互式波形图
- ⚙️ **参数调节**: 可调节频率、振幅和数据点数
- 🎨 **现代UI**: 响应式设计，美观的用户界面
- 🔄 **实时更新**: 参数变化时自动更新波形图

## 技术栈

### 前端
- Vue 3 (Composition API)
- Plotly.js (图表库)
- Axios (HTTP客户端)
- Vite (构建工具)

### 后端
- Node.js
- Express.js
- CORS (跨域支持)

## 快速开始

### 1. 安装依赖

```bash
# 安装所有依赖（包括前端和后端）
npm run install-all
```

或者分别安装：

```bash
# 安装根目录依赖
npm install

# 安装后端依赖
cd server && npm install

# 安装前端依赖
cd client && npm install
```

### 2. 启动开发服务器

```bash
# 同时启动前端和后端
npm run dev
```



### 3. 访问应用

打开浏览器访问: http://localhost:3000

## 项目结构

```
波形图/
├── package.json              # 根目录配置
├── README.md                 # 项目说明
├── server/                   # 后端代码
│   ├── package.json         # 后端依赖
│   └── index.js             # 后端服务器
└── client/                   # 前端代码
    ├── package.json         # 前端依赖
    ├── vite.config.js       # Vite配置
    ├── index.html           # HTML入口
    └── src/
        ├── main.js          # Vue应用入口
        ├── App.vue          # 主组件
        └── style.css        # 全局样式
```

## API接口

### 获取波形数据
```
GET /api/waveform?type=sine&frequency=1&amplitude=1&points=1000
```

参数：
- `type`: 波形类型 (sine, cosine, square, triangle, sawtooth, noise)
- `frequency`: 频率 (0.1-10 Hz)
- `amplitude`: 振幅 (0.1-5)
- `points`: 数据点数 (100-5000)

### 获取波形类型
```
GET /api/waveform-types
```

### 健康检查
```
GET /api/health
```

## 波形类型说明

1. **正弦波 (Sine)**: 标准的正弦函数波形
2. **余弦波 (Cosine)**: 余弦函数波形
3. **方波 (Square)**: 在最大值和最小值之间切换的矩形波形
4. **三角波 (Triangle)**: 线性上升和下降的三角形波形
5. **锯齿波 (Sawtooth)**: 线性上升后突然下降的波形
6. **噪声 (Noise)**: 随机噪声波形

## 开发说明

### 后端开发
- 服务器运行在端口 3001
- 使用Express.js框架
- 支持CORS跨域请求
- 提供RESTful API接口

### 前端开发
- 使用Vue 3 Composition API
- Plotly.js用于图表绘制
- 响应式设计，支持移动端
- 实时参数调节和图表更新

## 构建生产版本

```bash
# 构建前端
npm run build

# 启动生产服务器
cd server && npm start
```

## 许可证

MIT License 