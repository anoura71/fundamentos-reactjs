import React, { useState, useEffect } from 'react';

import api from '../../services/api';
import Header from '../../components/Header';
import formatValue from '../../utils/formatValue';

import { Container, CardContainer, Card, TableContainer } from './styles';

import income from '../../assets/income.svg';
import outcome from '../../assets/outcome.svg';
import total from '../../assets/total.svg';


interface Transaction {
  id: string;
  title: string;
  value: number;
  formattedValue: string;
  formattedDate: string;
  type: 'income' | 'outcome';
  category: { title: string };
  created_at: Date;
}


interface Balance {
  income: string;
  outcome: string;
  total: string;
}


const Dashboard: React.FC = () => {


  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState<Balance>({} as Balance);


  useEffect(() => {

    // Carregar as transações cadastradas (com o balanço)
    async function loadTransactions(): Promise<void> {

      const response = await api.get('/transactions');
      // Formatar valores e datas das transações
      const formattedTransactions = response.data.transactions.map(
        (transaction: Transaction) => ({
          ...transaction,
          formattedValue: (
            ((transaction.type === 'outcome') && '- ' + formatValue(transaction.value))
            || formatValue(transaction.value)
          ),
          formattedDate: new Date(transaction.created_at).toLocaleDateString('pt-BR'),
        })
      )
      // Formatar valores do balanço
      const rawBalance = response.data.balance;
      const formattedBalance = {
        income: formatValue(rawBalance.income),
        outcome: formatValue(rawBalance.outcome),
        total: formatValue(rawBalance.total),
      }

      setTransactions(formattedTransactions);
      setBalance(formattedBalance);
    }

    loadTransactions();
  }, []);


  return (
    <>
      <Header />

      <Container>
        <CardContainer>
          <Card>
            <header>
              <p>Entradas</p>
              <img src={income} alt="Income" />
            </header>
            <h1 data-testid="balance-income">{balance.income}</h1>
          </Card>

          <Card>
            <header>
              <p>Saídas</p>
              <img src={outcome} alt="Outcome" />
            </header>
            <h1 data-testid="balance-outcome">{balance.outcome}</h1>
          </Card>

          <Card total>
            <header>
              <p>Total</p>
              <img src={total} alt="Total" />
            </header>
            <h1 data-testid="balance-total">{balance.total}</h1>
          </Card>
        </CardContainer>

        <TableContainer>
          <table>
            <thead>
              <tr>
                <th>Título</th>
                <th>Preço</th>
                <th>Categoria</th>
                <th>Data</th>
              </tr>
            </thead>

            <tbody>
              {transactions.map(transaction => (
                <tr key={transaction.id}>
                  <td className="title">{transaction.title}</td>
                  <td className={transaction.type}>
                    {transaction.formattedValue}
                  </td>
                  <td>{transaction.category.title}</td>
                  <td>{transaction.formattedDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableContainer>
      </Container>
    </>
  );


};


export default Dashboard;
