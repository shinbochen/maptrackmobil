<html xmlns="http://www.w3.org/1999/xhtml" >	
<%@language="javascript"   CODEPAGE="65001"%>
<% 
Session.CodePage=65001;
Response.Charset = "utf-8";
%>

<!--#include file="ajax.inc"-->
<!--#include file="protocol.inc"-->
<head>
<meta http-equiv="Cache-Control" content="no-cache"/>
<meta http-equiv="refresh" content="30"/>
<title>::Welcome To MapTrack Mobile System::</title>
</head>
<body style="padding-right: 0px; padding-left: 0px; padding-bottom: 0px; margin: 0px; padding-top: 0px; font-size: 9pt; font-family:Arial;">

<%	
	var		cmd;	
	var		zoom;
	var		lat;
	var		lng;
	var		url;
	var		cursel;
	var		flag;
	var		tmpdata;
	var 	maptype;
	
	var		gUser			 = new Object();
	var		arrVehicle = new Array(); 
	var		arrGPSData = new Array();
	var		key = "ABQIAAAAVr5U0W2jmCzWyWzCO9FBvBTFnBLixAe4YRBR1rVsSZRky74h3BRzKimdo31zAfVuDRz5vmYGEIDK6g";
	var		gpsdata = null;

	function UTCtoLocal( UTC ){
	
		var 	zone;
		var		d = new Date( UTC*1000 );	
		//if( TEISLOCAL ){
			zone = 0;
		//}	
		//else{
		//	zone = d.getTimezoneOffset()*60*1000;
		//}
		//d.setTime( d.getTime()-zone );
		return d;
	}

	if( Session("user") != null ){
		gUser = Session("user");	
	}
	if( Session("vehiclelist") != null ){
		arrVehicle = Session("vehiclelist");		
	}
	if( Session("cursel") != null ){
		cursel = Session("cursel");	
	}
	if( Request.QueryString("vehicle").count != 0  ){
		cursel = String(Request("vehicle"));				
		Session("cursel") = cursel;		
	}
	
	
	zoom = Number( Request("zoom") );
	cmd = Number( Request("cmd") );
	maptype = String(Request("maptype"));
	
	if( typeof( maptype ) == "undefined"  ||	maptype == "undefined" ){
		if( Session("maptype") == null ){		
			Session("maptype") = "hybrid";
		}
		maptype = Session("maptype");
	}
	else{
		Session("maptype") = maptype;
	}
	
	if( isNaN( cmd ) ){
		cmd = 0;
	}
		
	if(  gUser.isLogin != true ){
			
		// initial value
		Session("zoom") = 12;				
		tmpdata = "?cmd=99&user="+Request("LoginUser")+"&psd="+Request("LoginPsd");
		SySendXMLData( tmpdata );	
	}
	else if( isNaN(zoom) == false && Session("zoom") != zoom ){
	
			Session("zoom") = zoom;				
			lat	= Session("lat");
			lng = Session("lng");	
	}
	else{	
		
		var		detype = "";		
		for( var i = 0; i < arrVehicle.length; i++ ){
			if( cursel == arrVehicle[i].deuid ){
				detype = arrVehicle[i].deType;
				break;
			}		
		}
		
		tmpdata = "?cmd="+cmd+"&userid="+gUser.userID+"&deuid="+cursel+"&detype="+detype;
		SySendXMLData( tmpdata );		
		if( cmd == 88 ){
			gUser.isLogin = false;
			Response.redirect( "index.html" );
		}
		
		Session("lat") = 0;
		Session("lng") = 0;
		
		for( var i = 0; i < arrGPSData.length; i++ ){			
			if( arrGPSData[i].deuid == cursel ){
				gpsdata = arrGPSData[i];
				Session("lat") = arrGPSData[i].lat;
				Session("lng") = arrGPSData[i].lng;
				break;
			}		
		}		
		
		zoom = Session("zoom");
		lat = Session("lat");
		lng = Session("lng");
	}
	
	url = "http://maps.google.com/maps/api/staticmap?center="+lat+","+lng+"&zoom="+zoom+"&mobile=true&sensor=false"+"&maptype="+maptype+"&size=240x320&markers=color:red|label:Y|"+lat+","+lng;
	
