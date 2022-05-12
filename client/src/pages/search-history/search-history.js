import Taro, { Component, Config } from '@tarojs/taro'
import NavBar from '../../components/navbar/navbar'

import thumbnail from '../../assets/markup_list_headimg.png';
import none_rearch from '../../assets/none_search_result.jpg';

import { View, Image, Text, Button, Input } from '@tarojs/components'
import { AtRate, AtIcon, AtSearchBar, AtTag, AtModal } from 'taro-ui'
import { set as setGlobalData, get as getGlobalData } from '../../global_data';
import auth_image from '../../assets/icon_wechat_auth.png';
import icon_map from '../../assets/icon_map.png';
import icon_mark from '../../assets/icon_mark.png';
import icon_arrange from '../../assets/icon_arrange.png';

import './search-history.scss'

export default class Index extends Component {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationBarTitleText: 'WeTour'
  }

  state = {
    sceneList: [],
    historylist:[],
    inputTxt: '',
    showHistory: 1,
    clearHistory: true,
    displayResult: 1,
  }




  requestSceneList(name='') {

    Taro.showLoading({
      title: '加载中...'
    })
    Taro.cloud.callFunction({
      name: 'scene',
      data: {
        name: name
      }
    }).then(res => {
      console.log(res);
      Taro.hideLoading();
      this.setState({
        sceneList: res.result.data
      })
    })

    // const { sceneList } = this.state;
    // if(sceneList.length != 0){
    //   this.setState({  
    //     displayResult: 2
    //   })
      
    // }else{
    //   this.setState({  
    //     displayResult: 3
    //   })
    // }

  }





// 搜索确认
  onActionClick() {
    const {inputTxt} = this.state;
    var {historylist} = this.state;
    var index = historylist.findIndex(x => x == inputTxt)
    if(index >= 0){
      historylist.splice(index, 1)
    }
    historylist.unshift(inputTxt)
    console.log("在前面加入新搜索记录后的数组"+historylist)
    Taro.setStorageSync('historylist', historylist);

    // 跳转到搜索界面
    Taro.setStorageSync('inputTxt', inputTxt);
    this.requestSceneList(inputTxt);
    const { sceneList } = this.state;
    if(sceneList.length != 0){
      this.setState({  
        displayResult: 2
      })
      
    }else{
      this.setState({  
        displayResult: 3
      })

    }
  }


 


  onSearchChange(res) {
    // 获取输入值
    this.setState({
      inputTxt: res, 
    })
  }

  onFocus(){
    this.setState({
      displayResult: 1
    })
  }
  
  onClearHistory(){
    const {clearHistory} = this.state; 
    const {historylist} = this.state; 
    Taro.showModal({
      title:'确认删除全部历史记录？',
      cancelText:'取消',
      // cancelColor:'xx',
      confirmText:'确认',
      success: res =>
      {
        if(res.confirm)
        {
          console.log("确认取消");
          Taro.setStorageSync('historylist', []);
          this.setState({
            historylist: [],
            displayResult: 1
          })     
        }
      }

    })
    
  
  }
 
 

  buildHistory(){
    var {historylist} = this.state;
    historylist = Taro.getStorageSync('historylist');
    
    historylist = Array.from(historylist);
    return(
      <View className="history-box">
        <View className="history-title">
          <text>搜索历史</text>
          <AtIcon value='trash' size='25' color='#888' onClick={this.onClearHistory.bind(this)}></AtIcon>
        </View>

        <View className="history-list">
          {
          historylist.map(item =>{
            return(
              <AtTag type='primary' circle onClick={this.onActionClick.bind(this)}> {item} </AtTag>
            )
          }) 
        }      
        </View>
      </View>

    )
       
  }



    buildSearch() {
      // const {value} = this.state.value;

      return (
        <AtSearchBar
          showActionButton
          value={this.state.value}
          onFocus={this.onFocus.bind(this)}
          onActionClick={this.onActionClick.bind(this)}
          onChange={this.onSearchChange.bind(this)}
        />
      );
    }




    openDetail(id: any) {
      const userInfo = Taro.getStorageSync('userInfo');
      if (!userInfo) {
        this.setState({
          showModal: true
        })
        return;
      }
      Taro.navigateTo({ url: `/pages/detail/detail?id=${id}` })
    }


    buildSceneList() {
      console.log("景点列表")
      const { sceneList } = this.state;
      
      return (
        <View className="list-container">
          <View className="divider"></View>
          <View className="list-header at-row at-row__align--center at-row__justify--between">
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

    bulidNoresult(){
      return(
        <View className='none_rearch-list'>
          <Image src={none_rearch} className="none_rearch" mode="widthFix"></Image>
          <Text className='text1'> 没有找到相关景点 </Text>
          <Text className='text2'> “换个词搜搜看吧” </Text>
        </View>
      )
    }


  render() {
    const { displayResult , clearHistory} = this.state;
    let historyView
    
    if(displayResult == '1'){
      historyView = this.buildHistory();
    }else if(displayResult == '2') {
      historyView = this.buildSceneList();
    }else{
      historyView = this.bulidNoresult();
    }
    
    return (
       <View className='container'>

        <NavBar></NavBar>
        <Image src={thumbnail} className="thumbnail" mode="widthFix"></Image>
        {this.buildSearch()}
        {historyView}

      </View>
    )
  }
}
