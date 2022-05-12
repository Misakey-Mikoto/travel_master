import Taro, { Component, Config } from '@tarojs/taro';
import { View, Map, Image, Picker, Input } from '@tarojs/components';
import { AtFab, AtIcon, AtModal, AtModalHeader, AtModalAction, AtModalContent } from 'taro-ui';
import thumbnail1 from '../../assets/thumbnail.jpg';
import thumbnail from '../../assets/arrange_headimg.png';
import { set as setGlobalData, get as getGlobalData } from '../../global_data';
import NavBar from '../../components/navbar/navbar';

import './arrange.scss';

export default class Index extends Component {
  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationBarTitleText: 'WeTour',
  };

  state = {
    tripList: [],
    isOpen: false,
    seasonData: ['历史建筑', '公园和花园', '美术馆', '野生动物园区', '早期产业旧址'],
    daysData: ['经济', '质量', '奢华'],
    seasonSelect: 0,
    daysSelect: 0,
  };
  onCalloutTap(e) {
    console.log(e);
    let id = e.detail.markerId;
    Taro.navigateTo({ url: `/pages/detail/detail?id=${id}` });
  }

  componentWillMount() {}

  componentDidMount() {}

  componentWillUnmount() {}

  componentDidShow() {
    this.requestData();
  }

  componentDidHide() {}

  openDetail(id: number) {}

  openArrangeDetail(route) {
    console.log(route);
    setGlobalData('route', route);
    Taro.navigateTo({
      url: '/pages/arrange/arrange-detail/arrange-detail',
    });
  }

  requestData() {
    Taro.showLoading({
      title: '加载中...',
    });
    Taro.cloud
      .callFunction({
        name: 'trip',
        data: {
          $url: 'list',
        },
      })
      .then(res => {
        console.log(res);

        this.setState({
          tripList: res.result,
        });
        Taro.hideLoading();
      });
  }

  buildContent() {
    const { tripList } = this.state;
    let content;
    if (tripList.length == 0) {
      content = <View className="tips">请添加新的行程</View>;
    } else {
      content = tripList.map(item => {
        return (
          <View className="arrange-item" onClick={this.openArrangeDetail.bind(this, item.route)}>
            <Image className="thumbnail-img" src={item.image} mode="aspectFill"></Image>
            <View className="thumbnail-mask"></View>
            <View className="desc">{item.title}</View>
          </View>
        );
      });
    }
    return <View className="arrange-container" style="width: 750rpx; height: 1506rpx; display: block; box-sizing: border-box">
      {content}
      </View>;
  }

  openAddModal(e) {
    console.log(e);

    this.setState({
      isOpen: true,
    });
  }

  onSeasonChange(e) {
    this.setState({
      seasonSelect: e.detail.value * 1,
    });
  }

  onDaysChange(e) {
    console.log(e);

    this.setState({
      daysSelect: e.detail.value * 1,
    });
  }

  addTrip() {
    Taro.showLoading({
      title: '加载中...',
    });
    const { title, daysSelect, seasonSelect } = this.state;
    if (!title) {
      Taro.showToast({
        title: '请输入标题',
        icon: 'none',
      });
      return;
    }
    console.log(daysSelect, seasonSelect);

    // 根据选择的季节和时长选择默认的路线
    Taro.cloud
      .callFunction({
        name: 'trip',
        data: {
          $url: 'default',
          tripData: {
            days: daysSelect + 1,
            season: seasonSelect + 1,
          },
        },
      })
      .then(res => {
        console.log('tripAdd', res);
        let id = res.result[0].id;
        let route = res.result[0].route;
        Taro.cloud
          .callFunction({
            name: 'trip',
            data: {
              $url: 'add',
              tripData: {
                default_trip: id,
                title: title,
                route: route,
              },
            },
          })
          .then(res => {
            this.setState({ isOpen: false });
            this.requestData();
            Taro.hideLoading();
            Taro.showToast({
              title: '保存成功',
            });
          });
        // Taro.showToast({
        //   title: '提交成功'
        // });
        // setTimeout(() => {
        //   Taro.navigateBack();

        // }, 1000)
      });
    // 添加行程
  }

  onTitleBlur(e) {
    this.setState({
      title: e.detail.value,
    });
  }

  render() {
    const { seasonData, daysData, seasonSelect, daysSelect } = this.state;
    return (
      
      <View className="container">
        <Image src={thumbnail} className="thumbnail" mode="widthFix"></Image>
        <AtModal
          isOpened={this.state.isOpen}
          onClose={() => {
            this.setState({ isOpen: !this.state.isOpen });
          }}
        >
          <AtModalHeader>行程推荐系统</AtModalHeader>

          <AtModalContent>
            <View className="form-item at-row at-row__align--center">
              <View className="form-txt at-col at-col-3">旅程名称:</View>
              <Input onBlur={this.onTitleBlur} className="at-col at-col-9" placeholder="请输入行程标题"></Input>
            </View>
            <View className="form-item at-row at-row__align--center">
              <View className="form-txt at-col at-col-3">预期消费:</View>
              <Picker mode="selector" className="at-col at-col-5" range={daysData} onChange={this.onDaysChange}>
                <View className="picker">{daysData[daysSelect]}</View>
              </Picker>
            </View>
            <View className="form-item at-row at-row__align--center">
              <View className="form-txt at-col at-col-3">旅游喜好:</View>
              <Picker mode="selector" className="at-col at-col-5" range={seasonData} onChange={this.onSeasonChange}>
                <View className="picker">{seasonData[seasonSelect]}</View>
              </Picker>
            </View>
          </AtModalContent>
          <AtModalAction>
            {' '}
            <Button
              onClick={() => {
                this.setState({ isOpen: false });
              }}
            >
              取消
            </Button>{' '}
            <Button onClick={this.addTrip}>保存</Button>{' '}
          </AtModalAction>
        </AtModal>
        <View className="fab-btn">
          <AtFab onClick={this.openAddModal.bind(this)}>
            <Text className="at-fab__icon at-icon at-icon-add"></Text>
          </AtFab>
        </View>
        {this.buildContent()}
      </View>
    );
  }
}
