import React, { Component } from "react";
import LoanManager from "./contracts/LoanManager.json";
import Loan from "./contracts/Loan.json";
import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {
  state = {
    amount: 0,
    tenureMonth: 0,
    id: 0,
    loaded: false,
  };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      this.web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      this.accounts = await this.web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await this.web3.eth.net.getId();

      this.loanManager = new this.web3.eth.Contract(
        LoanManager.abi,
        LoanManager.networks[networkId] &&
          LoanManager.networks[networkId].address
      );

      this.listenToPaymentEvent();
      this.setState({ loaded: true });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
  };

  listenToPaymentEvent = () => {
    let self = this;
    this.loanManager.events.LoanEvent().on("data", async function (evt) {
      console.log(evt);
      let loan = await self.loanManager.methods
        .loans(evt.returnValues._id)
        .call();
      console.log(loan);
      if (evt.returnValues._status == 0) {
        alert(
          `Create loan with ${evt.returnValues._id} and ${loan._loan} success`
        );
      } else if (evt.returnValues._status == 1) {
        alert(
          `Approve loan with ${evt.returnValues._id} and ${loan._loan} success`
        );
      } else {
      }
    });
  };

  handleSubmit = async () => {
    const { amount, tenureMonth, id } = this.state;
    let result = await this.loanManager.methods
      .createLoan(id, amount, tenureMonth)
      .send({ from: this.accounts[0] });
  };

  handleSearchLoan = async () => {
    const { id } = this.state;
    let loan = await this.loanManager.methods.loans(id).call();
    alert(loan._loan);
  };

  handleApproveLoan = async () => {
    const { id, amount, tenureMonth } = this.state;
    let loan = await this.loanManager.methods.loans(id).call();

    const loanContract = new this.web3.eth.Contract(Loan.abi, loan._loan);
    let result = await loanContract.methods
      .approvedLoan(amount, tenureMonth)
      .send({ from: this.accounts[0] });
  };

  handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value,
    });
  };

  render() {
    if (!this.state.loaded) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Simply Loan Management Example!</h1>
        <h2>Add Loan</h2>
        Requested Amount:{" "}
        <input
          type="number"
          name="amount"
          value={this.state.amount}
          onChange={this.handleInputChange}
        />
        Requested Tenure Month:{" "}
        <input
          type="number"
          name="tenureMonth"
          value={this.state.tenureMonth}
          onChange={this.handleInputChange}
        />
        Id:{" "}
        <input
          type="number"
          name="id"
          value={this.state.id}
          onChange={this.handleInputChange}
        />
        <button type="button" onClick={this.handleSubmit}>
          Create new Loan
        </button>
        <h2>Approved Loan</h2>
        Approved Amount:{" "}
        <input
          type="number"
          name="amount"
          value={this.state.amount}
          onChange={this.handleInputChange}
        />
        Approved Tenure Month:{" "}
        <input
          type="number"
          name="tenureMonth"
          value={this.state.tenureMonth}
          onChange={this.handleInputChange}
        />
        Id:{" "}
        <input
          type="number"
          name="id"
          value={this.state.id}
          onChange={this.handleInputChange}
        />
        <button type="button" onClick={this.handleApproveLoan}>
          Approved
        </button>
        <h2>Search Loan</h2>
        Id:{" "}
        <input
          type="number"
          name="id"
          value={this.state.id}
          onChange={this.handleInputChange}
        />
        <button type="button" onClick={this.handleSearchLoan}>
          Search
        </button>
      </div>
    );
  }
}

export default App;
