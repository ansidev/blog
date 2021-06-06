import { computed, h, onMounted, onUpdated, onUnmounted } from 'vue'
import mediumZoom from 'medium-zoom'
import { config as mediumZoomConfig } from '../index'

const defaultConfigs = {
  selector: '[data-zoomable]',
  options: {},
}

interface MediumZoomPluginConfig {
  selector: string,
  options?: object,
}

const pluginConfig: MediumZoomPluginConfig = mediumZoomConfig

const hasPluginConfig = typeof pluginConfig === 'object'

const selector = computed(() => hasPluginConfig && typeof pluginConfig.selector === 'string' ? pluginConfig.selector : defaultConfigs.selector )
const options = computed(() => hasPluginConfig && typeof pluginConfig.options === 'object' ? pluginConfig.options : defaultConfigs.options )

let zoom: any = null

const updateZoom = async () => {
  setTimeout(() => {
    if (zoom) {
      zoom.detach()
    }
    zoom = mediumZoom(selector.value, options.value)
  }, 1000)
}

export default {
  setup() {
    onMounted(updateZoom)
    onUpdated(updateZoom)
    onUnmounted(() => {
      if (zoom) {
        zoom.detach()
      }
    })

    return () => h('div')
  }
}
