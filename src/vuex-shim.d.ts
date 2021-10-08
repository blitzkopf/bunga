import { ComponentCustomProperties } from 'vue'
import { Store } from 'store'

declare module '@vue/runtime-core' {
  // Declare your own store s  tates.
  interface State {
    count: number
  }

  interface ComponentCustomProperties {
    $store: Store<State>
  }
}