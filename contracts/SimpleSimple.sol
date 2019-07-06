pragma solidity ^0.4.25;

contract SimpleSimple {
  string public c = "SOS";

  event cSet(string _word);

  function returnUint(string _word) public {
    c = _word;
    emit cSet(c);
  }
}