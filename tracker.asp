<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<%@language="javascript"   CODEPAGE="65001"%>
<head>
<title>GPS Tracker</title>
</head>
<%
    var	lat = Number( Request("lat"));
    var lng = Number( Request("lng"));
    var lvl = Number( Request("lvl"));
		var key = Request("key");
		var maptype = Request("maptype")
    
    var	wt = Number( Request("wt"));   
    var	ht = Number( Request("ht"));   
    if (!lvl ){
			lvl=13; 
		}
		if( !wt ){
			wt = 800;
		}
		
		if( !ht ){
			ht = 800;		
		}
		if( !maptype ){
			maptype = "hybrid";
		}
				
		var bj= "url(http://maps.google.com/maps/api/staticmap?"
						+"center=" + lat +","+ lng
						+"&zoom=" + lvl
						+"&size="+ wt +'x'+ ht
						+"&maptype=" + maptype 
						+"&markers=color:blue|label:Y|"+lat+','+lng
						+"&mobile=true&sensor=false);background-repeat:no-repeat;";						
						
					

%>
<body style="padding-right: 0px; padding-left: 0px; padding-bottom: 0px; margin: 0px; padding-top: 0px; font-size: 9pt; font-family:Arial;">

<div style="left:0px;top:0px;position:absolute;zIndex:1;height:<%=ht%>px;width:<%=wt%>px;">
	 <table cellpadding="0" cellspacing="0" style=" background-image:<%=bj%>; height:<%=ht%>px; width:<%=wt%>px;">
        <tr>
            <td valign=top>
            	  <a href=tracker.asp?lat=<%=lat%>&lng=<%=lng%>&lvl=<%=lvl+1%>&key=<%=key%>&maptype=<%=maptype%>&wt=<%=wt%>&ht=<%=ht%> ><img src="image\zoomin.gif" border="0"></a><br>
                <a href=tracker.asp?lat=<%=lat%>&lng=<%=lng%>&lvl=<%=lvl-1%>&key=<%=key%>&maptype=<%=maptype%>&wt=<%=wt%>&ht=<%=ht%> ><img src="image\zoomout.gif" border="0"></a><br>
                <a href=tracker.asp?lat=<%=lat%>&lng=<%=lng%>&lvl=<%=lvl+1%>&key=<%=key%>&maptype=hybrid&wt=<%=wt%>&ht=<%=ht%>>hybrid</a> <br>
                <a href=tracker.asp?lat=<%=lat%>&lng=<%=lng%>&lvl=<%=lvl+1%>&key=<%=key%>&maptype=roadmap&wt=<%=wt%>&ht=<%=ht%>>roadmap</a> <br>
                <a href=tracker.asp?lat=<%=lat%>&lng=<%=lng%>&lvl=<%=lvl-1%>&key=<%=key%>&maptype=terrain&wt=<%=wt%>&ht=<%=ht%>>terrain</a><br>
     
  		 			</td>
        </tr>
    </table>
</div>
</body>
</html>
