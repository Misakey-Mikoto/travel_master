import Taro, { Component, Config } from '@tarojs/taro'
import Index from './pages/index'

import './app.scss'

// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }

class App extends Component {

  

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    pages: [
      'pages/index/index',
      'pages/markup/markup',
      'pages/detail/detail',
      'pages/map/map',
      'pages/arrange/arrange',
      'pages/arrange/arrange-detail/arrange-detail',
      'pages/comment/comment',
      'pages/markup-list/markup-list',
      'pages/search-history/search-history',
    ],
    window: {
      backgroundTextStyle: 'dark',
      navigationBarBackgroundColor: '#000',
      navigationStyle: 'custom'
    },
    plugins: {
      routePlan: {
        version: "1.0.5",
        provider: "wx50b5593e81dd937a"
      }
    },
    permission: {
      "scope.userLocation": {
        "desc": "你的位置信息将用于小程序定位"
      }
    },
    cloud: true,
    tabBar: {
      "selectedColor": "#1E90FF",
      "list": [
          {
              "pagePath": "pages/index/index",
              "text": "首页",
              "iconPath": "assets/icon_shouye.png",
              "selectedIconPath": "assets/icon_shouye_color2.png"
          },
          {
          "pagePath": "pages/map/map",
          "text": "景点地图",
          "iconPath": "assets/icon_ditu.png",
          "selectedIconPath": "assets/icon_map_color.png"
      },
      {
          "pagePath": "pages/markup-list/markup-list",
          "text": "打卡记录",
          "iconPath": "assets/icon_daka.png",
          "selectedIconPath": "assets/icon_daka_color2.png"
      },
      {
          "pagePath": "pages/arrange/arrange",
          "text": "我的行程",
          "iconPath": "assets/icon_xingcheng.png",
          "selectedIconPath": "assets/icon_xingcheng_color.png"
      }]
  }
  }
  

  componentDidMount () {
    if (process.env.TARO_ENV === 'weapp') {
      Taro.cloud.init()
    }
  }

  componentDidShow () {}

  componentDidHide () {}

  componentDidCatchError () {}

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render () {
    return (
      <Index />
    )
  }
}

Taro.render(<App />, document.getElementById('app'))
