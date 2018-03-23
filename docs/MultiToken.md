












# MultiToken

### MultiToken



## Functions



### Constant functions

#### decimals




##### Inputs

empty list


##### Returns

|#  |Param|Type|TypeHint|Description|
|---|-----|----|--------|-----------|
|0|return0|uint8||decimals|


#### mask




##### Inputs

empty list


##### Returns

|#  |Param|Type|TypeHint|Description|
|---|-----|----|--------|-----------|
|0|return0|uint256||mask|


#### owner




##### Inputs

empty list


##### Returns

|#  |Param|Type|TypeHint|Description|
|---|-----|----|--------|-----------|
|0|return0|address||owner|






### State changing functions

#### allowance

Function to check the amount of tokens that an owner allowed to a spender.


##### Inputs

|#  |Param|Type|TypeHint|Description|
|---|-----|----|--------|-----------|
|0|_tokenId|uint256||uint256 is subtoken identifier|
|1|_owner|address||address The address which owns the funds.|
|2|_spender|address||address The address which will spend the funds.|


#### approve

Approve the passed address to spend the specified amount of tokens on behalf of msg.sender.
Beware that changing an allowance with this method brings the risk that someone may use both the oldand the new allowance by unfortunate transaction ordering. One possible solution to mitigate thisrace condition is to first reduce the spender's allowance to 0 and set the desired value afterwards:https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729

##### Inputs

|#  |Param|Type|TypeHint|Description|
|---|-----|----|--------|-----------|
|0|_tokenId|uint256||uint256 is subtoken identifier|
|1|_spender|address||The address which will spend the funds.|
|2|_value|uint256||The amount of tokens to be spent.|


#### balanceOf

Gets the balance of the specified address


##### Inputs

|#  |Param|Type|TypeHint|Description|
|---|-----|----|--------|-----------|
|0|_tokenId|uint256||uint256 is subtoken identifier|
|1|_owner|address||address to query the balance of|


#### createNewSubtoken

create new subtoken with unique tokenId


##### Inputs

|#  |Param|Type|TypeHint|Description|
|---|-----|----|--------|-----------|
|0|_tokenId|uint256||uint256 is subtoken identifier|
|1|_to|address||The address to transfer to.|
|2|_value|uint256||The amount to be transferred.|


#### totalSupply

Gets the total amount of tokens stored by the contract


##### Inputs

|#  |Param|Type|TypeHint|Description|
|---|-----|----|--------|-----------|
|0|_tokenId|uint256||uint256 is subtoken identifier|


#### transfer

transfer token for a specified address


##### Inputs

|#  |Param|Type|TypeHint|Description|
|---|-----|----|--------|-----------|
|0|_tokenId|uint256||uint256 is subtoken identifier|
|1|_to|address||The address to transfer to.|
|2|_value|uint256||The amount to be transferred.|


#### transferFrom

Transfer tokens from one address to another


##### Inputs

|#  |Param|Type|TypeHint|Description|
|---|-----|----|--------|-----------|
|0|_tokenId|uint256||uint256 is subtoken identifier|
|1|_from|address||address The address which you want to send tokens from|
|2|_to|address||address The address which you want to transfer to|
|3|_value|uint256||uint256 the amount of tokens to be transferred|


#### transferOwnership

Allows the current owner to transfer control of the contract to a newOwner.


##### Inputs

|#  |Param|Type|TypeHint|Description|
|---|-----|----|--------|-----------|
|0|newOwner|address||The address to transfer ownership to.|






### Events

#### OwnershipTransferred




##### Params

|#  |Param|Type|TypeHint|Description|
|---|-----|----|--------|-----------|
|0|previousOwner|address|||
|1|newOwner|address|||


#### Transfer




##### Params

|#  |Param|Type|TypeHint|Description|
|---|-----|----|--------|-----------|
|0|tokenId|uint256|||
|1|from|address|||
|2|to|address|||
|3|value|uint256|||


#### Approval




##### Params

|#  |Param|Type|TypeHint|Description|
|---|-----|----|--------|-----------|
|0|tokenId|uint256|||
|1|owner|address|||
|2|spender|address|||
|3|value|uint256|||





### Enums




### Structs



