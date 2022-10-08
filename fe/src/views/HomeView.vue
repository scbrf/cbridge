<template>
  <main>
    <h1 class="text-2xl font-bold">Comment IPFS Bridge</h1>
    <div class="flex flex-col sm:flex-row items-center ">
      <div class="flex-1 py-4 leading-6 ">
        <div>CIB的功能是将符合条件的评论定时抽取到IPFS，这样通过私有的或者公共的IPFS网关就可以访问到包括评论在内的所有内容。</div>
        <div class="flex flex-col">
          <label class="input-group input-group-sm w-100 flex mt-4">
            <span class="w-32">* 评论入口:</span>
            <input type="text" placeholder="请输入你使用的中心化评论系统入口网关地址" v-model="ce"
              class="input flex-1 input-sm input-bordered" />
          </label>

          <label class="input-group input-group-sm w-100 flex mt-2">
            <span class="w-32">* 站点IPNS:</span>
            <input type="text" placeholder="请输入你的内容站点的IPNS地址，通常以 k51 开头" v-model="ipns"
              class="input flex-1 input-sm input-bordered" />
          </label>

          <button :disabled="!validated" :class="isLoading ? ['loading']: []" @click="getCommentIPNS"
            class="btn btn-outline mt-4 btn-sm ">获取 Bridge
            IPNS</button>

          <span class="font-bold text-sm text-red-600 my-4 self-center">{{error}}</span>
        </div>
      </div>
      <div class="flex-1">
        <img src="@/assets/topology.png" />
      </div>
    </div>
  </main>
</template>

<script>
import axios from 'axios'
export default {
  data() {
    return {
      ce: 'https://comments.scbrf.workers.dev',
      ipns: '',
      isLoading: false,
      error: ''
    }
  },
  computed: {
    validated() {
      return this.ce && this.ipns && !this.isLoading
    }
  },
  methods: {
    async getCommentIPNS() {
      this.isLoading = true
      this.error = ''
      try {
        const rsp = await axios.get(`https://cib.qiangge.life/register`, {
          params: {
            ipns: this.ipns,
            ce: this.ce
          }
        })
        console.log(rsp.data)
      } catch (ex) {
        console.log('error fetch', ex)
        this.error = ex.message
      }
      this.isLoading = false
    }
  }
}
</script>