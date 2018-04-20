<%
var	isIE = true;
var	gUrl = "http://203.86.9.28:8888/simple/GotData.asp";
//var	gUrl = "http://www.china.com/";
var	gXmlDoc = null;
var gXmlRequest = null;


function initXmlDoc(){
	var	xmlDoc = null;
	var aVersions = [
					 "MSXML2.DOMDocument.5.0",
					 "MSXML2.DOMDocument.4.0",
					 "MSXML2.DOMDocument.3.0",
					 "MSXML2.DOMDocument",
					 "Microsoft.XmlDom"];
	for(var i=0; i < aVersions.length;i++){
		try{
			xmlDoc = Server.CreateObject(aVersions[i]);
			if( xmlDoc != null ){
				break;	
			}
		}
		catch(e){
			//Response.write( aVersions[i]+"MSXML is not installed<br>");
		}
	}
	if( xmlDoc == null ) {
		Response.write("Create XmlDoc Object Error");
		Response.end();
	}
	return xmlDoc;
}
function initXmlRequest( ){

	var	xmlRequest = null;
	var aVersions = [
					 "MSXML2.XMLHTTP",
					 "Microsoft.XMLHTTP"];

	for(var i=0; i < aVersions.length;i++){
		try{
			xmlRequest = Server.CreateObject(aVersions[i]);
			if( xmlRequest != null ){
				break;	
			}
		}
		catch(e){
			//Response.write( aVersions[i]+"XMLHTTP is not installed<br>");
		}
	}
	return xmlRequest;	
}
function parseXML( xmldata ){
	if( isIE ){
		gXmlDoc.loadXML(xmldata);
		return gXmlDoc;			
	}
	else{
		var result = gXmlDoc.parseFromString( xmldata, 'text/xml' );
		return result;
	}	
}


function RecvXMLData(){	
	
	if(gXmlRequest.readyState == 4)	{
		
		if (gXmlRequest.status == 200){	
			//Response.Write( gXmlRequest.responseText );
			parseProtocolData( parseXML( gXmlRequest.responseText) );		
		}
		else{
			Response.Write( "RecvXMLData error!"+gXmlRequest.status );
		}
	}
}


function AsySendXMLData( xmldata )
{
	if( gXmlRequest != null ){
		gXmlRequest.open("POST", gUrl+xmldata, true ); 
		gXmlRequest.onreadystatechange = RecvXMLData;  
		gXmlRequest.setRequestHeader("Content-Type", "text/html"); 
		gXmlRequest.send(xmldata); 
	}
}

function SySendXMLData( xmldata ){	
	if( gXmlRequest != null ){
		gXmlRequest.open("POST", gUrl+xmldata, false);  
		gXmlRequest.onreadystatechange = RecvXMLData;      
		gXmlRequest.setRequestHeader("Content-Type", "text/html");		
		gXmlRequest.send(xmldata);  		
	}
}
if( Session("xmldoc") == null ){
	gXmlDoc = initXmlDoc();	
	Session("xmldoc") = gXmlDoc;	
}
else{
	gXmlDoc = Session("xmldoc");		
}

if( Session("xmlrequest") == null ){
	gXmlRequest = initXmlRequest( );
	//Response.write( "xmlrequest"+gXmlRequest );
	Session("xmlrequest") = gXmlRequest;
}
else{
	gXmlRequest = Session("xmlrequest");
	//Response.write( "xmlrequest from session"+gXmlRequest );
}
%>
