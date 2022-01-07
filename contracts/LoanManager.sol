pragma solidity ^0.6.0;

import "./Loan.sol";
import "./Ownable.sol";

contract LoanManager is Ownable {

    enum LoanStatus {Created, Approved}

    event LoanEvent(uint _id, uint _status, address _address);

    struct S_Loan {
        Loan _loan;
        LoanStatus _status;
    }
    mapping(uint => S_Loan) public loans;

    function createLoan(uint _id, uint _requestedAmount, uint _requestedLoanTenureMonth) public onlyOwner {
        require(address(loans[_id]._loan) == address(0), "Duplicate loan");
        require(_requestedAmount > 0 && _requestedLoanTenureMonth > 0, "Requested amount and loan tenure month not valid");
        Loan loan = new Loan(this, _requestedAmount, _requestedLoanTenureMonth, _id);
        loans[_id]._loan = loan;
        loans[_id]._status = LoanStatus.Created;

        emit LoanEvent(_id, uint(loans[_id]._status), address(loan));

    }

    function triggerApproveLoan(uint _id) public {

        Loan loan = loans[_id]._loan;

        require(address(loan) == msg.sender, "Only loans are allowed to update themselves");
        require(loans[_id]._status == LoanStatus.Created, "Loan have been approved");

        loans[_id]._status = LoanStatus.Approved;

        emit LoanEvent(_id, uint(loans[_id]._status), address(loan));
    }

}
