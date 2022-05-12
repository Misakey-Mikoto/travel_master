import Taro, { Component, Config } from '@tarojs/taro'
import { View, Image, Text, Button, Input } from '@tarojs/components'
import { AtRate, AtIcon, AtSearchBar } from 'taro-ui'

// import thumbnail from '../../assets/thumbnail.jpg';
import thumbnail from '../../assets/shanghai.jpg';
import thumbnail2 from '../../assets/shanghai8.jpg';
import thumbnail3 from '../../assets/shanghai3.jpg';

import auth_image from '../../assets/icon_wechat_auth.png';
import icon_map from '../../assets/icon_map.png';
import icon_mark from '../../assets/icon_mark.png';
import icon_arrange from '../../assets/icon_arrange.png';

import './index.scss'



export default class Index extends Component {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  //config项目配置
  config: Config = {
    navigationBarTitleText: 'WeTour'
  }

  state = {
    sceneList: [],
    showModal: false,
    temperature: 0,
    condTxt: '-',
    inputTxt: '',
    location: '上海',
    admin_area: '上海市',
    cnty: '中国'


  }
  //转到 地图
  openMap() {
    Taro.navigateTo({ url: '/pages/map/map' })
  }
  // 转到 我的行程
  openRange() {
    const userInfo = Taro.getStorageSync('userInfo'); //同步获取当前storage的相关信息
    if (!userInfo) {
      this.setState({
        showModal: true
      })
      return;
    }
    Taro.navigateTo({ url: '/pages/arrange/arrange' })//同步获取当前storage的相关信息
  }
  // 转到 打卡记录
  openMarkList() {
    const userInfo = Taro.getStorageSync('userInfo');
    if (!userInfo) {
      this.setState({
        showModal: true
      })
      return;
    }
    Taro.navigateTo({ url: '/pages/markup-list/markup-list' })
  }

  // 监听程序初始化，初始化完成时触发（全局只触发一次），对应onLaunch
  componentWillMount() {
    this.login(); //页面一加载时，用this调用用login方法，获取登录信息

  }

  // 获取登录信息(页面一加载时，用this调用用login方法) 
  login() {
    Taro.cloud.callFunction({
      name: 'login',
    }).then(res => { //用形参res接收回调函数的结果
      console.log('用户信息', res)
      this.setState({ //this.setState是套话
        userInfo: res.result, //给userInfo重新赋值为res.result
      })
    }).catch(console.log)
  }

  // 请求景点列表：通过调用云函数，获取景点数据后赋给sceneList (页面一加载时就被调用了)
  requestSceneList(name = '') {
    Taro.showLoading({
      title: '加载中...'
    })
    Taro.cloud.callFunction({ //调用云函数
      name: 'scene',
      data: {
        name: name
      }
    }).then(res => {
      console.log(res);
      Taro.hideLoading();
      this.setState({
        sceneList: res.result.data //获取景点数据后赋给sceneList
      })
    })
  }

  // 在 componentWillMount 后执行，对应onLaunch
  componentDidMount() {
    // 请求景点列表
    this.requestSceneList();
    // 请求天气 （调用云函数请求天气信息，赋值给condTxt和temperature）
    Taro.request({  //Taro.request发起 HTTPS 网络请求,调用天气API
      url: 'https://free-api.heweather.net/s6/weather/now?location=shanghai&key=7dc2a35ee71d4793ae2683a8ac8cff33',
    }).then(res => {
      console.log(res);
      let conditon = res.data.HeWeather6[0].now;
      let basic = res.data.HeWeather6[0].basic;
      console.log(conditon);
      this.setState({
        condTxt: conditon.cond_txt,
        temperature: conditon.tmp,
        loc: basic.location,
        admin_area: basic.admin_area,
        cnty: basic.cnty
      })
    })

  }

  componentWillUnmount() { }

  // 对应 onShow
  componentDidShow() {

  }

  // 程序从前台进入后台时触发，对应 onHide
  componentDidHide() {

  }

 

  

  onFocus() {
    Taro.navigateTo({ url: '/pages/search-history/search-history' })
  }
  // 搜索确认
  onActionClick() {
    console.log(this.state)
    const { inputTxt } = this.state;
    // 跳转到搜索界面（跳到搜出来的景点列表的界面，只能搜到已有景点）
    this.requestSceneList(inputTxt);
  }
  //获取搜索输入值 
  onSearchChange(res) {
    // 获取输入值
    this.setState({
      inputTxt: res
    })
    console.log(res)
  }
  // 搜索栏
  buildSearch() {
    // const {value} = this.state.value;

    return (
      <AtSearchBar
        value={this.state.value}
        onFocus={this.onFocus.bind(this)}
      />
    );
  }

  openthumbnail(id: any) {
    console.log('asd')
    Taro.navigateTo({ url: `/pages/detail/detail?id=${10}` }) //跳转到detail界面中
  }
  openthumbnail2(id: any) {
    console.log('asd')
    Taro.navigateTo({ url: `/pages/detail/detail?id=${6}` }) //跳转到detail界面中
  }
  openthumbnail3(id: any) {
    console.log('asd')
    Taro.navigateTo({ url: `/pages/detail/detail?id=${5}` }) //跳转到detail界面中
  }

