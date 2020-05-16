pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

contract BPDCC {

    
    struct Task{
        string collaborationName;
        string name;
        string executor;
    }
 
    

    mapping(bytes32 =>Task[]) private instances;
    
    function createCollaboration(string memory collaborationName) public view returns (bytes32 instanceID){
        instanceID=keccak256(abi.encode(collaborationName, block.timestamp));
        return instanceID;
    }
    
    function registerActivity(bytes32 instanceID, string memory collaborationName, string memory taskName, string memory executor)public{
        instances[instanceID].push(Task(collaborationName, taskName, executor));
    }
    
     function get(bytes32 instanceID) public view returns(Task[] memory ){
        return instances[instanceID];
    }
    

}
