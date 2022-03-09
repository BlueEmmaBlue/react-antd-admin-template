import React, { Component } from "react";
import { Table, Tag } from "antd";
import { transactionList } from "@/api/remoteSearch";

const columns = [
  {
    title: "序号",
    dataIndex: "order",
    key: "order",
    width: 100,
  },
  {
    title: "时间",
    dataIndex: "time",
    key: "time",
    width: 195,
    render: text => (text),
  },
  {
    title: "劳动事项",
    key: "event",
    dataIndex: "event",
    width: 100,
    render: (tag) => (
      <Tag color={"magenta"} key={tag}>
        {tag}
      </Tag>
    ),
  },
  {
    title: "贡献值",
    key: "value",
    dataIndex: "value",
    width: 100,
    render: text => (text),
  },
];

class TransactionTable extends Component {
  _isMounted = false;   // 这个变量是用来标志当前组件是否挂载
  state = {
    list: [],
  };
  // fetchData = () => {
  //   transactionList().then((response) => {
  //     const list = response.data.data.items.slice(0, 13);
  //     if (this._isMounted) {
  //       this.setState({ list });
  //     }
  //   });
  // };

  getList = () => {
    fetch('getList', {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
    })
      .then(response => response.json())
      .then(data => {
        this.setState({ list: data });
      })
  }



  componentDidMount() {
    this._isMounted = true;
    this.getList();
  }
  componentWillUnmount() {
    this._isMounted = false;
  }
  render() {
    return (
      <Table
        columns={columns}
        dataSource={this.state.list}
      />
    );
  }
}

export default TransactionTable;
