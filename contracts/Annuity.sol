pragma solidity ^0.4.25;

contract Annuity {

    struct userInfo {
        address userAddress;
        string userName;
        string userId;
        uint joinTime;
        string birthDay;
        uint program;
        uint payEther;
        bool payEnough;
        bool live;
        uint annuityRecieve;
        uint annuityPayTime;
    }
    address[] public usersAddress;
    mapping(address => userInfo) public usersData;

    function setuserData(string _name, address _userAddr, string _userId, string _birth) public {
        usersData[_userAddr] = userInfo({
            userAddress: _userAddr,
            userName: _name,
            userId: _userId,
            joinTime: now,
            birthDay: _birth,
            program: 0,
            payEther: 0,
            payEnough: false,
            live: true,
            annuityRecieve: 0,
            annuityPayTime: 0
        });
        usersAddress.push(_userAddr);
    }

    //  program  =>    0        1        2
    uint[] public programEther = [1000000, 2000000, 3000000];
    function selectProgram(uint _program) public payable{
        // the rule to control how much money user need to pay
        usersData[msg.sender].program = _program;
    }
    
    function userPayEtherToCompany() public payable{
        usersData[msg.sender].payEther += msg.value;
        if( usersData[msg.sender].payEther >= programEther[usersData[msg.sender].program]){
            usersData[msg.sender].payEnough = true;
            usersData[msg.sender].annuityPayTime = now;
        }
    }
    
    function regretOrNot() public{
        if(now - usersData[msg.sender].joinTime < 10 days){
            msg.sender.transfer(usersData[msg.sender].payEther);
            usersData[msg.sender].payEther = 0;
        }
    }

    uint public annuityPayTotal = 0;
    function payAnnuity() public{
        // 保險公司付款給要保人方案
        if ( usersData[msg.sender].payEnough && (now - usersData[msg.sender].annuityPayTime >= 10) ){
            usersData[msg.sender].annuityPayTime = now;
            msg.sender.transfer(usersData[msg.sender].payEther/100);
            annuityPayTotal+=usersData[msg.sender].payEther/100;
            usersData[msg.sender].annuityRecieve += usersData[msg.sender].payEther/100;
        }
    }
    
    function checkUserNotLive() public{
        // 確認要保人死亡
        usersData[msg.sender].live = false;
    }
    

    // 監控函式
    function returnArray() public view returns(address[]) {
        return usersAddress;
    }

    function returnProgramEtherArray() public view returns(uint[]) {
        return programEther;
    }

    function getBalance(address _addr) public view returns (uint) {
        // this
        return address(_addr).balance;
    }
    
    modifier userAlive() {
        require(usersData[msg.sender].live == true);
        _;
    }
}
