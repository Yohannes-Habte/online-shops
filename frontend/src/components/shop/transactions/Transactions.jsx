import TransactionForm from "../transactionForm/TransactionForm";
import "./Transactions.scss";

const Transactions = () => {
  return (
    <section className="transactions-container">

        <h1 className="transaction-title">Transactions</h1>

        <TransactionForm />
      
    </section>
  )
}

export default Transactions
