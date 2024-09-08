import React,{useState} from 'react'
import './Cards.css'
import { Card, Row } from "antd";
import Button from '../Button/Button';

function Cards({income, expense, currentBalance,
    showExpenseModal, showIncomeModal
  }) {
    

  return (
    
    <Row className='my-row'>
      <Card bordered={true} className='my-card'>
        <h2>Current Balance</h2>
        <p>₹{currentBalance}</p>

        <Button text="Reset balance" blue={true}/>
      </Card>

      <Card bordered={true} className='my-card'>
        <h2>Total Income</h2>
        <p>₹{income}</p>
        <Button text="Add Income" blue={true} onClick={showIncomeModal}/>

      </Card>

      <Card bordered={true} className='my-card'>
        <h2>Total Expenses</h2>
        <p>₹{expense}</p>
        <Button text="Add Expense" blue={true} onClick={showExpenseModal}/>

      </Card>
    </Row>
  )
}

export default Cards
