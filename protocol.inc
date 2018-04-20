<%
var separator			= "||";
// user privalege
var	LIMITUSER 			= 0;
var	NORMALUSER 			= 1;
var	SUPERUSER				= 2;
//
var	DETYPE_STANDARD_A	= 0;
var	DETYPE_STANDARD_B	= 1;
var	DETYPE_ENHANCE	= 2;
var	DETYPE_ADVANCE	= 3;
//
// QueryGPSData
var GPS_ALLDATA 					= 0;
var	GPS_SPEED_DATA 				= 1;

var	GPS_ALL_ALDATA				= 2;
var	GPS_SOS_ALDATA 				= 3;
var	GPS_OVERSPEED_ALDATA 	= 4;
var	GPS_POWEROFF_ALDATA 	= 5;

var	GPS_LAST_DATA 				= 254;
var	GPS_LAST_VALID_DATA 	= 255;

//
// DE Setup
var	CTRL_DE_OIL						=	1;
var	CTRL_DE_DOOR					=	2;
var CTRL_DE_CALLONCE			= 3;
var CTRL_DE_LISTEN				=	4;
var CTRL_DE_TALK					=	5;
var CTRL_DE_CALLMODE			=	6;
var CTRL_DE_SETUPNUM			=	7;
var CTRL_DE_SETUPSERVER		= 8;
var CTRL_DE_SETUPALARM		= 9
	var	TYPE_ALARM_ENABLE		=	0; 	//alarm on/off
	var	TYPE_ALARM_CANCEL		=	255;
	var	TYPE_ALARM_OVERSPEED=	1;	
	var	TYPE_ALARM_PARKING	=	2;	
	var	TYPE_ALARM_ILL_OPEN	=	3;
	var	TYPE_ALARM_TIRED		=	4;
	
var CTRL_DE_RESET					= 10;
var CTRL_DE_RESTORE_FC		= 11;

//
var	ALARM_SOS							= 0x01;
var	ALARM_OVERSPEED				= 0x02;
var	ALARM_PARKING					= 0x04;
var	ALARM_TOW							= 0x08;
var	ALARM_IN_AREA					= 0x10;
var	ALARM_OUT_AREA				= 0x20;
var	ALARM_POWER_OFF				= 0x40;
var	ALARM_LOW_POWER				= 0x80;

var	ALARM_GPSAANTENNA_OPEN= 0x100;
var	ALARM_GPSANTENNA_SHORT= 0x200;
var	ALARM_ILL_DOOROPEN		= 0x400;
var	ALARM_ILL_ACCON				= 0x800;
var ALARM_CUSTOME1				= 0x1000;
var ALARM_CUSTOME2				= 0x2000;
var ALARM_CUSTOME3				= 0x4000;
var ALARM_CUSTOME4				= 0x8000;

var	ALARM_TRIED_DRIVE			= 0x10000;

//
var	HW_ACC							= 0x01;
var	HW_DOOR							= 0x02;
var	HW_MAINPOWER				= 0x04;
var	HW_BACKBATTERY			= 0x08;
var	HW_OIL							= 0x10;
var	HW_SOS							= 0x20;
var	HW_ANTISTEAL				= 0x40;
var	HW_MOTOR						= 0x80;

var	HW_CUSTOME1					= 0x100;
var	HW_CUSTOME2					= 0x200;
var	HW_CUSTOME3					= 0x400;
var	HW_CUSTOME4					= 0x800;
var HW_LOAD							= 0x1000;
var HW_WORK							= 0x2000;
var HW_AD_PANEL					= 0x4000;
var HW_HANDSET					= 0x8000;

var	HW_GPS_SIGNAL				= 0x30000;
var	HW_GSM_SIGNAL				= 0xc0000;

var HW_POWER_VOLTAGE		= 0x1F000000

//============================================
var	CB_MODE_STOP				= 0x00;
var	CB_MODE_BYTIME			= 0x01;
var	CB_MODE_BYDISTANCE	= 0x02;
//============================================
var	CODESTATE_ENABLE		= 0x80;
//////////////////////////////////////////////////////////////////////////////////////////
// get node value£¬text or nodevalue
function getNodeValue( node ){
	
	if( node == null ){
		return "";	
	}	
	var		result = node.text;
	if( result == null ){
		result = node.nodeValue;	
	}
	if( result == null ){
		result = node.textContent;	
	}
	return result;		
}
////////////////////////////////////////////////////////
// Explain ACK 
function parseACKSection( xmlDoc ){
	
	var		result = null;
	var		parNode;
	
	if( xmlDoc != null ){
		result = new Object({
			cmdType		:	"",
			cmdResult	:	0 });
		
		parNode = xmlDoc.getElementsByTagName("ACK")[0];	
		
		result.cmdType = getNodeValue( parNode.getElementsByTagName("TYPE")[0]  );	
		result.cmdResult = parseInt( getNodeValue( parNode.getElementsByTagName("RESULT")[0] ) );	
	}
	return result;	
}

