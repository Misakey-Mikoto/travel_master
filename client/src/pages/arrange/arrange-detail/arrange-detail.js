import Taro, { Component, Config } from '@tarojs/taro'
import { View, Map} from '@tarojs/components'
import { set as setGlobalData, get as getGlobalData } from '../../../global_data';
import NavBar from '../../../components/navbar/navbar'



import './arrange-detail.scss'

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
    latitude: 0,
    longitude: 0,
    markers: [],
    polygon: []
    
  }
  onCalloutTap(e) {
    console.log(e);
    let id = e.markerId;
    Taro.navigateTo({url: `/pages/detail/detail?id=${id}`})
  }


  componentWillMount () { 
    Taro.getLocation({
      
    }).then(res => {
      console.log(res);
      let {latitude, longitude}  = res;
      this.setState({latitude, longitude});
    });
  }

  componentDidMount () {
    let route = getGlobalData('route');
    console.log(route);
    Taro.showLoading({
      title: '加载中...'
    })
    Taro.cloud.callFunction({
      name: 'sceneRoute',
      data: {
        route: route
      }
    }).then(res => {
      console.log(res);
      let tripList = res.result.data;
      let markers = [];
      let points = [];
      let i = 0;
      tripList.map(item => {
        if(i == 0){
          i++;
          let marker = {
            id: 1000, 
            latitude: this.state.latitude, 
            longitude: this.state.longitude, 
            callout: {content: '您的位置', padding: 10, display: 'ALWAYS', textAlign: 'center'}
          }
          let point = {
            longitude: this.state.longitude, 
            latitude: this.state.latitude, 
          }
          markers.push(marker);
          points.push(point);
        }
        let marker = {
          id: item.id, 
          latitude: item.latitude, 
          longitude: item.longitude, 
          callout: {content: item.name, padding: 10, display: 'ALWAYS', textAlign: 'center'}
        }
        let point = {
          longitude: item.longitude, 
          latitude: item.latitude, 
        }
        markers.push(marker);
        points.push(point);
        points.sort((a,  b)  =>  {  
          var disA = Math.sqrt(Math.pow(Math.abs(a.longitude - this.state.longitude),2)+Math.pow(Math.abs(a.latitude - this.state.latitude),2));
          var disB = Math.sqrt(Math.pow(Math.abs(b.longitude - this.state.longitude),2)+Math.pow(Math.abs(b.latitude - this.state.latitude),2));
          return  disA  -  disB
      })
      })
      

      let polygon =  [{
        points: points,
        color: "#7CFC00",
        width: 5,
        dottedLine: false,
        arrowLine: true,
        borderColor:"#006400",
        borderWidth:2
      }]
      

      this.setState({
        markers,
        polygon
      })
      
      Taro.hideLoading();
    })
    
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }


  openDetail(id: number)  {
  }





  render () {
    const {polygon, latitude, longitude} = this.state;
    return (
      <View className='container'>
        <NavBar></NavBar>
        <Map className="map" scale={12} longitude={longitude} latitude={latitude} onCalloutTap={this.onCalloutTap.bind(this)} markers={markers}  polyline={polygon}/>
      </View>
    )
  }

}
 