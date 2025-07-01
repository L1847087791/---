const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

// 中间件
app.use(cors());
app.use(express.json());

// 生成波形数据的函数
function generateWaveformData(type = 'sine', frequency = 1, amplitude = 1, points = 1000) {
  const data = [];
  const timeStep = 0.01;

  for (let i = 0; i < points; i++) {
    const t = i * timeStep;
    let y = 0;

    switch (type) {
      case 'sine':
        y = amplitude * Math.sin(2 * Math.PI * frequency * t);
        break;
      case 'cosine':
        y = amplitude * Math.cos(2 * Math.PI * frequency * t);
        break;
      case 'square':
        y = amplitude * Math.sign(Math.sin(2 * Math.PI * frequency * t));
        break;
      case 'triangle':
        const phase = (2 * Math.PI * frequency * t) % (2 * Math.PI);
        y = amplitude * (2 * Math.abs(phase / Math.PI - 1) - 1);
        break;
      case 'sawtooth':
        y = amplitude * (2 * ((frequency * t) % 1) - 1);
        break;
      case 'noise':
        y = amplitude * (Math.random() * 2 - 1);
        break;
      default:
        y = amplitude * Math.sin(2 * Math.PI * frequency * t);
    }

    data.push({
      x: t,
      y: y
    });
  }

  return data;
}

// API路由
app.get('/api/waveform', (req, res) => {
  const { type = 'sine', frequency = 1, amplitude = 1, points = 1000 } = req.query;

  try {
    const data = generateWaveformData(
      type,
      parseFloat(frequency),
      parseFloat(amplitude),
      parseInt(points)
    );

    res.json({
      success: true,
      data: data,
      metadata: {
        type,
        frequency: parseFloat(frequency),
        amplitude: parseFloat(amplitude),
        points: parseInt(points)
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// 获取可用的波形类型
app.get('/api/waveform-types', (req, res) => {
  res.json({
    success: true,
    types: [
      { value: 'sine', label: '正弦波' },
      { value: 'cosine', label: '余弦波' },
      { value: 'square', label: '方波' },
      { value: 'triangle', label: '三角波' },
      { value: 'sawtooth', label: '锯齿波' },
      { value: 'noise', label: '噪声' }
    ]
  });
});

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
  console.log(`波形数据API: http://localhost:${PORT}/api/waveform`);
}); 