  buildHeader() {
    const { temperature, condTxt, sceneList, loc, admin_area, cnty } = this.state;
    return (
      <View className="head" >
        <Swiper
          className='swiper-container'
          indicatorColor='#999'
          indicatorActiveColor='#333'
          circular
          indicatorDots
          autoplay>
          <SwiperItem>
            {
              sceneList.map(item => {
                return (
                  <View key={item.id} onClick={this.openthumbnail.bind(this, item.id)}>
                    <Image className="swiper-img" mode="aspectFill" src={thumbnail} ></Image>
                  </View>
                );
              })
            }
          </SwiperItem>
          <SwiperItem>
            {
              sceneList.map(item => {
                return (
                  <View key={item.id} onClick={this.openthumbnail2.bind(this, item.id)}>
                    <Image className="swiper-img" mode="aspectFill" src={thumbnail2}></Image>
                  </View>
                );
              })
            }
          </SwiperItem>
          <SwiperItem>
            {
              sceneList.map(item => {
                return (
                  <View key={item.id} onClick={this.openthumbnail3.bind(this, item.id)}>
                    <Image className="swiper-img" mode="aspectFill" src={thumbnail3}></Image>
                  </View>
                );
              })
            }
          </SwiperItem>
        </Swiper>

        {/* <View className="thumbnail-mask"></View> */}
        <View className="desc">
          {/* <View className="city-ch">上海</View> */}
          <View className="city-ch">
            <Text>{loc}</Text>
          </View>
          {/* <View className="city-en">Shanghai</View> */}
          <View className="city-en">
            <Text>{admin_area},{cnty}</Text>
          </View>

        </View>
        <View className="weather">
          <Text>{temperature}°C {condTxt}</Text>
        </View>
      </View>
    )
  }

   // 点击景点推荐中的每一项会转到这里，先同步获取当前storage的相关信息，在跳转到detail界面中
   openDetail(id: any) {
    const userInfo = Taro.getStorageSync('userInfo'); //同步获取当前storage的相关信息
    if (!userInfo) {
      this.setState({
        showModal: true
      })
      return;
    }
    Taro.navigateTo({ url: `/pages/detail/detail?id=${id}` }) //跳转到detail界面中
  }

  // 景点列表
  buildSceneList() {
    const { sceneList } = this.state;
    return (
      <View className="list-container">
        <View className="divider"></View>
        <View className="list-header at-row at-row__align--center at-row__justify--between">
          <View className="header-title">景点推荐</View>
          {/* <View className="more at-row at-row__align--center at-row__justify--center">
            <View className="at-icon at-icon-chevron-right"></View>
          </View> */}
        </View>
        <View className="list">
          {
            sceneList.map(item => {
              return (
                <View key={item.id} className="list-item at-row at-row__align--start" onClick={this.openDetail.bind(this, item.id)}>
                  <Image className="scene-img" src={item.head_image}></Image>
                  <View className="scene-desc">
                    <View className="scene-title">{item.name}</View>
                    <View className="at-row rate">
                      <AtRate size={15} value={item.score} />
                      <Text style="margin-left: 20rpx;">{item.score}分</Text>
                    </View>
                    <View className="region">
                      <Text>{item.type} | {item.region}</Text>
                    </View>
                  </View>
                </View>
              );
            })
          }
        </View>
      </View>

    )
  }

  // 获取用户信息 （在buildModal中被绑定的事件）调用云函数获取用户信息后，赋值给userInfo，并显示 登陆成功
  onGetUserInfo(e) {
    console.log(e);
    const { detail } = e;
    if (detail.errMsg.endsWith('ok')) { // 确认授权
      const userInfo = JSON.parse(detail.rawData);
      const { nickName, gender, avatarUrl } = userInfo;
      Taro.cloud.callFunction({ //调用云函数获取用户信息后
        name: 'postUserInfo',
        data: {
          name: nickName,
          gender: gender,
          avatarUrl: avatarUrl,
        },
      }).then(res => {
        console.log(res);
        Taro.setStorageSync('userInfo', res.result); //赋值给userInfo
        this.setState({
          showModal: false
        });
        Taro.showToast({
          title: '登录成功'
        })
      })

    }
  }
  // 点景点推荐中的项会显示 一键授权-登陆成功 （点击按钮时，用了事件绑定onGetUserInfo，来获得你的头像和昵称）
  buildModal() {
    return (
      <View className="mask">
        <View className="modal-content">
          <Image src={auth_image} className="auth-img"></Image>
          <View className="tips">请求获得你的头像和昵称</View>
          <Button className="auth-btn" openType="getUserInfo" onGetUserInfo={this.onGetUserInfo}>一键授权</Button>
        </View>

      </View>
    );
  }


  // 组件排列
  render() {
    const { showModal } = this.state;
    let modalView;
    if (showModal) {
      modalView = this.buildModal();
    } else {
      modalView = (<View></View>)
    }
    return (
      <View className='container'>
        {this.buildHeader()}
        {this.buildSearch()}
        {/* {this.buildMenu()} */}
        {this.buildSceneList()}
        {modalView}
      </View>
    )
  }
}
