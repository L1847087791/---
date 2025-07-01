<template>
  <div class="container">
    <div class="header">
      <h1>波形图生成器</h1>
      <p>使用Vue3 + Node.js + Plotly.js构建的实时波形图</p>
    </div>

    <div class="content">
      <!-- 错误信息 -->
      <div v-if="error" class="error">
        {{ error }}
      </div>

      <!-- 控制面板 -->
      <div class="controls">
        <div class="control-group">
          <label for="waveType">波形类型</label>
          <select id="waveType" v-model="waveformConfig.type" @change="fetchWaveformData">
            <option v-for="type in waveformTypes" :key="type.value" :value="type.value">
              {{ type.label }}
            </option>
          </select>
        </div>

        <div class="control-group">
          <label for="frequency">频率 (Hz)</label>
          <input id="frequency" type="number" v-model.number="waveformConfig.frequency" min="0.1" max="10" step="0.1"
            @input="fetchWaveformData" />
        </div>

        <div class="control-group">
          <label for="amplitude">振幅</label>
          <input id="amplitude" type="number" v-model.number="waveformConfig.amplitude" min="0.1" max="5" step="0.1"
            @input="fetchWaveformData" />
        </div>

        <div class="control-group">
          <label for="points">数据点数</label>
          <input id="points" type="number" v-model.number="waveformConfig.points" min="100" max="5000" step="100"
            @input="fetchWaveformData" />
        </div>

        <button class="btn" @click="fetchWaveformData" :disabled="loading">
          {{ loading ? '生成中...' : '生成波形图' }}
        </button>
      </div>

      <!-- 波形信息 -->
      <div v-if="waveformData.metadata" class="info">
        <strong>当前波形参数：</strong>
        类型: {{ getWaveformTypeLabel(waveformData.metadata.type) }} |
        频率: {{ waveformData.metadata.frequency }} Hz |
        振幅: {{ waveformData.metadata.amplitude }} |
        数据点: {{ waveformData.metadata.points }}
      </div>

      <!-- 图表容器 -->
      <div class="chart-container">
        <div v-if="loading" class="loading">
          正在生成波形数据...
        </div>
        <div v-else id="waveformChart">
          <div v-if="!waveformData.data || waveformData.data.length === 0" class="loading">
            点击"生成波形图"按钮开始
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted, nextTick } from 'vue'
import axios from 'axios'
import Plotly from 'plotly.js-dist'

export default {
  name: 'App',
  setup() {
    const loading = ref(false)
    const error = ref('')
    const waveformTypes = ref([])
    const waveformData = reactive({
      data: [],
      metadata: null
    })

    const waveformConfig = reactive({
      type: 'sine',
      frequency: 1,
      amplitude: 1,
      points: 1000
    })

    // 获取波形类型
    const fetchWaveformTypes = async () => {
      try {
        const response = await axios.get('/api/waveform-types')
        if (response.data.success) {
          waveformTypes.value = response.data.types
        }
      } catch (err) {
        console.error('获取波形类型失败:', err)
        error.value = '获取波形类型失败'
      }
    }

    // 获取波形数据
    const fetchWaveformData = async () => {
      loading.value = true
      error.value = ''

      try {
        const params = new URLSearchParams({
          type: waveformConfig.type,
          frequency: waveformConfig.frequency,
          amplitude: waveformConfig.amplitude,
          points: waveformConfig.points
        })

        const response = await axios.get(`/api/waveform?${params}`)

        if (response.data.success) {
          waveformData.data = response.data.data
          waveformData.metadata = response.data.metadata

          // 等待DOM更新后绘制图表
          await nextTick()
          // 再等待一小段时间确保DOM完全更新
          setTimeout(() => {
            drawWaveformChart()
          }, 50)
        } else {
          error.value = response.data.error || '获取数据失败'
        }
      } catch (err) {
        console.error('获取波形数据失败:', err)
        error.value = '获取波形数据失败，请检查服务器是否运行'
      } finally {
        loading.value = false
      }
    }

    // 绘制波形图
    const drawWaveformChart = () => {
      if (!waveformData.data || waveformData.data.length === 0) return

      // 确保DOM元素存在
      const chartElement = document.getElementById('waveformChart')
      if (!chartElement) {
        console.warn('图表容器元素不存在，等待DOM更新...')
        // 如果元素不存在，延迟重试
        setTimeout(() => {
          if (document.getElementById('waveformChart')) {
            drawWaveformChart()
          }
        }, 100)
        return
      }

      const xData = waveformData.data.map(point => point.x)
      const yData = waveformData.data.map(point => point.y)

      const trace = {
        x: xData,
        y: yData,
        type: 'scatter',
        mode: 'lines',
        line: {
          color: '#667eea',
          width: 2
        },
        name: getWaveformTypeLabel(waveformData.metadata.type)
      }

      const layout = {
        title: {
          text: `${getWaveformTypeLabel(waveformData.metadata.type)}波形图`,
          font: {
            size: 20,
            color: '#333'
          }
        },
        xaxis: {
          title: '时间 (秒)',
          gridcolor: '#f0f0f0',
          zerolinecolor: '#ccc'
        },
        yaxis: {
          title: '振幅',
          gridcolor: '#f0f0f0',
          zerolinecolor: '#ccc'
        },
        plot_bgcolor: 'white',
        paper_bgcolor: 'white',
        margin: {
          l: 60,
          r: 40,
          t: 60,
          b: 60
        },
        showlegend: true,
        legend: {
          x: 0.02,
          y: 0.98
        }
      }

      const config = {
        responsive: true,
        displayModeBar: true,
        modeBarButtonsToRemove: ['pan2d', 'lasso2d', 'select2d'],
        displaylogo: false
      }

      try {
        Plotly.newPlot('waveformChart', [trace], layout, config)
      } catch (error) {
        console.error('绘制图表失败:', error)
        error.value = '绘制图表失败: ' + error.message
      }
    }

    // 获取波形类型标签
    const getWaveformTypeLabel = (value) => {
      const type = waveformTypes.value.find(t => t.value === value)
      return type ? type.label : value
    }

    // 组件挂载时初始化
    onMounted(async () => {
      await fetchWaveformTypes()
      await fetchWaveformData()
    })

    return {
      loading,
      error,
      waveformTypes,
      waveformData,
      waveformConfig,
      fetchWaveformData,
      getWaveformTypeLabel
    }
  }
}
</script>