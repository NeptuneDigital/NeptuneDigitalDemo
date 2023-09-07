//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;


contract GreeterMuti {
     string  private greeting;
     uint128  private number;

    constructor(string memory _greeting,uint128  _number) {
        //console.log("Deploying a Greeter with greeting:", _greeting);      
        greeting = _greeting;
        number = _number;
    }

    function greet() public view returns ( string memory,  uint128 ) {
        return (greeting,number);
    }

    function  add(uint128 a,uint128 b) public pure  returns (uint128 ) {
        return a+b;
    }

    function setGreeting(string memory _greeting,uint128  _number) public {
       //console.log("Changing greeting from '%s' to '%s'", greeting, _greeting);
        greeting = _greeting;
        number=_number;

    }
}
