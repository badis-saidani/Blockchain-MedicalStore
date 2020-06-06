pragma solidity >=0.4.25 <0.7.0;

contract MedicalStore {

  address sender;
  string fullname;
  string discription;
  uint price;

function sellMedical(string memory _fullname,string memory _discription, uint _price) public {
          sender = msg.sender;
          fullname = _fullname;
          discription = _discription;
          price = _price;
  }

function getMedical() public view returns(
  address _sender,
  string memory _fullname,
  string memory _discription,
  uint _price
){
      return(sender, fullname, discription, price);
  }

}