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
          <span v-if="cib" class="font-bold text-sm text-green-600 my-4 self-center">您的CIB是:{{ipns}}
            <svg @click="copy2clipboard" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
              stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0118 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3l1.5 1.5 3-3.75" />
            </svg>

          </span>
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
      error: '',
      cib: ''
    }
  },
  computed: {
    validated() {
      return this.ce && this.ipns && !this.isLoading
    }
  },
  methods: {
    copy2clipboard() {
      navigator.clipboard.writeText(this.cib)
    },
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
        this.cib = rsp.data.ipns
      } catch (ex) {
        console.log('error fetch', ex)
        this.error = ex.message
      }
      this.isLoading = false
    }
  }
}
</script>