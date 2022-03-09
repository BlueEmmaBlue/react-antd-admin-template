import React from 'react';
import TypingCard from '@/components/TypingCard'
import { Card } from 'antd';
const Doc = () => {
  const cardContent =
    `<div className="site-card-border-less-wrapper">
      <Card title="Card title" bordered={false} style={{ width: 300 }}>
        <p>姓名：李硕</p>
        <p>性别：男</p>
        <p>籍贯：山东</p>
        <p>手机：15201348798</p>
        <p>微信：aiguoyongjun</p>
        <p>所在地：北京</p>
        <p>单位：北京大学</p>
      </Card>
    </div>`



  return (
    <div className="app-container">
      <TypingCard title='我的信息' source={cardContent} />
    </div>
  );
}

export default Doc;