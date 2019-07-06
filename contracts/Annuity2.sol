pragma solidity ^0.4.25;

contract Annuity2 {
    address public storage_contract;
    storageContract sc;
    FaceData fd;

    constructor() payable{
        setInsuranceData();
    }
    
    // 設定storage contract
    function setStorageContract(address _storage_contract) public {
        storage_contract = _storage_contract;
        sc = storageContract(storage_contract);
    }

    // 設定FaceData contract
    function setFaceContract(address _face_contract) public {
        fd = FaceData(_face_contract);
    }
    
    mapping(uint => mapping(uint=>uint)) public insuranceData;
    
    function setInsuranceData() public {
        // program, years old
        insuranceData[1][50] = 700000;
        insuranceData[1][55] = 600000;
        insuranceData[1][60] = 500000;

        insuranceData[2][50] = 900000;
        insuranceData[2][55] = 800000;
        insuranceData[2][60] = 700000;

        insuranceData[3][50] = 1100000;
        insuranceData[3][55] = 1000000;
        insuranceData[3][60] = 900000;
    }
    
    function getInsuranceData(uint program, uint year) public view returns(uint){
        return insuranceData[program][year];
    }

    // bool public same;
    // function companyPayEther(address _addr, int[] _face) public payable{
    function companyPayEther(address _addr) public payable{
        // same = fd.getUserFace(_addr)[0] == _face[0];

        if(sc.usersPayEnough(_addr) && (now - sc.usersAnnuityPayTime(_addr) >= 10)){
            // 還需要去計算上次領取跟這次領取差多少時間，差一年給12萬，差兩年給24萬
            _addr.transfer(120000);
            sc.companyPayAnnuity(_addr, 120000);
        }
    }
}

contract storageContract {
    mapping(address => string) public usersName;
    mapping(address => uint) public usersId;
    mapping(address => uint) public usersBirth;
    mapping(address => uint) public usersProgram;
    mapping(address => uint) public usersJoinTime;  // 要保人加入時間
    mapping(address => uint) public usersPayValue;  // 繳交的保險費用
    mapping(address => bool) public usersPayEnough; // 是否繳交足夠保費
    mapping(address => bool) public usersLive;      // 要保人是否活著
    mapping(address => uint) public usersAnnuityRecieve;  // 被保人收到的年金
    mapping(address => uint) public usersAnnuityPayTime; // 上次收取年金的時間
    
    function setUser(address _addr, string _userName, string _userId, uint _birth) public {}
    function setProgram(address _addr, uint _program) public {}
    function setUserpayEther(address _addr, uint _value) public {}
    function setUserpayEnough(address _addr) public {}
    function userContractTerminate(address _addr) public {}
    function companyPayAnnuity(address _addr, uint _val) public {}
}


contract FaceData{
    mapping(address => int[]) userFace;

    function getUserFace(address _addr) public view returns(int[]){
        return userFace[_addr];
    }
}