/* #####################################################
 * ###################### USAGE ########################
 * ##################################################### */
// 1. Configure the script below
// 2. Install Node.js from https://www.nodejs.org
// 3. From your CLI or Windows CMD, go to the folder where
//    you saved the script and run "node ./devices.js"


/* #####################################################
 * ############# SCRIPT PARAMETERS #####################
 * ##################################################### */

// ##################### APP parameters ################
// IF YOU ARE USING NG CLOUD:
//    To get them, you'll have to create an account at https://developer.aerohive.com
// IF YOU ARE USING NG-VA:
//    You don't need a developer account, and you can just use, for example:
//    var clientId = "12345";
//    var clientSecret = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";
//    var redirectUrl = "https://127.0.0.1";
var clientId = "xxxxxx";
var clientSecret = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";
var redirectUrl = "https://127.0.0.1";

// #################### HMNG parameters ################
//If you are using a NG cloud, it's something like cloud-xxx.aerohive.com, 
//where xxx can be "va", "va2", "ie" or "aus" (this list may change)
var serverFQDN = "cloud-ie.aerohive.com";
//In NG, go to "Global Settings > API Token Management" and create your token
var accessToken = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";
//The ownerId is the "VHM Id" value in the "About" menu from NG interface
var ownerId = "xxxxxx";


// #################### CSV parameters #################
/*
 available fields: 
  deviceId, ownerId, macAddress, connected, hostName, serialId, model, ip, mode, osVersion, lastUpdated, mgmtStatus, 
  subnetMask, defaultGateway, dns, simType, unAssociatedClientsCount, presenceOn, activeClients, locations
 */
var csvFields = ["serialId", "hostName", "model", "locations", "ip", "subnetMask", "defaultGateway", "osVersion"];







/* #####################################################
 * ####################### SCRIPT ######################
 * ##################################################### */
var http = require("https");
// if NG-VA, do not check SSL certificate
if (!serverFQDN.endsWith(".aerohive.com")) process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";


function sendRequest(paginationOffset, csv, cb) {
  // HTTP Request options and headers
  var monitor_devices_options = {
    "path": '/xapi/v1/monitor/devices?ownerId=' + ownerId + "&page=" + paginationOffset,
    "method": "GET",
    "hostname": serverFQDN,
    "headers": {
      'X-AH-API-CLIENT-SECRET': clientSecret,
      'X-AH-API-CLIENT-ID': clientId,
      'X-AH-API-CLIENT-REDIRECT-URI': redirectUrl,
      'Authorization': "Bearer " + accessToken,
    }
  };

  var result = {};
  result.request = {};
  result.result = {};

  // Generate HTTP Request
  var req = http.request(monitor_devices_options, function (res) {
    var data = '';

    // retrieve HTTP Response parameters
    result.result.status = res.statusCode;
    result.result.headers = JSON.stringify(res.headers);
    res.setEncoding('utf8');

    console.error('\x1b[32mREQUEST QUERY\x1b[0m:', monitor_devices_options.path);
    console.error("\x1b[32mREQUEST HEADERS\x1b[0m:" + JSON.stringify(monitor_devices_options.headers));
    console.error('\x1b[32mREQUEST STATUS\x1b[0m:', result.result.status);

    // Store HTTP Response data
    res.on("data", function (chunk) {
      data += chunk;
    });

    // Execute when the request ends
    res.on("end", function () {
      // Parse HTTP Response data if any
      if (data != '') {
        if (data.length > 400) console.error("\x1b[34mRESPONSE DATA\x1b[0m:", data.substr(0, 400) + '...');
        else console.error("\x1b[32mRESPONSE DATA\x1b[0m:", data);
        
        var dataJson = JSON.parse(data);
        result.data = dataJson.data;
        result.pagination = dataJson.pagination;
        result.error = dataJson.error;
      }
      switch (result.result.status) {
        // If the server responds with HTTP200 = Success
        case 200:
          parseDevices(paginationOffset, result, csv, cb)
          break;
        // else, deals with the error
        default:
          var error = {};
          if (result.error && result.error.status) error.status = result.error.status;
          else error.status = result.result.status;
          if (result.error && result.error.message) error.message = result.error.message;
          else error.message = result.error;
          if (result.error && result.error.code) error.code = result.error.code;
          else error.code = "";
          console.error("\x1b[31mRESPONSE ERROR\x1b[0m:", JSON.stringify(error));
          break;
      }
    });
  });
  req.end();
}


function parseDevices(paginationOffset, result, csv, cb) {

  csv.devicesCount += result.data.length;

  // loop over all the devices list
  result.data.forEach(function (device) {
    // only takes into acount REAL devices (excludes SIMULATED devices from the CSV output)
    if (device.simType == "REAL") {
      // Generates the delive row with the selected fields
      for (let fieldIndex in csvFields) {
        let deviceValue = device[csvFields[fieldIndex]];
        let value = "";
        // if the current field is "locations", reformat the value with the "CSV import" format
        if (csvFields[fieldIndex] == "locations") {
          for (let locationIndex in deviceValue) {
            if (locationIndex != 0) {
              value += deviceValue[locationIndex];
              if (locationIndex != deviceValue.length - 1) value += "|"
            }
          }
        } else if (deviceValue != undefined && value != "null") value = deviceValue;

        csv.outputString += value;
        
        if (fieldIndex != csvFields.length - 1) csv.outputString += ",";
        else csv.outputString += "\r\n"
      }
      csv.realDevicesCount++;
    }
    // end of REAL device "if"
  });

  cb(paginationOffset, result.pagination, csv);
}

function getDevices(paginationOffsetParam, csvParam) {
  let paginationOffset = paginationOffsetParam || 0;
  let csv = csvParam || {
    outputString: "",
    devicesCount: 0,
    realDevicesCount: 0
  }

  sendRequest(paginationOffset, csv, function (paginationOffset, pagination, csv) {
    if (csv.devicesCount < pagination.totalCount) getDevices(paginationOffset + 1, csv)
    else {
      // Generate the line with the CSV fields names
      console.log("#Required fields and fields order for CSV import to HMNG:\r");
      console.log('#Start of Output\r');
      console.log("#{Serial Number},{Host Name},{Device Model},{Device Function},{Network Policy},{Location},{Static IP Address},{Netmask},{Default Gateway},{Country Code},{Wifi0 Radio Profile},{Wifi0 Operation Mode},{Wifi0 Channel},{Wifi0 Power},{Wifi1 Radio Profile},{Wifi1 Operation Mode},{Wifi1 Channel},{Wifi1 Power},{HiveOS},{Supplemental CLI Name}\r");      
      let fieldsString = "#";
      for (let fieldIndex in csvFields) {
        fieldsString += csvFields[fieldIndex];
        if (fieldIndex != csvFields.length - 1) fieldsString += ",";
      }
      console.log(fieldsString + "\r");
      console.log(csv.outputString);
      console.log('#Total # of Devices: ' + csv.devicesCount + "\r");
      console.log('#Total # of Real Devices: ' + csv.realDevicesCount + "\r");
      console.log('#End of Output\r');
      console.error('\x1b[32mSUCCESS\x1b[0m: The process ended without error.')
    }
  })
}


// ENTRY POINT
getDevices(0);