%>
<%
	if( gUser.isLogin == true ){
%>
	
	<div style="left:0px;top:0px;height:320px;width:240px;position:absolute;zIndex:1;background-image: url(<%=url%>);background-repeat: no-repeat;">
	<form method="get" action="index.asp" style="border:2px dotted #0000FF; padding:2px; background-color: #3C78CE; width:235;height:26; top:0; ">
		<select size="1" name="vehicle"  style="width: 90">
<%		
		// onchange="this.form.reset(); this.form.submit()"
		Response.write( "<option selected value=\"0\">-----</option>" );
		for( var i = 0; i < arrVehicle.length; i++ ){		
			if( arrVehicle[i].deuid == cursel ){
				Response.write( "<option selected value=\"" + arrVehicle[i].deuid + "\">" + arrVehicle[i].license + "</option>" );			
			}
			else{
				Response.write( "<option value=\"" + arrVehicle[i].deuid + "\">" + arrVehicle[i].license + "</option>" );
			}		
		}		
%>	
		</select> :
		<select size="1" name="cmd" style="width: 80">
		<option value="0">-----</option>
		<option value="1">Track Once</option>
		<option value="2">Fuel Off</option>
		<option value="3">Fuel On</option>
		<option value="4">Door Lock</option>
		<option value="5">Door Unlock</option>
		<option value="6">Restart</option>
		</select>
		<input type="image" value="ok" src="image\ok.jpg">
		<a href="?cmd=88"><img src="image\exit.jpg" border="0" ></img></a> <br />
<%
		if( gpsdata != null ){
			var		d = UTCtoLocal(gpsdata.time);			
			Response.Write( d.getMonth()+1 + "/"+ d.getDate() + " " +d.getHours() + ":"+ d.getMinutes()+":"+ d.getSeconds()+ " >>> " );
			Response.Write( gpsdata.speed+"km/h" );
			if( gpsdata.alState > 0 ){
				Response.Write( "<img src=\"image\\alarm.gif\" border=\"0\">" );
			}
			if( gpsdata.codeState > 0 ){
				switch( gpsdata.codeState & 0x7F ){
				case 1:
					Response.write( ",Fuel off" );
					break;
				case 2:
					Response.write( ",Fuel on" );
					break;
				case 3:
					Response.write( ",lock door" );
					break;
				case 4:
					Response.write( ",unlock door" );
					break;
				case 5:
					Response.write( ",Load default" );
					break;
				case 6:
					Response.write( ",Restart" );
					break;
				case 7:
					Response.write( ",listen" );
					break;
				case 8:
					Response.write( ",talk" );
					break;
				case 9:
					Response.write( ",Setup" );
					break;		
				}
				if( gpsdata.codeState & 0x80 ){
					Response.write( " ok!" );
				}
				else{
					Response.write( " fail!" );				
				}
			}
		}
%>		
	</form>
	<br/>
	<a href="?zoom=<%=zoom+1%>"><img src="image\zoomin.gif" border="0"></a> <br/>
	<a href="?zoom=<%=zoom-1%>"><img src="image\zoomout.gif" border="0"></a><br/>
	<a href="?maptype=hybrid">hybird</a> <br />
  <a href="?maptype=roadmap">roadmap</a> <br />
  <a href="?maptype=terrain">terrain</a>
	<br />
	<br />
	<br />
	<br />	
	<br />
	<br />
	<br />
	<br />
	<br />
	<br />
	<br />
	<br />	
	<br />	
	<br />	
	
	
	</div>
	
<%
	}
	else{
		Response.write( "Login Failed, please <a href=\"index.html\">retry it</a>");
	}	
%>
</body>
</html>
