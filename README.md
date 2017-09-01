# SYNOPSYS
This script is designed to help Aerohive Administrators to export the devices list to a CSV file. It can be used with Windows, Linux and MacOs.
The script will only save REAL devices (opposed to SIMULATED devices), and can save devices' information like the Hostname, the IP Address, the Location, ...

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

# USAGE
 **WARNING:** If you are editing the CSV file with Excel, be sure to still have the 14 digits in all the serial number!

This script requires to have NodeJS installed. You can download it from the [NodeJS web site](https://nodejs.org/). 
Please note that only the LTS version was tested.

To run the script, you'll need to :
* Configure the script. All the parameters are listed at the beginning of the script
* Install Node.js from https://www.nodejs.org
* From your CLI or Windows CMD, go to the folder where you saved the script and run `node ./devices.js`. This will display you the result of the csv file, but it will not create it. If you want to execute the script and create the csv file at the save time, you can use the command `node devices.js > devices.csv`.

# RESULT EXAMPLE
```
# Start of Output

#serialId,hostName,model,policy,locations,ip,subnetMask,defaultGateway,osVersion
22081234567890,SR2208P-Mesh,SR_2208P,,My-Location|My-Building|Floor+2,172.16.227.42,255.255.255.0,,1.0.1.22
02501234567890,AP250-Portal,AP_250,,My-Location|My-Building|Floor+2,172.16.227.17,255.255.255.0,172.16.227.1,8.0.1.0
01301234567890,AP130-Mesh,AP_130,,My-Location|My-Building|Floor+2,172.16.227.23,255.255.255.0,172.16.227.1,8.0.1.0

#Total # of Devices: 4
#Total # of Real Devices: 4
#End of Output
```
# PARAMETERS
## ACS Parameters
```javascript
var clientId = "xxxxxx";
var clientSecret = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";
var redirectUrl = "https://127.0.0.1";
```
### IF YOU ARE USING NG CLOUD
You'll have to create an account at https://developer.aerohive.com and create a new "App" to get your own parameters:
### IF YOU ARE USING NG-VA
You don't need a developer account, and you can just use, for example:
  * var clientId = "12345";
  * var clientSecret = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";
  * var redirectUrl = "https://127.0.0.1";
  

## HiveManager NG Parameters
```javascript
var serverFQDN = "cloud-ie.aerohive.com";
var accessToken = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";
var ownerId = "xxxxxx";

```
### IF YOU ARE USING NG CLOUD
* serverFQDN: it's something like cloud-xxx.aerohive.com, where xxx can be "va", "va2", "ie" or "aus" (this list may change). You can find it in the "About" section of your HiveManager NG account.
* accessToken: In your HiveManagerNG account, go to "Global Settings > API Token Management" and create your token. **Be sure to generate the access token by using the same clientID as the one configured above!**.
* ownerId: The ownerId is the "VHM Id" value in the "About" section of your HiveManager NG account.
### IF YOU ARE USING NG-VA
* serverFQDN: it is the FADN of your HiveManager NG Virtual Appliance.
* accessToken: In your HiveManagerNG account, go to "Global Settings > API Token Management" and create your token. **Be sure to generate the access token by using the same clientID as the one configured above!**.
* ownerId: The ownerId is the "VHM Id" value in the "About" section of your HiveManager NG account.

## CSV Parameters
```javascript
var csvFields = ["serialId", "hostName", "model", "policy", "locations", "ip", "subnetMask", "defaultGateway", "osVersion"];
```
This parameter will let you choose which fields will be saved in the CSV file.
### available fields: 
* activeClients
* alarmEvents
* configType
* connected
* cpuUsage
* defaultGateway
* deviceId
* deviceTemplate
* dns
* hostName
* ip
* lastUpdated
* latitude
* locationId
* locations
* longitude
* macAddress
* memUsage
* mgmtStatus
* mode
* model
* ntp
* osVersion
* ownerId
* policy
* serialId
* simulatedDevice
* subnetMask
* upTime
