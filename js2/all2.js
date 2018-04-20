
function ltMapPanel(config){
var self=this;
self.zoomLevel=12;
self.city='xian';
self.lat=35.0000;
self.lng=101.8;
self.ltmaps=null;
self.mapobjs=new Array();
self.init=function(contentEl){
self.contentEl=contentEl;
var	newDiv=document.getElementById(contentEl);
if(newDiv==null){
var newDiv=document.createElement("div");
newDiv.id=contentEl;
newDiv.style.position="absolute";
newDiv.style.zIndex="10";
newDiv.style.width="100%";
newDiv.style.height="100%";
document.body.appendChild(newDiv);}
self.ltmaps=new LTMaps(self.contentEl);
if(self.lat!=null){
self.getMap().centerAndZoom(new LTPoint(self.getltmaplng(self.lng),self.getltmaplat(self.lat)),self.zoomLevel);}
else{
self.getMap().cityNameAndZoom(self.city,self.zoomLevel);}
var LTScaleCtrl=new LTScaleControl();
LTScaleCtrl.setRight(10);
LTScaleCtrl.setTop(10);
self.getMap().addControl(LTScaleCtrl);
self.getMap().handleKeyboard();
self.getMap().handleMouseScroll();
self.getMap().addControl(new LTStandMapControl());
self.getMap().addControl(new LTOverviewMapControl());
self.oMeasureTool=new LTPolyLineControl();
self.oMeasureTool.setVisible(false);
self.getMap().addControl(self.oMeasureTool);
self.getMap().resizeMapDiv();
self.load=true;
self.ltAreaTool=new LTAreaTool(self.getMap(),self);
self.ltPointTool=new LTPointTool(self.getMap(),self);}
self.zoomIn=function(){
self.getMap().zoomIn();};
self.zoomOut=function(){
self.getMap().zoomOut();};
self.zoomAll=function(){
self.getMap().centerAndZoom("xian",12);};
self.getltmaplng=function(lng){
return lng*100000+460;};
self.getltmaplat=function(lat){
return lat*100000-270;};
self.getlngFromltmap=function(ltlng){
return(ltlng-460)/100000;};
self.getlatFromltmap=function(ltlat){
return(ltlat+270)/100000;};
self.getMap=function(){
return self.ltmaps;};
self.onResize=function(w,h){
if(self.load==true){
self.getMap().resizeMapDiv();}};
self.setSize=function(width,height,animate){
if(self.load==true){
self.ltmaps.resizeMapDiv();}};
self.center=function(lng,lat){
self.getMap().moveToCenter(new LTPoint(self.getltmaplng(lng),self.getltmaplat(lat)));};
self.centerAndZoom=function(lng,lat,zoom){
lng=parseFloat(lng);
lat=parseFloat(lat);
zoom=parseInt(zoom);
self.getMap().centerAndZoom(new LTPoint(self.getltmaplng(lng),self.getltmaplat(lat)),zoom);},
self.getCenter=function(){
return self.getMap().getCenterPoint();};
self.getCenterLatLng=function(){
var ll=self.getMap().getCenterPoint();
return{
lat:self.getlatFromltmap(ll.getLatitude()),
lng:self.getlngFromltmap(ll.getLongitude()),
zoom:self.getMap().getCurrentZoom()};};
self.deleteAll=function(){
self.getMap().clearOverLays();};
self.bestMaps=function(arrPoints){
var points=new Array();
for(var i=0;i<arrPoints.length;i++){
points.push(new LTPoint(self.getltmaplng(arrPoints[i].lng),self.getltmaplat(arrPoints[i].lat)));}
self.getMap().getBestMap(points);};
self.getAddress=function(obj,successfunc){};
self.mapobj=function(uiid){
this.uiid=uiid;
this.obj=new Array();};
self.getmapobj=function(uiid){
var obj=null;
for(var i=0;i<self.mapobjs.length;i++){
if(self.mapobjs[i].uiid==uiid){
obj=self.mapobjs[i];
self.mapobjs.splice(i,1);
break;}}
if(obj==null){
obj=new self.mapobj(uiid);}
return obj;};
self.searchAddress=function(address){
try{
self.getMap().cityNameAndZoom(address,5);}
catch(e){}};
self.addmapobj=function(mapobj){
self.mapobjs[self.mapobjs.length]=mapobj;};
self.removemaker=function(mapobj){
var			obj;
while(1){
obj=mapobj.obj.pop();
if(obj==undefined){
break;}
else{
self.getMap().removeOverLay(obj);}}};
self.deleteMarker=function(uiid){
self.removemaker(self.getmapobj(uiid));};
self.addMarker=function(obj){
var mapobj=self.getmapobj(obj.uiid);
self.removemaker(mapobj);
var	icon=new LTIcon();
if(obj.icon!=null){
icon.setImageUrl(obj.icon);}
var point=new LTPoint(self.getltmaplng(obj.lng),self.getltmaplat(obj.lat));
var markobj=new LTMarker(point,icon);
var textobj=new LTMapText(markobj);
textobj.setLabel(obj.name);
self.getMap().addOverLay(markobj);
mapobj.obj[0]=markobj;
self.getMap().addOverLay(textobj);
mapobj.obj[1]=textobj;
LTEvent.addListener(markobj,"mouseover",function(){var win=markobj.openInfoWinHtml(obj.description);win.closeInfoWindowWithMouse();});
if(obj.showInfo&&obj.showInfo==true){
markobj.openInfoWinHtml(obj.description);}
self.addmapobj(mapobj);};
self.addLine=function(obj){
if(obj.points.length<2){
return;}
var mapobj=self.getmapobj(obj.uiid);
self.removemaker(mapobj);
var points=new Array();
for(var i=0;i<obj.points.length;i++){
points.push(new LTPoint(self.getltmaplng(obj.points[i].lng),self.getltmaplat(obj.points[i].lat)));}
if(obj.color==null){
obj.color="red";}
if(obj.linestyle==null){
obj.linestyle="LongDash";}
if(obj.linewidth==null){
obj.linewidth=1;}
if(obj.opacity==null){
obj.opacity=0.9;}
if(obj.startlinearrow==null){
obj.startlinearrow="close";}
if(obj.stoplinearrow==null){
obj.stoplinearrow="Open";}
var polyLine=new LTPolyLine(points);
polyLine.setLineColor(obj.color);
polyLine.setLineStyle(obj.linestyle);
polyLine.setLineStroke(obj.linewidth);
polyLine.setOpacity(obj.opacity);
polyLine.setLineArrow(obj.startlinearrow,obj.stoplinearrow);
self.getMap().addOverLay(polyLine);
mapobj.obj[0]=polyLine;
self.addmapobj(mapobj);};
self.addTriAngle=function(obj){
var		x=parseFloat(obj.lng);
var		y=parseFloat(obj.lat);
nLen=self.getMap().getZoomUnits(self.getMap().getCurrentZoom())/6000;
direction=270-obj.direction;
var	points=new Array();
points.push(new mapPoint(x,y));
points.push(new mapPoint(GetX1Point(x,direction,nLen),GetY1Point(y,direction,nLen)));
points.push(new mapPoint(GetX2Point(x,direction,nLen),GetY2Point(y,direction,nLen)));
points.push(new mapPoint(GetX3Point(x,direction,nLen),GetY3Point(y,direction,nLen)));
self.addPolygon({
uiid:obj.uiid,
name:obj.name,
points:points,
color:obj.color,
icon:obj.icon});
return true;};
self.addPolygon=function(obj){
if(obj.points.length<3){
return;}
var mapobj=self.getmapobj(obj.uiid);
self.removemaker(mapobj);
var points=new Array();
for(var i=0;i<obj.points.length;i++){
points.push(new LTPoint(self.getltmaplng(obj.points[i].lng),self.getltmaplat(obj.points[i].lat)));}
var oPolygon=new LTPolygon(points);
if(obj.color==null){
obj.color="red";}
if(obj.linewidth==null){
obj.linewidth=1;}
if(obj.opacity==null){
obj.opacity=0.6;}
oPolygon.setLineColor(obj.color);
oPolygon.setLineStroke(obj.linewidth);
oPolygon.setFillColor(obj.color);
oPolygon.setOpacity(obj.opacity);
self.getMap().addOverLay(oPolygon);
mapobj.obj.push(oPolygon);
var textobj=new LTMapText(new LTPoint(self.getltmaplng(obj.lng),self.getltmaplat(obj.lat)));
textobj.setLabel(obj.name);
this.getMap().addOverLay(textobj);
mapobj.obj.push(textobj);
LTEvent.addListener(textobj,"mouseover",function(){
var win=textobj.openInfoWinHtml(obj.description);
win.closeInfoWindowWithMouse();});
if(obj.showInfo&&obj.showInfo==true){
textobj.openInfoWinHtml(obj.description);}
self.addmapobj(mapobj);};
self.measure=function(){
self.oMeasureTool.btnClick();};
self.addFence=function(){
self.ltAreaTool.click();};
self.addPoint=function(){
self.ltPointTool.click();};
self.print=function(){
var html="<!DOCTYPE HTML PUBLIC '-//W3C//DTD HTML 4.01 Transitional//EN\'>\n";
html+=(document.all)?"<html xmlns:v=\"urn:schemeas-microsoft-com:vml\">":"<html>";
html+="\n<head>\n<meta http-equiv=\"Content-Type\" content=\"text/html; charset=gb2312\">\n<title>Print Maps<\/title>\n";
html+="<style type=\"text\/css\">\nbody {margin: 0px;}\n";
html+=(document.all)?"v\\:*{ Behavior:url(#default#VML);}":"";
html+="\n</style>\n";
html+="<\/head>\n";
html+="<body><center>\n";
html+=self.getMap().getMapContent(0);
html+="\n<\/center><\/body>\n<\/html>";
var win=document.open("about:blank","win","menubar=1,width="+self.getMap().container.offsetWidth+",height="+(self.getMap().container.offsetHeight-20)+"\"");
win.document.writeln(html);
win.document.close();};
self.IsContainPoint=function(obj){
var bounds=self.getMap().getBoundsLatLng();
return bounds.containsPoint(new LTPoint(self.getltmaplng(obj.lng),self.getltmaplat(obj.lat)));};}
function LTAreaTool(map,panel){
this.map=map;
this.panel=panel;
this.ptFirst;
this.ptSecond;
this.polyobj=null;
this.drawing=false;
var self=this;
var mouseDownHandler=function(p){
var point=self.map.getClickLatLng(p);
self.ptFirst=new mapPoint(panel.getlngFromltmap(point.getLongitude()),panel.getlatFromltmap(point.getLatitude()));
self.drawing=true;};
var	mouseMoveHandler=function(p){
var point=self.map.getClickLatLng(p);
if(self.drawing){
var		points=new Array();
self.ptSecond=new mapPoint(panel.getlngFromltmap(point.getLongitude()),panel.getlatFromltmap(point.getLatitude()));
if(self.polyobj!=null){
self.map.removeOverLay(self.polyobj);
self.polyobj=null;}
points.push(new LTPoint(self.panel.getltmaplng(self.ptFirst.lng),self.panel.getltmaplat(self.ptFirst.lat)));
points.push(new LTPoint(self.panel.getltmaplng(self.ptFirst.lng),self.panel.getltmaplat(self.ptSecond.lat)));
points.push(new LTPoint(self.panel.getltmaplng(self.ptSecond.lng),self.panel.getltmaplat(self.ptSecond.lat)));
points.push(new LTPoint(self.panel.getltmaplng(self.ptSecond.lng),self.panel.getltmaplat(self.ptFirst.lat)));
self.polyobj=new LTPolygon(points);
self.polyobj.setLineColor("blue");
self.polyobj.setLineStroke(1);
self.polyobj.setFillColor("blue");
self.polyobj.setOpacity(0.6);
self.map.addOverLay(self.polyobj);}};
var mouseUpHandler=function(e){
LTEvent.removeListener(self.listener1);
LTEvent.removeListener(self.listener2);
LTEvent.removeListener(self.listener3);
if(self.drawing==true){
var		lat1=parseFloat(self.ptFirst.lat.toFixed(6));
var		lng1=parseFloat(self.ptFirst.lng.toFixed(6));
var		lat2=parseFloat(self.ptSecond.lat.toFixed(6));
var		lng2=parseFloat(self.ptSecond.lng.toFixed(6));
saveFence({
lat1:lat1,
lng1:lng1,
lat2:lat2,
lng2:lng2})}
self.map.enableDrag();};
this.click=function(){
self.map.disableDrag();
self.drawing=false;
if(self.polyobj!=null){
self.map.removeOverLay(self.polyobj);
self.polyobj=null;}
self.ptFirst=null;
self.ptSecond=null;
self.listener1=LTEvent.addListener(self.map,"mousedown",mouseDownHandler);
self.listener2=LTEvent.addListener(self.map,"mousedrag",mouseMoveHandler);
self.listener3=LTEvent.addListener(self.map,"mouseup",mouseUpHandler);}}
function LTPointTool(map,panel){
var self=this;
self.map=map;
self.panel=panel;
var onMapCLick=function(p){
var point=self.map.getClickLatLng(p);
savePOI({
lat:self.panel.getlatFromltmap(point.getLatitude()),
lng:self.panel.getlngFromltmap(point.getLongitude())});
self.destroy();}
self.destroy=function(){
LTEvent.removeListener(self.listener);}
self.click=function(){
self.listener=LTEvent.addListener(self.map,"click",onMapCLick);}}
function veMapPanel(config){
var self=this;
self.zoomLevel=2;
self.lat=35.0000;
self.lng=101.8;
self.vemaps=null;
self.mapobjs=new Array();
self.init=function(contentEl){
self.contentEl=contentEl;
var	newDiv=document.getElementById(contentEl);
if(newDiv==null){
var newDiv=document.createElement("div");
newDiv.id=contentEl;
newDiv.style.position="absolute";
newDiv.style.zIndex="10";
newDiv.style.width="100%";
newDiv.style.height="100%";
document.body.appendChild(newDiv);}
self.vemaps=new VEMap(self.contentEl);
self.getMap().LoadMap(new VELatLong(self.lat,self.lng,0,VEAltitudeMode.RelativeToGround),self.zoomLevel,VEMapStyle.Road,false,VEMapMode.Mode2D,true,1);
self.load=true;
self.veTool=new VEAreaTool(self.vemaps);
self.vePointTool=new VEPointTool(self.vemaps,self);}
self.zoomIn=function(){
self.getMap().ZoomIn();};
self.zoomOut=function(){
self.getMap().ZoomOut();};
self.zoomAll=function(){
self.getMap().SetCenterAndZoom(new VELatLong(self.lat,self.lng),self.zoomLevel);};
self.getMap=function(){
return self.vemaps;};
self.setSize=function(owidth,oheight,animate){
if(self.load==true){
if(typeof(owidth)=='object'){
self.getMap().Resize(owidth.width-2,owidth.height-28);}
else{
self.getMap().Resize(owidth-2,oheight-28);}}};
self.center=function(lng,lat){
self.getMap().SetCenter(new VELatLong(lat,lng));};
self.centerAndZoom=function(lng,lat,zoom){
lng=parseFloat(lng);
lat=parseFloat(lat);
zoom=parseInt(zoom);
self.getMap().SetCenterAndZoom(new VELatLong(lat,lng),zoom);},
self.getCenter=function(){
var		centerlatlng=self.getMap().GetCenter();
return({lat:centerlatlng.Latitude,lng:centerlatlng.Longitude});};
self.getCenterLatLng=function(){
var ll=self.getMap().GetCenter();
return{lat:ll.Latitude,
lng:ll.Longitude,
zoom:self.getMap().GetZoomLevel()};};
self.deleteAll=function(){
self.getMap().DeleteAllShapes();};
self.bestMaps=function(arrPoints){
var points=new Array();
var	x0=0,y0=0;
var x1=0,y1=0;
if(arrPoints.length<2){
return;}
x0=arrPoints[0].lng;
y0=arrPoints[0].lat;
x1=x0;
y1=y0;
for(var i=1;i<arrPoints.length;i++){
if(arrPoints[i].lng<x0){
x0=arrPoints[i].lng;}
else if(arrPoints[i].lng>x1){
x1=arrPoints[i].lng;}
if(arrPoints[i].lat<y0){
y0=arrPoints[i].lat;}
else if(arrPoints[i].lat>y1){
y1=arrPoints[i].lat;}}
var	bounds=new VELatLongRectangle(
new VELatLong(y1,x0),
new VELatLong(y0,x1));
self.getMap().SetMapView(bounds);};
self.searchAddress=function(address,zoom){
results=self.getMap().Find("",
address,
null,
null,
0,
1,
true,
true,
true,
true,
null);};
self.getAddress=function(obj,successfunc){};
self.mapobj=function(uiid){
this.uiid=uiid;
this.obj=new Array();};
self.getmapobj=function(uiid){
var obj=null;
for(var i=0;i<self.mapobjs.length;i++){
if(self.mapobjs[i].uiid==uiid){
obj=self.mapobjs[i];
self.mapobjs.splice(i,1);
break;}}
if(obj==null){
obj=new self.mapobj(uiid);}
return obj;};
self.addmapobj=function(mapobj){
self.mapobjs[self.mapobjs.length]=mapobj;};
self.removemaker=function(mapobj){
var			obj;
while(1){
obj=mapobj.obj.pop();
if(obj==undefined){
break;}
else{
self.getMap().DeleteShape(obj);}}};
self.deleteMarker=function(name){
self.removemaker(self.getmapobj(name));};
self.addMarker=function(obj){
var mapobj=self.getmapobj(obj.uiid);
self.removemaker(mapobj);
var	markobj=new VEShape(VEShapeType.Pushpin,new VELatLong(obj.lat,obj.lng));
markobj.SetTitle(obj.name);
markobj.SetDescription(obj.description);
markobj.SetMoreInfoURL(self.homeurl);
markobj.SetPhotoURL(self.logo);
markobj.SetCustomIcon(obj.icon);
self.getMap().AddShape(markobj);
mapobj.obj[0]=markobj;
self.addmapobj(mapobj);};
self.addLine=function(obj){
if(obj.points.length<2){
return;}
var mapobj=self.getmapobj(obj.uiid);
self.removemaker(mapobj);
var			points=new Array();
for(var i=0;i<obj.points.length;i++){
points.push(new VELatLong(obj.points[i].lat,obj.points[i].lng));}
var lineobj=new VEShape(VEShapeType.Polyline,points);
if(obj.linewidth==null){
obj.linewidth=1;}
obj.linewidth*=4;
if(obj.color==null){
obj.color="#ff0000";}
var r=parseInt(obj.color.substr(1,2),16);
var g=parseInt(obj.color.substr(3,2),16);
var b=parseInt(obj.color.substr(5,2),16);
lineobj.SetLineWidth(obj.linewidth);
lineobj.SetLineColor(new VEColor(r,g,b,0.8));
lineobj.HideIcon();
self.getMap().AddShape(lineobj);
mapobj.obj.push(lineobj);
self.addmapobj(mapobj);};
self.addTriAngle=function(obj){
var		x=parseFloat(obj.lng);
var		y=parseFloat(obj.lat);
var		nLen;
var		lat1;
var		lat2;
var 	bounds=self.getMap().GetMapView();
lat1=bounds.BottomRightLatLong.Latitude;
lat2=bounds.TopLeftLatLong.Latitude;
lat2-=lat1;
var		nSize=(bounds.BottomRightLatLong.Longitude-bounds.TopLeftLatLong.Longitude)*4000;
nLen=60*lat2/nSize;
direction=270-obj.direction;
var	points=new Array();
points.push(new mapPoint(x,y));
points.push(new mapPoint(GetX1Point(x,direction,nLen),GetY1Point(y,direction,nLen)));
points.push(new mapPoint(GetX2Point(x,direction,nLen),GetY2Point(y,direction,nLen)));
points.push(new mapPoint(GetX3Point(x,direction,nLen),GetY3Point(y,direction,nLen)));
self.addPolygon({
uiid:obj.uiid,
name:obj.name,
points:points,
color:obj.color,
icon:obj.icon});
return true;};
self.addPolygon=function(obj){
if(obj.points.length<3){
return;}
var mapobj=self.getmapobj(obj.uiid);
self.removemaker(mapobj);
var			points=new Array();
for(var i=0;i<obj.points.length;i++){
points.push(new VELatLong(obj.points[i].lat,obj.points[i].lng));}
var r=parseInt(obj.color.substr(1,2),16);
var g=parseInt(obj.color.substr(3,2),16);
var b=parseInt(obj.color.substr(5,2),16);
var polyobj=new VEShape(VEShapeType.Polygon,points);
polyobj.SetLineWidth(2);
polyobj.SetLineColor(new VEColor(r,g,b,1.0));
polyobj.SetFillColor(new VEColor(r,g,b,0.5));
polyobj.SetTitle(obj.name);
polyobj.SetDescription(obj.description);
polyobj.SetMoreInfoURL(self.homeurl);
polyobj.SetPhotoURL(self.logo);
polyobj.HideIcon();
if(obj.icon!=null){
var	markobj=new VEShape(VEShapeType.Pushpin,new VELatLong(obj.points[0].lat,obj.points[0].lng));
markobj.SetCustomIcon(obj.icon);
self.getMap().AddShape(markobj);
mapobj.obj.push(markobj);}
self.getMap().AddShape(polyobj);
mapobj.obj.push(polyobj);
self.addmapobj(mapobj);
return;};
self.measure=function(){
alert('NG');};
self.addFence=function(){
self.veTool.click();};
self.addPoint=function(){
self.vePointTool.click();};
self.print=function(){
var obj=document.getElementById(self.contentEl);
var content=obj.innerHTML;
var html="<html>"+"<head><title>Print Maps</title></head>"+"<body  style='margin:0;overflow:hidden;'>"+content+"</body>"+"</html>";
var win=window.open("","win","","width=100%,height=100%");
win.document.writeln(html);
win.document.close();};
self.IsContainPoint=function(obj){
var 	bounds=self.getMap().GetMapView();
var lng1=bounds.TopLeftLatLong.Longitude;
var lng2=bounds.BottomRightLatLong.Longitude;
var lat1=bounds.BottomRightLatLong.Latitude;
var lat2=bounds.TopLeftLatLong.Latitude;
if(obj.lat>=lat1&&obj.lat<=lat2&&
obj.lng>=lng2&&obj.lng<=lng2){
return true;}
else{
return false;}};}
function VEAreaTool(map){
this.map=map;
this.ptFirst;
this.ptSecond;
this.polyobj=null;
this.drawing=false;
var self=this;
var mouseDownHandler=function(e){
self.ptFirst=map.PixelToLatLong(new VEPixel(e.mapX,e.mapY));
self.drawing=true;};
var	mouseMoveHandler=function(e){
if(self.drawing){
self.ptSecond=map.PixelToLatLong(new VEPixel(e.mapX,e.mapY));
var		points=new Array();
points.push(self.ptFirst);
points.push(new VELatLong(self.ptSecond.Latitude,self.ptFirst.Longitude));
points.push(self.ptSecond);
points.push(new VELatLong(self.ptFirst.Latitude,self.ptSecond.Longitude));
if(self.polyobj!=null){
self.map.DeleteShape(self.polyobj);
self.polyobj=null;}
self.polyobj=new VEShape(VEShapeType.Polygon,points);
self.polyobj.SetLineWidth(2);
self.polyobj.SetLineColor(new VEColor(120,0,0,1.0));
self.polyobj.SetFillColor(new VEColor(120,0,0,0.5));
self.polyobj.HideIcon();
self.map.AddShape(self.polyobj);}};
var mouseUpHandler=function(e){
self.map.DetachEvent("onmousedown",mouseDownHandler);
self.map.DetachEvent("onmousemove",mouseMoveHandler);
self.map.DetachEvent("onmouseup",mouseUpHandler);
if(self.drawing==true){
var		lat1=parseFloat(self.ptFirst.Latitude.toFixed(6));
var		lng1=parseFloat(self.ptFirst.Longitude.toFixed(6));
var		lat2=parseFloat(self.ptSecond.Latitude.toFixed(6));
var		lng2=parseFloat(self.ptSecond.Longitude.toFixed(6));
if(lng1>lng2){
tmp=lng1;
lng1=lng2;
lng2=tmp;}
if(lat1>lat2){
tmp=lat1;
lat1=lat2;
lat2=tmp;}
saveFence({
lat1:lat1,
lng1:lng1,
lat2:lat2,
lng2:lng2});}
self.map.vemapcontrol.EnableGeoCommunity(false);};
this.click=function(){
self.drawing=false;
if(self.polyobj!=null){
self.map.DeleteShape(self.polyobj);
self.polyobj=null;}
self.ptFirst=null;
self.ptSecond=null;
self.map.vemapcontrol.EnableGeoCommunity(true);
self.map.AttachEvent("onmousedown",mouseDownHandler);
self.map.AttachEvent("onmousemove",mouseMoveHandler);
self.map.AttachEvent("onmouseup",mouseUpHandler);}}
function VEPointTool(map,panel){
this.map=map;
this.panel=panel;
var self=this;
var mouseDownHandler=function(e){
var		pt;
var 	panel=self.panel;
pt=map.PixelToLatLong(new VEPixel(e.mapX,e.mapY));
savePOI({
lat:pt.Latitude,
lng:pt.Longitude});
self.destroy();};
self.destroy=function(){
self.map.vemapcontrol.EnableGeoCommunity(false);
self.map.DetachEvent("onmousedown",mouseDownHandler);}
this.click=function(){
self.map.vemapcontrol.EnableGeoCommunity(true);
self.map.AttachEvent("onmousedown",mouseDownHandler);}}
var 		ggclient=null;
var			ggpanorama=null;
try{
google.load("maps",2);}
catch(e){}
function ggMapPanel(){
var self=this;
self.zoomLevel=2;
self.lat=35.0000;
self.lng=101.8;
self.ggmaps=null;
self.mapobjs=new Array();
self.init=function(contentEl){
self.contentEl=contentEl;
var	newDiv=document.getElementById(contentEl);
if(newDiv==null){
var newDiv=document.createElement("div");
newDiv.id=contentEl;
newDiv.style.position="absolute";
newDiv.style.zIndex="10";
newDiv.style.width="100%";
newDiv.style.height="100%";
document.body.appendChild(newDiv);}
self.ggmaps=new google.maps.Map2(document.getElementById(contentEl));
self.getMap().addControl(new google.maps.LargeMapControl3D());
self.getMap().addControl(new google.maps.MenuMapTypeControl());
self.OverviewMapControl=new google.maps.OverviewMapControl();
self.getMap().addControl(self.OverviewMapControl);
self.getMap().addControl(new google.maps.HierarchicalMapTypeControl());
self.getMap().enableScrollWheelZoom();
self.getMap().enableDoubleClickZoom();
self.getMap().enableDragging();
self.getMap().addMapType(G_PHYSICAL_MAP);
self.getMap().setMapType(G_PHYSICAL_MAP);
self.getMap().setCenter(new google.maps.LatLng(self.lat,self.lng),self.zoomLevel);
self.stOverlay=new google.maps.StreetviewOverlay();
self.getMap().addOverlay(self.stOverlay);
self.GMeasure=new GMeasureTool(self.getMap());
self.GAddPoint=new GAddPointTool(self.getMap(),self);
function DragAreaControl(opts_boxStyle,opts_other,opts_callbacks){
this.globals={
draggingOn:false,
cornerTopDiv:null,
cornerRightDiv:null,
cornerBottomDiv:null,
cornerLeftDiv:null,
mapPosition:null,
outlineDiv:null,
mapWidth:0,
mapHeight:0,
startX:0,
startY:0,
borderCorrection:0};
this.globals.style={
opacity:.2,
fillColor:"#000",
border:"2px solid blue"};
var style=this.globals.style;
for(var s in opts_boxStyle){
style[s]=opts_boxStyle[s];}
var borderStyleArray=style.border.split(' ');
style.outlineWidth=parseInt(borderStyleArray[0].replace(/\D/g,''));
style.outlineColor=borderStyleArray[2];
style.alphaIE='alpha(opacity='+(style.opacity*100)+')';
this.globals.backStack=[];
this.globals.options={
overlayRemoveTime:6000,
stickyZoomEnabled:false,
minDragSize:0};
for(var s in opts_other){
this.globals.options[s]=opts_other[s]}
if(opts_callbacks==null){
opts_callbacks={}}
this.globals.callbacks=opts_callbacks;};
DragAreaControl.prototype=new google.maps.Control();
DragAreaControl.prototype.initialize=function(map){
var G=this.globals;
var me=this;
var mapDiv=map.getContainer();
var buttonContainerDiv=document.createElement("div");
DragAreaUtil.style([buttonContainerDiv],{cursor:'pointer',zIndex:150});
mapDiv.appendChild(buttonContainerDiv);
var zoomDiv=document.createElement("div");
var DIVS_TO_CREATE=[
'outlineDiv',
'cornerTopDiv',
'cornerLeftDiv',
'cornerRightDiv',
'cornerBottomDiv'];
for(var i=0;i<DIVS_TO_CREATE.length;i++){
var id=DIVS_TO_CREATE[i];
var div=document.createElement("div");
DragAreaUtil.style([div],{position:'absolute',display:'none'});
zoomDiv.appendChild(div);
G[id]=div;}
DragAreaUtil.style([zoomDiv],{position:'absolute',display:'none',overflow:'hidden',cursor:'crosshair',zIndex:101});
mapDiv.appendChild(zoomDiv);
google.maps.Event.addDomListener(zoomDiv,'mousedown',function(e){
me.coverMousedown_(e);});
google.maps.Event.addDomListener(document,'mousemove',function(e){
me.drag_(e);});
google.maps.Event.addDomListener(document,'mouseup',function(e){
me.mouseup_(e);});
G.mapPosition=DragAreaUtil.getElementPosition(mapDiv);
G.mapCover=zoomDiv;
G.map=map;
G.borderCorrection=G.style.outlineWidth*2;
this.setDimensions_();
this.initStyles_();
G.mapCover.onselectstart=function(){return false};
return buttonContainerDiv;};
DragAreaControl.prototype.getDefaultPosition=function(){
return new google.maps.ControlPosition(G_ANCHOR_TOP_LEFT,new google.maps.Size(3,120));};
DragAreaControl.prototype.coverMousedown_=function(e){
var G=this.globals;
var pos=this.getRelPos_(e);
G.startX=pos.left;
G.startY=pos.top;
if(e.which){
var rightMouse=(e.which!=1);}else if(e.button){
var rightMouse=(e.button!=1);}
G.draggingRightMouse=rightMouse;
DragAreaUtil.style([G.mapCover],{background:'transparent',opacity:1,filter:'alpha(opacity=100)'});
DragAreaUtil.style([G.outlineDiv],{left:G.startX+'px',top:G.startY+'px',display:'block',width:'1px',height:'1px'});
G.draggingOn=true;
G.cornerTopDiv.style.top=(G.startY-G.mapHeight)+'px';
G.cornerTopDiv.style.display='block';
G.cornerLeftDiv.style.left=(G.startX-G.mapWidth)+'px';
G.cornerLeftDiv.style.top=G.startY+'px';
G.cornerLeftDiv.style.display='block';
G.cornerRightDiv.style.left=G.startX+'px';
G.cornerRightDiv.style.top=G.startY+'px';
G.cornerRightDiv.style.display='block';
G.cornerBottomDiv.style.left=G.startX+'px';
G.cornerBottomDiv.style.top=G.startY+'px';
G.cornerBottomDiv.style.width='0px';
G.cornerBottomDiv.style.display='block';
if(G.callbacks.dragstart!=null){
G.callbacks.dragstart(G.startX,G.startY);}
return false;};
DragAreaControl.prototype.drag_=function(e){
var G=this.globals;
if(G.draggingOn){
var pos=this.getRelPos_(e);
var rect=this.getRectangle_(G.startX,G.startY,pos);
if(rect.left){
addX=-rect.width;}else{
addX=0;}
if(rect.top){
addY=-rect.height;}else{
addY=0;}
DragAreaUtil.style([G.outlineDiv],{left:G.startX+addX+'px',top:G.startY+addY+'px',display:'block',width:'1px',height:'1px'});
G.outlineDiv.style.width=rect.width+"px";
G.outlineDiv.style.height=rect.height+"px";
G.cornerTopDiv.style.height=((G.startY+addY)-(G.startY-G.mapHeight))+'px';
G.cornerLeftDiv.style.top=(G.startY+addY)+'px';
G.cornerLeftDiv.style.width=((G.startX+addX)-(G.startX-G.mapWidth))+'px';
G.cornerRightDiv.style.top=G.cornerLeftDiv.style.top;
G.cornerRightDiv.style.left=(G.startX+addX+rect.width+G.borderCorrection)+'px';
G.cornerBottomDiv.style.top=(G.startY+addY+rect.height+G.borderCorrection)+'px';
G.cornerBottomDiv.style.left=(G.startX-G.mapWidth+((G.startX+addX)-(G.startX-G.mapWidth)))+'px';
G.cornerBottomDiv.style.width=(rect.width+G.borderCorrection)+'px';
if(G.callbacks.dragging!=null){
G.callbacks.dragging(G.startX,G.startY,rect.endX,rect.endY)}
return false;}};
DragAreaControl.prototype.mouseup_=function(e){
var G=this.globals;
if(G.draggingOn){
var pos=this.getRelPos_(e);
G.draggingOn=false;
var rect=this.getRectangle_(G.startX,G.startY,pos);
if(rect.left)rect.endX=rect.startX-rect.width;
if(rect.top)rect.endY=rect.startY-rect.height;
this.resetDragZoom_();
if(rect.width>=G.options.minDragSize&&rect.height>=G.options.minDragSize){
var nwpx=new google.maps.Point(rect.startX,rect.startY);
var nepx=new google.maps.Point(rect.endX,rect.startY);
var sepx=new google.maps.Point(rect.endX,rect.endY);
var swpx=new google.maps.Point(rect.startX,rect.endY);
var nw=G.map.fromContainerPixelToLatLng(nwpx);
var ne=G.map.fromContainerPixelToLatLng(nepx);
var se=G.map.fromContainerPixelToLatLng(sepx);
var sw=G.map.fromContainerPixelToLatLng(swpx);
var zoomAreaPoly=new google.maps.Polygon([
nw,
sw,
se,
ne],
self.lineColor,
0.8,
0,
self.lineColor,
0.4);
try{
G.map.addOverlay(zoomAreaPoly);
setTimeout(function(){G.map.removeOverlay(zoomAreaPoly)},G.options.overlayRemoveTime);}catch(e){}
if(G.callbacks.dragend!=null){
G.callbacks.dragend(nw,ne,se,sw,nwpx,nepx,sepx,swpx);}}
if(G.options.stickyZoomEnabled){
this.initCover_();}}};
DragAreaControl.prototype.setDimensions_=function(){
var G=this.globals;
var mapSize=G.map.getSize();
G.mapWidth=mapSize.width;
G.mapHeight=mapSize.height;
DragAreaUtil.style([G.mapCover,G.cornerTopDiv,G.cornerRightDiv,G.cornerBottomDiv,G.cornerLeftDiv],{top:'0px',left:'0px',width:G.mapWidth+'px',height:G.mapHeight+'px'});};
DragAreaControl.prototype.initStyles_=function(){
var G=this.globals;
DragAreaUtil.style([G.mapCover,G.cornerTopDiv,G.cornerRightDiv,G.cornerBottomDiv,G.cornerLeftDiv],{filter:G.style.alphaIE,opacity:G.style.opacity,background:G.style.fillColor});
G.outlineDiv.style.border=G.style.border;};
DragAreaControl.prototype.buttonclick_=function(){
var G=this.globals;
if(G.mapCover.style.display=='block'){
this.resetDragZoom_();}else{
this.initCover_();}};
DragAreaControl.prototype.initCover_=function(){
var G=this.globals;
G.mapPosition=DragAreaUtil.getElementPosition(G.map.getContainer());
this.setDimensions_();
DragAreaUtil.style([G.mapCover],{display:'block',background:G.style.fillColor});
DragAreaUtil.style([G.outlineDiv],{width:'0px',height:'0px'});
if(G.callbacks['buttonclick']!=null){
G.callbacks.buttonclick();}};
DragAreaControl.prototype.resetDragZoom_=function(){
var G=this.globals;
DragAreaUtil.style([G.mapCover,G.cornerTopDiv,G.cornerRightDiv,G.cornerBottomDiv,G.cornerLeftDiv],{display:'none',opacity:G.style.opacity,filter:G.style.alphaIE});
G.outlineDiv.style.display='none';};
DragAreaControl.prototype.getRelPos_=function(e){
var pos=DragAreaUtil.getMousePosition(e);
var G=this.globals;
return{top:(pos.top-G.mapPosition.top),
left:(pos.left-G.mapPosition.left)};};
DragAreaControl.prototype.getRectangle_=function(startX,startY,pos){
var left=false;
var top=false;
var dX=pos.left-startX;
var dY=pos.top-startY;
if(dX<0){
dX=dX*-1;
left=true;}
if(dY<0){
dY=dY*-1;
top=true;}
return{
startX:startX,
startY:startY,
endX:startX+dX,
endY:startY+dY,
width:dX,
height:dY,
left:left,
top:top}};
self.DragAreaTool=new DragAreaControl({
opacity:.2,
border:"2px solid red"},{
overlayRemoveTime:10000},{
buttonclick:function(){},
dragstart:function(){},
dragging:function(x1,y1,x2,y2){},
dragend:function(nw,ne,se,sw,nwpx,nepx,sepx,swpx){
var		lat1=parseFloat(nw.lat().toFixed(6));
var		lng1=parseFloat(nw.lng().toFixed(6));
var		lat2=parseFloat(se.lat().toFixed(6));
var		lng2=parseFloat(se.lng().toFixed(6));
if(lng1>lng2){
tmp=lng1;
lng1=lng2;
lng2=tmp;}
if(lat1>lat2){
tmp=lat1;
lat1=lat2;
lat2=tmp;}
saveFence({
lng1:lng1.toFixed(6),
lat1:lat1.toFixed(6),
lng2:lng2.toFixed(6),
lat2:lat2.toFixed(6)});}});
self.getMap().addControl(self.DragAreaTool);
self.geocoder=new google.maps.ClientGeocoder();
ggclient=new google.maps.StreetviewClient();};
self.zoomIn=function(){
self.getMap().zoomIn();
self.savesession();};
self.zoomOut=function(){
self.getMap().zoomOut();
self.savesession();};
self.zoomAll=function(){
self.getMap().setCenter(new google.maps.LatLng(self.lat,self.lng),self.zoomLevel);
self.savesession();};
self.savesession=function(){
var centerlatlng=this.getCenterLatLng();};
self.addMarker=function(obj){
var mapobj=this.getmapobj(obj.uiid);
self.removemaker(mapobj);
var	markobj=new GUMark(obj);
self.getMap().addOverlay(markobj);
mapobj.obj[0]=markobj;
self.addmapobj(mapobj);
if(obj.showInfo&&obj.showInfo==true){
self.getMap().openInfoWindow(new google.maps.LatLng(obj.lat,obj.lng),obj.description);}};
self.getMap=function(){
return self.ggmaps;};
self.onResize=function(w,h){
self.getMap().checkResize();
self.getMap().removeControl(self.OverviewMapControl);
self.getMap().addControl(self.OverviewMapControl);};
self.setSize=function(width,height,animate){
self.getMap().checkResize();};
self.center=function(lng,lat){
self.getMap().setCenter(new google.maps.LatLng(lat,lng));
self.savesession();};
self.centerAndZoom=function(lng,lat,zoom){
lng=parseFloat(lng);
lat=parseFloat(lat);
zoom=parseInt(zoom);
self.getMap().setCenter(new google.maps.LatLng(lat,lng),zoom);},
self.getCenter=function(){
return self.getMap().getCenter();};
self.getCenterLatLng=function(){
var ll=self.getMap().getCenter();
var	zoom=self.getMap().getZoom();
return{lat:ll.lat(),lng:ll.lng(),zoom:zoom};};
self.deleteAll=function(){
self.getMap().clearOverlays();};
self.bestMaps=function(arrPoints){
var points=new Array();
var	x0=0,y0=0;
var x1=0,y1=0;
if(arrPoints.length<2){
return;}
x0=arrPoints[0].lng;
y0=arrPoints[0].lat;
x1=x0;
y1=y0;
for(var i=1;i<arrPoints.length;i++){
if(arrPoints[i].lng<x0){
x0=arrPoints[i].lng;}
else if(arrPoints[i].lng>x1){
x1=arrPoints[i].lng;}
if(arrPoints[i].lat<y0){
y0=arrPoints[i].lat;}
else if(arrPoints[i].lat>y1){
y1=arrPoints[i].lat;}}
var	bounds=new google.maps.LatLngBounds(
new google.maps.LatLng(y0,x0),
new google.maps.LatLng(y1,x1));
var zoom=self.getMap().getBoundsZoomLevel(bounds);
var center=bounds.getCenter();
self.getMap().setCenter(center,zoom);};
self.searchAddress=function(address,zoom){
if(self.searchMarker){
self.getMap().removeOverlay(self.searchMarker);}
if(!zoom){
zoom=self.getZoom();}
var map=self.getMap();
self.geocoder.getLatLng(
address,
function(point){
if(!point){
return;}
else{
map.setCenter(point,zoom);}});};
self.getAddress=function(obj,successfunc){
var point=new google.maps.LatLng(parseFloat(obj.lat),parseFloat(obj.lng));
self.geocoder.getLocations(point,function(addresses){
if(addresses.Status.code!=200){
successfunc("No Address...");}
else{
successfunc(addresses.Placemark[0].address);}});};
self.mapobj=function(uiid){
this.uiid=uiid;
this.obj=new Array();};
self.getmapobj=function(uiid){
var obj=null;
for(var i=0;i<self.mapobjs.length;i++){
if(self.mapobjs[i].uiid==uiid){
obj=self.mapobjs[i];
self.mapobjs.splice(i,1);
break;}}
if(obj==null){
obj=new self.mapobj(uiid);}
return obj;};
self.addmapobj=function(mapobj){
self.mapobjs[self.mapobjs.length]=mapobj;};
self.removemaker=function(mapobj){
var			obj;
while(1){
obj=mapobj.obj.pop();
if(obj==undefined){
break;}
else{
self.getMap().removeOverlay(obj);}}};
self.deleteMarker=function(name){
self.removemaker(self.getmapobj(name));};
self.addLine=function(obj){
if(obj.points.length<2){
return;}
var mapobj=self.getmapobj(obj.uiid);
self.removemaker(mapobj);
var			points=new Array();
for(var i=0;i<obj.points.length;i++){
points.push(new google.maps.LatLng(obj.points[i].lat,obj.points[i].lng));}
if(obj.color==null){
obj.color="red";}
if(obj.linewidth==null){
obj.linewidth=1;}
if(obj.opacity==null){
obj.opacity=0.8;}
obj.linewidth*=4;
var lineobj=new google.maps.Polyline(points,obj.color,obj.linewidth,obj.opacity,{geodesic:true});
self.getMap().addOverlay(lineobj);
mapobj.obj.push(lineobj);
self.addmapobj(mapobj);};
self.addTriAngle=function(obj){
var		x=parseFloat(obj.lng);
var		y=parseFloat(obj.lat);
var		nLen;
var		lat1;
var		lat2;
var 	nSize=self.getMap().getSize().width;
var 	bounds=self.getMap().getBounds();
lat1=bounds.getSouthWest().lat();
lat2=bounds.getNorthEast().lat();
lat2-=lat1;
nLen=60*lat2/nSize;
direction=270-obj.direction;
var	points=new Array();
points.push(new mapPoint(x,y));
points.push(new mapPoint(GetX1Point(x,direction,nLen),GetY1Point(y,direction,nLen)));
points.push(new mapPoint(GetX2Point(x,direction,nLen),GetY2Point(y,direction,nLen)));
points.push(new mapPoint(GetX3Point(x,direction,nLen),GetY3Point(y,direction,nLen)));
self.addPolygon({
uiid:obj.uiid,
name:obj.name,
points:points,
color:obj.color,
icon:obj.icon});
return true;};
self.addPolygon=function(obj){
if(obj.points.length<3){
return;}
var mapobj=self.getmapobj(obj.uiid);
self.removemaker(mapobj);
var			points=new Array();
for(var i=0;i<obj.points.length;i++){
points.push(new google.maps.LatLng(obj.points[i].lat,obj.points[i].lng));}
var polyobj=new google.maps.Polygon(points,obj.color,0.8,0,obj.color,0.4);
self.getMap().addOverlay(polyobj);
mapobj.obj.push(polyobj);
var	markobj=new GUMark(obj);
this.getMap().addOverlay(markobj);
mapobj.obj.push(markobj);
if(obj.showInfo&&obj.showInfo==true){
self.getMap().openInfoWindow(new google.maps.LatLng(obj.lat,obj.lng),obj.description);}
self.addmapobj(mapobj);
return;};
self.measure=function(){
self.GMeasure.click();};
self.addFence=function(){
self.DragAreaTool.buttonclick_();};
self.addPoint=function(){
self.GAddPoint.click();};
self.print=function(){
self.getMap().removeControl(self.OverviewMapControl);
var obj=document.getElementById(self.contentEl);
var content=obj.innerHTML;
var html="<html>"+"<head><title>Print Maps</title></head>"+"<body  style='margin:0;overflow:hidden;'>"+content+"</body>"+"</html>";
var win=window.open("","win","","width=100%,height=100%");
win.document.writeln(html);
win.document.close();};
self.IsContainPoint=function(obj){
var bounds=self.getMap().getBounds();
return bounds.containsLatLng(new google.maps.LatLng(obj.lat,obj.lng));};}
function GMeasureTool(map){
this.objArray=new Array();
this.status=0;
this.lastpoint=0;
this.distancelen=0;
this.map=map;
this.lineColor="#0000ff";
this.lineWidth=3;
this.lineAlpha=0.5;
var self=this;
this.init=function(){
if(self.map==null){
return;}
self.event=google.maps.Event.addListener(
self.map,
"click",
function(marker,latlng){
var		curpoint;
if(latlng){
curpoint=latlng}
else if(marker){
try{
curpoint=marker.getLatLng();}
catch(e){return;}}
if(self.objArray.length==0){
self.lastpoint=curpoint;}
var		line=new google.maps.Polyline([self.lastpoint,curpoint],
self.lineColor,
self.lineWidth,
self.lineAlpha);
self.lastpoint=curpoint;
self.map.addOverlay(line);
self.objArray.push(line);
self.distancelen+=line.getLength();
self.draw();});}
this.draw=function(){
var msg=Math.round(self.distancelen)*0.001;
msg+="km";
self.map.openInfoWindow(new google.maps.LatLng(self.lastpoint.lat(),self.lastpoint.lng()),msg);}
this.click=function(){
if(this.status==0){
this.init();
this.status=1;}
else{
this.destroy();
this.status=0;}}
this.destroy=function(){
var len=self.objArray.length;
for(var i=0;i<len;i++){
self.map.removeOverlay(self.objArray.pop());}
google.maps.Event.removeListener(self.event);
self.event=null;
self.distancelen=0;
self.status=0;
self.map.closeInfoWindow();}}
function	GAddPointTool(map,panel){
this.map=map;
this.panel=panel;
var self=this;
self.click=function(){
if(self.map==null){
return;}
self.event=google.maps.Event.addListener(
self.map,
"click",
function(marker,latlng){
var		curpoint;
if(latlng){
curpoint=latlng}
else if(marker){
try{
curpoint=marker.getLatLng();}
catch(e){return;}}
savePOI({
lat:curpoint.lat().toFixed(6),
lng:curpoint.lng().toFixed(6)});
self.destroy();});}
self.destroy=function(){
google.maps.Event.removeListener(self.event);
self.event=null;}}
function GUMark(obj){
if(!obj||typeof(obj)!='object'){
return;}
this.isLoad=true;
if(typeof(google.maps.Map2)=='undefined'){
this.isLoad=false;
return;}
this.superclass=new google.maps.Overlay();
this.initialize=function(map){
var div;
if(obj.rotate==null){
obj.rotate=0;}
div=document.createElement("div");
div.style.position="absolute";
if(obj.icon!=null){
var text="<span>"+getRotateImgHtml({URL:obj.icon,angle:0})+"</span>";}
else{
var text="";}
text+="<div style='border:1px solid #aaaaaa;background-color:#ffffd7;color:"+obj.color+";font:normal 10px verdana;white-space:nowrap;'>"+obj.name+"</div>";
div.innerHTML=text;
div.id=getRandomID;
map.getPane(G_MAP_MARKER_MOUSE_TARGET_PANE).appendChild(div);
this.map_=map;
this.div_=div;}
this.remove=function(){
if(!this.isLoad){return;}
this.div_.parentNode.removeChild(this.div_);}
this.copy=function(){
if(!this.isLoad){return;}
return new GUMark(obj);}
this.redraw=function(force){
if(!this.isLoad){return;}
if(!force){return;}
var c=this.map_.fromLatLngToDivPixel(new google.maps.LatLng(obj.lat,obj.lng,true));
this.div_.style.left=(c.x-30)+"px";
this.div_.style.top=(c.y-30)+"px";}}
var DragAreaUtil=new Object();
DragAreaUtil.gE=function(sId){
return document.getElementById(sId);};
DragAreaUtil.getMousePosition=function(e){
var posX=0;
var posY=0;
if(!e)var e=window.event;
if(e.pageX||e.pageY){
posX=e.pageX;
posY=e.pageY;}else if(e.clientX||e.clientY){
posX=e.clientX+(document.documentElement.scrollLeft?document.documentElement.scrollLeft:document.body.scrollLeft);
posY=e.clientY+(document.documentElement.scrollTop?document.documentElement.scrollTop:document.body.scrollTop);}
return{left:posX,top:posY};};
DragAreaUtil.getElementPosition=function(element){
var leftPos=element.offsetLeft;
var topPos=element.offsetTop;
var parElement=element.offsetParent;
while(parElement!=null){
leftPos+=parElement.offsetLeft;
topPos+=parElement.offsetTop;
parElement=parElement.offsetParent;}
return{left:leftPos,top:topPos};};
DragAreaUtil.style=function(elements,styles){
if(typeof(elements)=='string'){
elements=DragAreaUtil.getManyElements(elements);}
for(var i=0;i<elements.length;i++){
for(var s in styles){
elements[i].style[s]=styles[s];}}};
DragAreaUtil.getManyElements=function(idsString){
var idsArray=idsString.split(',');
var elements=[];
for(var i=0;i<idsArray.length;i++){
elements[elements.length]=DragAreaUtil.gE(idsArray[i])};
return elements;};
var 	g_Map=null;
var		g_oAddress=new Array();
var		historyobj=new Array();
var		historyobj1=new Array();
var		config=new Object();
var		getRandomID=(function(){var a=0;function b(){return'_ID_MT_'+(a++);}return b;})();
function mapPoint(lng,lat){
this.lng=lng;
this.lat=lat;};
function getRotateImgHtml(cfg){
if(!cfg.angle){
cfg.angle=0;}
var strHtml;
var angle=cfg.angle;
if(!angle||typeof(angle)!='number'){
angle=0;}
if(angle>=0){
var rotation=Math.PI*angle/180;}else{
var rotation=Math.PI*(360+angle)/180;}
var costheta=Math.cos(rotation);
var sintheta=Math.sin(rotation);
strHtml='<div>'+'<img style="filter:progid:'+'DXImageTransform.Microsoft.Matrix('+'M11='+costheta+','+'M12='+(-sintheta)+','+'M21='+sintheta+','+'M22='+costheta+','+'SizingMethod=\'auto expand\');" '+'src="'+cfg.URL+'" '+'/>'+'</div>';
return strHtml;}
function getObjectFromStr(str){
var		i=0;
var		j=0;
var		vstr;
var		vname;
var		vvalue;
var		obj=new Object();
i=str.indexOf(',');
while(i!=-1){
vstr=str.substr(0,i);
str=str.substr(i+1);
j=vstr.indexOf(':');
if(j!=-1){
vname=vstr.substr(0,j);
vvalue=vstr.substr(j+1);
obj[vname]=vvalue;}
i=str.indexOf(',');}
vstr=str;
j=vstr.indexOf(':');
if(j!=-1){
vname=vstr.substr(0,j);
vvalue=vstr.substr(j+1);
obj[vname]=vvalue;}
return obj;}
function mapConfig(lng,lat,zoom){
config.lng=lng;
config.lat=lat;
config.zoom=zoom;}
function getBodyWidth(){
var w=0;
w=document.documentElement.clientWidth;
if(w==0){
w=document.body.clientWidth;}
return w;}
function getBodyHeight(){
var h=0;
h=document.documentElement.clientHeight;
if(h==0){
h=document.body.clientHeight;}
return h;}
function mapOnSize(){
document.getElementById("div_map").style.width=getBodyWidth();
document.getElementById("div_map").style.height=getBodyHeight();
document.getElementById("div_map").style.left=0;
document.getElementById("div_map").style.right=0;
document.getElementById("div_map").style.top=0;
document.getElementById("div_map").style.bottom=0;}
function mapGetIconUrl(obj){
var			iconurl;
iconurl="car/Car10";
if(obj.direction>=360){
direction=0;}
if(obj.alState>0){
iconurl+="1";}
else if(obj.speed>10){
iconurl+="2";}
else{
iconurl+="3";}
var		 i=Math.floor((obj.direction/45)+1);
iconurl+=i;
iconurl+=".gif";
return iconurl;}
function mapGetColor(obj){
var		color="";
if(obj.alState>0){
color="#ff0000";}
else if(obj.speed>10){
color="#0000ff";}
else{
color="#000000";}
return color;}
function mapGetPOIIconUrl(type){
var	POIIcon=[{type:0,icon:'image/home.png'},{type:1,icon:'image/office.png'},{type:2,icon:'image/Restaurant.png'},{type:3,icon:'image/Entertainment.png'},{type:4,icon:'image/pushpin.png'},{type:5,icon:'image/Services.png'},{type:255,icon:'image/pushpin.png'}]
for(var i=0;i<POIIcon.length;i++){
if(POIIcon[i].type==type){
return POIIcon[i].icon;}}
return POIIcon[i-1].icon;}
function mapZoomIn(){
g_Map.zoomIn();}
function mapZoomOut(){
g_Map.zoomOut();}
function mapZoomAll(){
g_Map.zoomAll();}
function mapMeasure(){
g_Map.measure();}
function mapSetCenterZoom(lng,lat,zoom){
if(g_Map!=null){
g_Map.centerAndZoom(lng,lat,zoom);}}
function mapGetCenterZoom(){
if(g_Map!=null){
var centerlatlng=g_Map.getCenterLatLng();
return centerlatlng.lng+','+centerlatlng.lat+','+centerlatlng.zoom;}
return "";}
function mapAddGPSObj(obj2){
var obj=getObjectFromStr(obj2);
obj.lat=parseFloat(obj.lat);
obj.lng=parseFloat(obj.lng);
obj.color=mapGetColor(obj);
obj.icon=mapGetIconUrl(obj);
if(obj.showInfo&&obj.showInfo=='true'){
obj.showInfo=true;}
if(g_Map!=null){
g_Map.addMarker(obj);}}
function mapAddPOIObj(obj2){
var obj=getObjectFromStr(obj2);
obj.lat=parseFloat(obj.lat);
obj.lng=parseFloat(obj.lng);
obj.uiid=obj.name;
if(obj.autoHide&&obj.autoHide=='true'){
obj.uiid+='_temp';}
if(obj.showInfo&&obj.showInfo=='true'){
obj.showInfo=true;}
obj.icon=mapGetPOIIconUrl(obj.type);
obj.description=obj.remark;
if(g_Map!=null){
g_Map.addMarker(obj);}
if(obj.autoHide&&obj.autoHide=='true'){
mapCenter(obj.lng,obj.lat);
setTimeout(function(){mapDeleteMarker(obj.uiid)},5000);}}
function mapAddFenceObj(obj2){
var obj=getObjectFromStr(obj2);
obj.lat1=parseFloat(obj.lat1);
obj.lng1=parseFloat(obj.lng1);
obj.lat2=parseFloat(obj.lat2);
obj.lng2=parseFloat(obj.lng2);
var		points=new Array();
points.push({lng:obj.lng1,lat:obj.lat1});
points.push({lng:obj.lng1,lat:obj.lat2});
points.push({lng:obj.lng2,lat:obj.lat2});
points.push({lng:obj.lng2,lat:obj.lat1});
obj.uiid=obj.name;
if(obj.autoHide&&obj.autoHide=='true'){
obj.uiid+='_temp';}
if(obj.showInfo&&obj.showInfo=='true'){
obj.showInfo=true;}
obj.lat=obj.lat1+(obj.lat2-obj.lat1)/2;
obj.lng=obj.lng1+(obj.lng2-obj.lng1)/2;
obj.color="#0000ff";
obj.points=points;
obj.description=obj.remark;
if(g_Map!=null){
g_Map.addPolygon(obj);}
if(obj.autoHide&&obj.autoHide=='true'){
mapCenter(obj.lng,obj.lat);
setTimeout(function(){mapDeleteMarker(obj.uiid)},5000);}}
function mapAddMarker(obj2){
var obj=getObjectFromStr(obj2);
if(g_Map!=null){
g_Map.addMarker(obj);}}
function mapAddLine(obj2){
var obj=getObjectFromStr(obj2);
if(g_Map!=null){
g_Map.addLine(obj);}}
function mapAddPolygon(obj2){
var obj=getObjectFromStr(obj2);
if(g_Map!=null){
g_Map.addPolygon(obj);}}
function mapSearchAddress(obj2){
var obj=getObjectFromStr(obj2);
if((g_Map!=null)&&(g_Map.getAddress!=null)){
g_Map.getAddress(obj,function(address){
g_oAddress[obj.deuid]=address;});}}
function mapGetAddress(deuid){
return g_oAddress[deuid];}
function mapDeleteMarker(deuid){
if(g_Map!=null){
g_Map.deleteMarker(deuid);}}
function mapCenter(lng,lat){
if(g_Map!=null){
g_Map.center(lng,lat);}}
function history_play(obj2){
var obj=getObjectFromStr(obj2);
if(g_Map!=null){
g_Map.addMarker(obj);
if(g_Map.IsContainPoint(obj)==false){
g_Map.center(obj.lng,obj.lat);}
var		points=new Array();
var		len=historyobj.length;
if(len>0){
points.push(historyobj[len-1]);
points.push(obj);
g_Map.addLine({uiid:'line'+len,points:points});
historyobj1.push('line'+len);}
historyobj.push(obj);}}
function history_stop(){
var		lineobj;
if(g_Map!=null){
if(historyobj.length>0){
g_Map.deleteMarker(historyobj[0].uiid);}
while(1){
lineobj=historyobj1.pop();
if(lineobj==undefined){
break;}
else{
g_Map.deleteMarker(lineobj);}}}
historyobj.slice(0);}
var		g_oPOI={empty:true};
var		g_oFence={empty:true};
function addPOI(){
g_oPOI.empty=true;
if(g_Map!=null){
g_Map.addPoint();}}
function getPOI(){
if(g_oPOI.empty==true){
return "";}
else{
g_oPOI.empty=true;
return g_oPOI.lng+','+g_oPOI.lat;}}
function savePOI(obj){
g_oPOI.empty=false;
g_oPOI.lat=obj.lat;
g_oPOI.lng=obj.lng;}
function addFence(){
g_oFence.empty=true;
if(g_Map!=null){
g_Map.addFence();}}
function getFence(){
if(g_oFence.empty==true){
return "";}
else{
g_oFence.empty=true;
return g_oFence.lng1+','+g_oFence.lat1+','+g_oFence.lng2+','+g_oFence.lat2;}}
function saveFence(obj){
g_oFence.empty=false;
g_oFence.lat1=obj.lat1;
g_oFence.lng1=obj.lng1;
g_oFence.lat2=obj.lat2;
g_oFence.lng2=obj.lng2;}