function parseProtocolData( xmlDoc ){
	
	var	result = parseACKSection( xmlDoc );	
	if( (result != null) && result.cmdResult == 1 ){
		switch( result.cmdType ){
		case "CM_LOGIN":
			Session("loginok") = 1;
			parseLoginData( xmlDoc );					
			break;	
		
		case "CM_LOGOUT":
			break;	
			
		case "CM_QUERY_GPSDATA":
		case "CM_QUERY_RAMDATA":
			parseQueryGPSData( xmlDoc );
			break;	
 		
		default:
			break;	
		}		
	}
}
//////////////////////////////////////////////////////////
// Explain LOGIN data
//
function parseLoginData( xmlDoc ){

	var		parNode;
	var		par2Node;
	var		obj;
	var		len;	
	var		i;
	var		deuid;	
	
	parNode = xmlDoc.getElementsByTagName("MAIN_USER")[0];		
	if( parNode != null ){
		gUser.isLogin = true;	
		gUser.userID = 		getNodeValue( parNode.getElementsByTagName("USERID")[0] );
		gUser.userName =	getNodeValue( parNode.getElementsByTagName("USER")[0] );
		gUser.password = 	getNodeValue( parNode.getElementsByTagName("PSD")[0] );
		gUser.fName = 		getNodeValue( parNode.getElementsByTagName("FNAME")[0] );
		gUser.lName = 		getNodeValue( parNode.getElementsByTagName("LNAME")[0] );
		gUser.telNO = 		getNodeValue( parNode.getElementsByTagName("TEL")[0] );
		gUser.email = 		getNodeValue( parNode.getElementsByTagName("EMAIL")[0] );
		gUser.coName = 		getNodeValue( parNode.getElementsByTagName("CONAME")[0] );
		gUser.address = 	getNodeValue( parNode.getElementsByTagName("ADDR")[0] );
		gUser.remark = 		getNodeValue( parNode.getElementsByTagName("REMARK")[0] );
		gUser.privilege = parseInt( getNodeValue( parNode.getElementsByTagName("PRIVILEGE")[0] ) );
		gUser.validDate = parseInt( getNodeValue( parNode.getElementsByTagName("VALIDDATE")[0] ) );
		Session("user") = gUser;
	}
	else{
		return;
	}
	
	// VEHICLE_INFO
	parNode = xmlDoc.getElementsByTagName("VEHICLE_INFO")[0];	
	if( parNode != null ){
		len = parseInt(getNodeValue(parNode.getElementsByTagName("LEN")[0] ) );	
		for( i = 0; i < len; i++ ){
					
			obj = new Object(); 		
			par2Node = parNode.getElementsByTagName("VEHICLE")[i];	
					 
			obj.license		=	getNodeValue( par2Node.getElementsByTagName("LICENSE")[0] );
			obj.deuid			=	getNodeValue( par2Node.getElementsByTagName("DEUID")[0] );
			obj.deType		=	parseInt( getNodeValue( par2Node.getElementsByTagName("DETYPE")[0] ) );
			obj.deSIM			=	getNodeValue( par2Node.getElementsByTagName("DESIM")[0] );
			obj.fName			=	getNodeValue( par2Node.getElementsByTagName("FNAME")[0] );
			obj.lName			=	getNodeValue( par2Node.getElementsByTagName("LNAME")[0] );
			obj.telNO			=	getNodeValue( par2Node.getElementsByTagName("TEL")[0] );
			obj.address		=	getNodeValue( par2Node.getElementsByTagName("ADDR")[0] );		
			obj.remark		=	getNodeValue( par2Node.getElementsByTagName("REMARK")[0] );		
			
			arrVehicle.push( obj );
		}		
		Session("vehiclelist") = arrVehicle;
	}	

}
//////////////////////////////////////////////////////////
// Explain gps data,  return oGPSData obj group
//
function parseQueryGPSData( xmlDoc ){
	
		
	var parNode = xmlDoc.getElementsByTagName("GPS_INFO")[0];	
	if( parNode == null ){
		return;
	}
	
	var len = parseInt( getNodeValue(parNode.getElementsByTagName("LEN")[0] ) );	
	
	
	for( var i = 0; i < len; i++ ){
		var		obj;
		var		par2Node;
		
		obj = new Object(); 				
		par2Node = parNode.getElementsByTagName("GPSINFO")[i];
			 
		obj.deuid			=	getNodeValue( par2Node.getElementsByTagName("DEUID")[0] );
		obj.valid			=	parseInt( 	getNodeValue( par2Node.getElementsByTagName("VALID")[0] ) 	);
		obj.time 			=	parseInt( 	getNodeValue( par2Node.getElementsByTagName("TIME")[0] )  	);
		obj.lng				=	parseFloat(	getNodeValue( par2Node.getElementsByTagName("LON")[0] )    	);
		obj.lat				=	parseFloat(	getNodeValue( par2Node.getElementsByTagName("LAT")[0] )    	);
		obj.speed			=	parseInt(		getNodeValue( par2Node.getElementsByTagName("SPEED")[0] )  	);	
		obj.direction	=	parseInt(		getNodeValue( par2Node.getElementsByTagName("DIRECTION")[0]));
		obj.mileage		=	parseInt( 	getNodeValue( par2Node.getElementsByTagName("MILEAGE")[0] ) );
		obj.alState		=	parseInt( 	getNodeValue( par2Node.getElementsByTagName("ALSTATE")[0] ) );
		obj.hwState		=	parseInt( 	getNodeValue( par2Node.getElementsByTagName("HWSTATE")[0] ) );
		obj.codeState	=	parseInt( 	getNodeValue( par2Node.getElementsByTagName("CODESTATE")[0] ) );
		obj.driveTime=	parseInt( 	getNodeValue( par2Node.getElementsByTagName("DRIVERTIME")[0] ) );
		
		arrGPSData.push( obj );
	}	
	return;	
}
%>