import React, { Component } from "react";
import { PropTypes } from "prop-types";
import { connect } from "react-redux";
import echarts from "@/lib/echarts";
import { debounce } from "@/utils";
import { Modal } from 'antd';

class LineChart extends Component {
  static propTypes = {
    width: PropTypes.string,
    height: PropTypes.string,
    className: PropTypes.string,
    styles: PropTypes.object,
    chartData: PropTypes.object.isRequired,
  };
  static defaultProps = {
    width: "100%",
    height: "350px",
    styles: {},
    className: "",
  };
  state = {
    chart: null,
    visible: false
  };

  componentDidMount() {
    debounce(this.initChart.bind(this), 300)();
    window.addEventListener("resize", () => this.resize());
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.sidebarCollapsed !== this.props.sidebarCollapsed) {
      this.resize();
    }
    if (nextProps.chartData !== this.props.chartData) {
      debounce(this.initChart.bind(this), 300)();
    }
  }

  componentWillUnmount() {
    this.dispose();
  }

  resize() {
    const chart = this.state.chart;
    if (chart) {
      debounce(chart.resize.bind(this), 300)();
    }
  }

  dispose() {
    if (!this.state.chart) {
      return;
    }
    window.removeEventListener("resize", () => this.resize()); // 移除窗口，变化时重置图表
    this.setState({ chart: null });
  }

  setOptions({ expectedData } = {}) {
    let icon = '<svg t="1646816852523" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4021" width="200" height="200"><path d="M287.2 551.7h560.5v243.6H287.2z" fill="#DD2326" p-id="4022"></path><path d="M287.2 313.2h560.5v243.6H287.2z" fill="#FF4B4B" p-id="4023"></path><path d="M612.7 428.3c6.2-3.4 12.4-6.8 18.6-10.1-8.7-2.5-17.2-6.5-20.3-15.2-1.1-6.2-2.3-12.4-3.4-18.6l-15.2 15.2c-7.9-1.1-15.8-2.3-23.6-3.4 3.4 6.8 6.8 13.5 10.1 20.3-3.9 6.8-7.9 13.5-11.8 20.3 25.4-2 25.1 3.5 38.8 15.2 0.4-8.7 2-19.2 6.8-23.7zM489.4 507.7l-32.1-64.2c-10.7 23.1-21.4 46.2-32.1 69.2-23.6 3.4-47.3 6.8-70.9 10.1 18.6 16.9 37.2 33.8 55.7 50.7-3.9 24.2-7.9 48.4-11.8 72.6l67.5-37.2c20.8 10.7 41.7 21.4 62.5 32.1-5.1-24.2-10.1-48.4-15.2-72.6l52.4-52.4c-25.3-2.7-50.7-5.5-76-8.3zM622.8 502.6c7.9 1.7 15.8 3.4 23.6 5.1 2.8 7.3 5.6 14.6 8.4 22v-3.4c3.9-5.6 7.9-11.3 11.8-16.9h23.6l-10.1-10.1-5.1-8.4c2.3-7.9 4.5-15.8 6.8-23.6-8.1 4.1-19.5 10.7-25.3 6.8-5.6-3.4-11.3-6.8-16.9-10.1 0.6 7.9 1.1 15.8 1.7 23.6-6.1 4.9-12.3 9.9-18.5 15zM670.1 587c-0.6-7.3-1.1-14.6-1.7-22l-16.9 16.9c-7.3-1.7-14.6-3.4-22-5.1 3.4 6.8 6.8 13.5 10.1 20.3-3.9 6.8-7.9 13.5-11.8 20.3 11.6-1.1 19.7-3 27 0 3.4 5.1 6.8 10.1 10.1 15.2h1.7c1.7-8.4 3.4-16.9 5.1-25.3 6.8-2.8 13.5-5.6 20.3-8.4-7.3-4-14.6-7.9-21.9-11.9zM627.9 647.8L611 664.7c-7.3-1.7-14.6-3.4-22-5.1 3.4 6.8 6.8 13.5 10.1 20.3-3.9 6.8-7.9 13.5-11.8 20.3 11.6-1.1 19.7-3 27 0 3.4 5.1 6.8 10.1 10.1 15.2h1.7c1.7-8.4 3.4-16.9 5.1-25.3 6.8-2.8 13.5-5.6 20.3-8.4-7.3-3.9-14.6-7.9-22-11.8-0.5-7.4-1-14.8-1.6-22.1z" fill="#FAD936" p-id="4024"></path><path d="M286.9 317v159.9c0 23.1-2.2 342.4-2.1 431.9h-91.4V315h4.2c11.5 16.9 45.5 26.4 68.5 14.5 7.6-3.9 10-10.2 20.8-12.5z" fill="#7F4F20" p-id="4025"></path><path d="M242.2 287m-58.5 0a58.5 58.5 0 1 0 117 0 58.5 58.5 0 1 0-117 0Z" fill="#BA7400" p-id="4026"></path></svg>'
    icon = encodeURIComponent(icon) // 转译
    icon = 'data:image/svg+xml;utf8,' + icon // 添加url前缀
    icon = 'image://' + icon // 添加ECharts需要的前缀

    this.state.chart.setOption({
      backgroundColor: "#fff",
      title: {
        left: 'center',
        text: '拥军贡献里程碑'
      },
      xAxis: {
        data: ["2021-6-06", "2021-11-07", "2021-12-08", "2022-01-21", "2022-03-14", "2022-05-02", "2022-06-06"],
        boundaryGap: false,
        axisTick: {
          show: false,
        },
      },
      grid: {
        left: 10,
        right: 60,
        bottom: 10,
        top: 30,
        containLabel: true,
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "cross",
        },
        padding: [5, 10],
      },
      yAxis: {
        axisTick: {
          show: false,
        },
      },
      legend: {
        name: '拥军贡献值',
        data: "expected",
        icon: icon,
        left: 'left',

      },
      series: [
        {
          name: "拥军贡献值",
          itemStyle: {
            normal: {
              color: "#FF005A",
              lineStyle: {
                color: "#FF005A",
                width: 3,
              },
            },
          },
          symbol: icon,
          smooth: true,
          type: "line",
          data: expectedData,
          animationDuration: 2800,
          animationEasing: "cubicInOut",
          symbolSize: 40,   //设定实心点的大小
        }
      ],
    });
  }

  initChart() {
    if (!this.el) return;
    this.setState({ chart: echarts.init(this.el, "macarons") }, () => {
      this.setOptions(this.props.chartData);
    });
  }


  handleClick = (e) => {
    this.setState({ visible: true })
  }

  handleCancel = () => {
    this.setState({ visible: false })
  }


  render() {
    const { className, height, width, styles } = this.props;
    return (
      <>
        <div
          className={className}
          ref={(el) => (this.el = el)}
          style={{
            ...styles,
            height,
            width,
          }}
          onClick={this.handleClick}
        />
        <Modal title="Basic Modal" visible={this.state.visible} onCancel={this.handleCancel} onOk={this.handleCancel}>
          <p>Some contents...</p>
          <p>Some contents...</p>
          <p>Some contents...</p>
        </Modal>
      </>
    );
  }
}

export default connect(state => state.app)(LineChart);
