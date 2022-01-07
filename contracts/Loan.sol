pragma solidity ^0.6.0;

import "./LoanManager.sol";

contract Loan {
    uint public requestedAmount;
    uint public approvedAmount;
    uint public requestedLoanTenureMonth;
    uint public approvedLoanTenureMonth;
    uint public id;

    LoanManager parentContract;

    constructor(LoanManager _parentContract, uint _requestedAmount, uint _requestedLoanTenureMonth, uint _id) public {
        requestedAmount = _requestedAmount;
        requestedLoanTenureMonth = _requestedLoanTenureMonth;
        id = _id;
        parentContract = _parentContract;
    }

    receive() external payable {
        
    }

    fallback () external {

    }

    function approvedLoan(uint _approvedAmount, uint _approvedLoanTenureMonth) public {
        require(_approvedAmount > 0 && _approvedLoanTenureMonth > 0, "Approved amount and loan tenure month not valid");
        approvedAmount = _approvedAmount;
        approvedLoanTenureMonth = _approvedLoanTenureMonth;
        (bool success, ) = address(parentContract).call(abi.encodeWithSignature("triggerApproveLoan(uint256)", id));
        require(success, "Contract Loan Manager rejected to update loan");
    }

}
