












# DepositStorage

### DepositStorage



## Functions



### Constant functions

#### depositTimestamp




##### Inputs

empty list


##### Returns

|#  |Param|Type|TypeHint|Description|
|---|-----|----|--------|-----------|
|0|return0|[object Object]||depositTimestamp|


#### depositValue




##### Inputs

empty list


##### Returns

|#  |Param|Type|TypeHint|Description|
|---|-----|----|--------|-----------|
|0|return0|[object Object]||depositValue|






### State changing functions

#### acceptDeposit




##### Inputs

|#  |Param|Type|TypeHint|Description|
|---|-----|----|--------|-----------|
|0|_token|address|||
|1|_tokenId|uint|||
|2|_depositId|uint|||
|3|_value|uint|||


#### acceptDividend




##### Inputs

|#  |Param|Type|TypeHint|Description|
|---|-----|----|--------|-----------|
|0|_token|address|||
|1|_tokenId|uint|||
|2|_value|uint|||


#### acceptDividendEth




##### Inputs

|#  |Param|Type|TypeHint|Description|
|---|-----|----|--------|-----------|
|0|_token|address|||
|1|_tokenId|uint|||


#### currentPeriod




##### Inputs

empty list


#### releaseDeposit




##### Inputs

|#  |Param|Type|TypeHint|Description|
|---|-----|----|--------|-----------|
|0|_token|address|||
|1|_tokenId|uint|||
|2|_depositId|uint|||


#### releaseDividend




##### Inputs

|#  |Param|Type|TypeHint|Description|
|---|-----|----|--------|-----------|
|0|_token|address|||
|1|_tokenId|uint|||
|2|_depositId|uint|||


#### releaseDividendEth




##### Inputs

|#  |Param|Type|TypeHint|Description|
|---|-----|----|--------|-----------|
|0|_token|address|||
|1|_tokenId|uint|||
|2|_depositId|uint|||


#### updateState




##### Inputs

|#  |Param|Type|TypeHint|Description|
|---|-----|----|--------|-----------|
|0|_token|address|||
|1|_tokenId|uint|||






### Events

#### AcceptDeposit




##### Params

|#  |Param|Type|TypeHint|Description|
|---|-----|----|--------|-----------|
|0|_token|address|||
|1|_tokenId|uint|||
|2|beneficiary|address|||
|3|depositId|uint|||
|4|daytimestamp|uint|||
|5|_value|uint|||


#### ReleaseDeposit




##### Params

|#  |Param|Type|TypeHint|Description|
|---|-----|----|--------|-----------|
|0|_token|address|||
|1|_tokenId|uint|||
|2|beneficiary|address|||
|3|depositId|uint|||
|4|daytimestamp|uint|||
|5|_value|uint|||





### Enums




### Structs



