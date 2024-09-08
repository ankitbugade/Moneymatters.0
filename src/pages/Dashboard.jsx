import React,{useEffect, useState} from 'react';
import Header from '../components/Header/Header';
import Cards from '../components/Cards/Cards';
import { Modal } from 'antd';
import AddExpenseModal from '../components/Modals/AddExpense';
import AddIncomeModal from '../components/Modals/AddIncome';
import { toast } from 'react-toastify';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../firebase';
import { addDoc, collection, getDocs, query} from 'firebase/firestore';
import moment from "moment";
import TransactionsTable from '../components/TransactionsTable/TransactionsTable';
import ChartComponent from '../components/Charts/Charts';
import NoTransactions from '../components/Notransactions/NoTransactions';

function Dashboard() {
  const [transactions,setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user] = useAuthState(auth);
  const [isExpenseModalVisible, setIsExpenseModalVisible] = useState(false);
  const [isIncomeModalVisible, setIsIncomeModalVisible] = useState(false);
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [currentBalance, setCurrentBalance] = useState(0);


  const showExpenseModal = () => {
    setIsExpenseModalVisible(true);
  };

  const showIncomeModal = () => {
    setIsIncomeModalVisible(true);
  };

  const handleExpenseCancel = () => {
    setIsExpenseModalVisible(false);
  };

  const handleIncomeCancel = () => {
    setIsIncomeModalVisible(false);
  };

  const onFinish = (values, type) => {
    const newTransaction = {
      type: type,
      date: values.date.format("YYYY-MM-DD"),
      amount: parseFloat(values.amount),
      tag: values.tag,
      name: values.name,
    };
    addTransaction(newTransaction);
  };

  async function addTransaction(transaction, many) {
    try {
      const docRef = await addDoc(
        collection(db, `users/${user.uid}/transactions`),
        transaction
      );
      console.log("Document written with ID: ", docRef.id);
      if(!many) toast.success("Transaction added");
      let newArr = transactions;
      newArr.push(transaction);
      calculateBalance();
    } catch (e) {
      console.error("Error adding document: ", e);
      if(!many) toast.error("Transaction Not added");
    }
  }

  async function fetchTransactions() {
    setLoading(true);
    if (user) {
      const q = query(collection(db, `users/${user.uid}/transactions`));
      const querySnapshot = await getDocs(q);
      let transactionsArray = [];
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        transactionsArray.push(doc.data());
      });
      setTransactions(transactionsArray);
    }
    setLoading(false);
  }

  const calculateBalance = () => {
    let incomeTotal = 0;
    let expensesTotal = 0;

    transactions.forEach((transaction) => {
      if (transaction.type === "income") {
        incomeTotal += transaction.amount;
      } else {
        expensesTotal += transaction.amount;
      }
    });

    setIncome(incomeTotal);
    setExpense(expensesTotal);
    setCurrentBalance(incomeTotal - expensesTotal);
  };

  // Calculate the initial balance, income, and expenses
  useEffect(() => {
    calculateBalance();
  }, [transactions]);

  useEffect(()=>{
    fetchTransactions();
    toast.success("Transactions Fetched!");

  },[user]);

  let sortedTransactions = transactions.sort((a,b) => {
    return new Date(a.date) - new Date(b.date);
  })

 


  return (
    <div>
        <Header/>

        {loading?<p>Loading...</p> :<>
        <Cards
          income={income}
          expense = {expense}
          currentBalance={currentBalance}
         showExpenseModal={showExpenseModal}
          showIncomeModal={showIncomeModal}
        />
        {transactions && transactions!=0 ? <ChartComponent sortedTransactions = {sortedTransactions}/> : <NoTransactions/>}

          <AddExpenseModal
            isExpenseModalVisible={isExpenseModalVisible}
            handleExpenseCancel={handleExpenseCancel}
            onFinish={onFinish}
          />
          <AddIncomeModal
            isIncomeModalVisible={isIncomeModalVisible}
            handleIncomeCancel={handleIncomeCancel}
            onFinish={onFinish}
          />
          <TransactionsTable transactions={transactions} addTransaction={addTransaction} fetchTransactions={fetchTransactions}/>
          </>
        }

    </div>
  )
}
export default Dashboard
