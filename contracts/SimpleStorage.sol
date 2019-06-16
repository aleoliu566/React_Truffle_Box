pragma solidity ^0.4.25;

contract SimpleStorage {
  uint storedData;
  string public str;
  // uint ss = ;

  function set(uint x) public {
    storedData = x;
  }

  function get() public view returns (uint) {
    return storedData;
  }

  function hello(string _str) public {
    str = _str;
  }
  
  function getHello() public view returns (string) {
    return str;
  }
}
