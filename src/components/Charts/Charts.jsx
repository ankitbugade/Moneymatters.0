import React from 'react'
import {Line,Pie} from '@ant-design/charts'

function ChartComponent({sortedTransactions}){
    const data = sortedTransactions.map((item) => {
        return {date: item.date, amount: item.amount};
    })

    const spendingData = sortedTransactions.filter((transaction) => {
        if(transaction.type == "expense")
        { return {tag : transaction.tag, amount: transaction.amount}};
    });

    let finalSpendings = spendingData.reduce((acc,obj) => {
        let key = obj.tag;
        if(!acc[key]){
            acc[key] = {tag: obj.tag, amount: obj.amount};
        }else{
            acc[key] += obj.amount;
        }
        return acc;
    },{});
      
    const config = {
        data: data,
        width: 1000,
        autoFit: true,
        xField: 'date',
        yField: 'amount',
    };

    const spendingConfig = {
        data: Object.values(finalSpendings),
        width: 500,
        radius: 0.8,
        autoFit: true,
        angleField: "amount",
        colorField: "tag"
    }


    let chart;
    let piechart;

    return(
        <div className='charts-wrapper'>
            <div >
                <h1>Your Analytics</h1>
                <Line
                 {...config}
                 onReady={(chartInstance) => (chart = chartInstance)}/>
            </div>
            <div>
                <h1>Your Spendings</h1>
                <Pie
                 {...spendingConfig}
                 onReady={(chartInstance) => (piechart = chartInstance)}/>
            </div>
        </div>
    )
}

export default ChartComponent