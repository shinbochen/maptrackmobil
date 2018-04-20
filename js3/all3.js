
ltMapPanel=function(config){
var self=this;
var defConfig={
zoomLevel:12,
city:'xian',
ltmaps:null,
border:0,
disableAddFunc:false,
mapobjs:new Array()};
Ext.apply(this,defConfig);
Ext.apply(this,config);
var	newDiv=document.getElementById(self.contentEl);
if(newDiv==null){
var newDiv=document.createElement("div");
newDiv.id=self.contentEl;
newDiv.style.position="absolute";
newDiv.style.zIndex=10;
newDiv.style.width="100%";
newDiv.style.height="100%";
document.body.appendChild(newDiv);}
this.zoomIn=function(){
self.getMap().zoomIn();};
this.zoomOut=function(){
self.getMap().zoomOut();};
this.zoomAll=function(){
self.getMap().centerAndZoom("xian",12);};
this.textSearch=new Ext.form.TextField({
width:100,
emptyText:MapTrack.lang.s_PleaseTypeAddress,
listeners:{
'specialkey':function(txt,ev){
if(ev.getKey()==ev.ENTER){
var address=txt.getValue();
if(!address){
return;}
self.searchAddress(address);}}}});
this.btnSearch={
text:MapTrack.lang.s_Search,
iconCls:'Search',
handler:function(){
var address=self.textSearch.getValue();
if(address.length<1){
return;}
self.searchAddress(address);}};
self.showAllFence=function(flag){
if(typeof(gShowAllFence)=="function"){
gShowAllFence(self,flag);}};
self.showAllPOI=function(flag){
if(typeof(gShowAllPOI)=="function"){
gShowAllPOI(self,flag);}};
self.showAllPFence=function(flag){
if(typeof(gShowAllPFence)=="function"){
gShowAllPFence(self,flag);}};
self.txt_status=new Ext.Button({
tooltip:' ',
text:' ',
anchor:'90%'});
self.txt_status2=new Ext.Button({
tooltip:' ',
text:' ',
anchor:'90%'});
self.txt_status3=new Ext.Button({
tooltip:' ',
text:' ',
anchor:'90%'});
var		menuitems=[{
text:MapTrack.lang.s_Zoomin,
iconCls:'zoomin',
handler:function(){self.zoomIn();}},{
text:MapTrack.lang.s_Zoomout,
iconCls:'zoomout',
handler:function(){self.zoomOut();}},{
text:MapTrack.lang.s_Zoomall,
iconCls:'zoomall',
handler:function(){self.zoomAll();}},{
text:MapTrack.lang.s_Measure,
iconCls:'measure',
handler:function(){self.measure();}}];
if(self.disableAddFunc==false){
menuitems.push('-');
menuitems.push({
text:MapTrack.lang.s_Polygon,
iconCls:'PolygonTool',
menu:new Ext.menu.Menu({
items:[{
text:MapTrack.lang.s_Add,
iconCls:'Add',
handler:function(){self.addPFence();}},{
text:MapTrack.lang.s_ShowAll,
iconCls:'showAll',
handler:function(item){self.showAllPFence(true);}},{
text:MapTrack.lang.s_HideAll,
iconCls:'hideAll',
handler:function(item){self.showAllPFence(false);}}]})});
menuitems.push({
text:MapTrack.lang.s_Fence,
iconCls:'FenceTool',
menu:new Ext.menu.Menu({
items:[{
text:MapTrack.lang.s_Add,
iconCls:'Add',
handler:function(){self.addFence();}},{
text:MapTrack.lang.s_ShowAll,
iconCls:'showAll',
handler:function(item){self.showAllFence(true);}},{
text:MapTrack.lang.s_HideAll,
iconCls:'hideAll',
handler:function(item){self.showAllFence(false);}}]})});
menuitems.push({
text:MapTrack.lang.s_POI,
iconCls:'pointTool',
menu:new Ext.menu.Menu({
items:[{
text:MapTrack.lang.s_Add,
iconCls:'Add',
handler:function(){self.addPoint();}},{
text:MapTrack.lang.s_ShowAll,
iconCls:'showAll',
handler:function(item){self.showAllPOI(true);}},{
text:MapTrack.lang.s_HideAll,
iconCls:'hideAll',
handler:function(item){self.showAllPOI(false);}}]})});}
menuitems.push('-');
menuitems.push({
text:MapTrack.lang.s_Print,
iconCls:'print',
handler:function(){self.print();}});
self.splitbutton=({
xtype:'tbsplit',
text:MapTrack.lang.s_MapTool,
iconCls:'MapTool',
menu:new Ext.menu.Menu({
items:menuitems})});
self.onMapMove=function(p){
var point=self.getMap().getClickLatLng(p);
if(self.txt_status){
self.txt_status.setText(
MapTrack.lang.s_MousePos+':'+
self.getlatFromltmap(point.getLatitude()).toFixed(6)+','+
self.getlngFromltmap(point.getLongitude()).toFixed(6)+'['+self.getMap().getCurrentZoom()+']');}};
self.onCenterChange=function(e){
var center=self.getCenterLatLng();
self.txt_status3.setText("... ...");
self.txt_status2.setText(MapTrack.lang.s_MapCenter+':'+center.lat.toFixed(6)+","+center.lng.toFixed(6));
setTimeout(
function(){
if(mapGetAddress==null){
return;}
mapGetAddress({lat:center.lat,lng:center.lng},
function(address){if(address.length>0){self.txt_status3.setText(address);}},
null)},
500);};
ltMapPanel.superclass.constructor.call(this,{
bbar:[
this.txt_status,{width:10},
this.txt_status2,
this.txt_status3,
'->',
this.splitbutton,'-',
this.textSearch,this.btnSearch]});}
Ext.extend(ltMapPanel,Ext.Panel,{
showLoadTip:function(){
var		self=this;
setTimeout(
function(){
self.oLoadTip=new Ext.LoadMask(Ext.getBody(),{removeMask:true});
self.oLoadTip.show();},500);},
hiddenLoadTip:function(){
var self=this;
setTimeout(
function(){
try{
self.oLoadTip.hide();
self.oLoadTip=null;}catch(e){}},500);},
initMap:function(){
var		self=this;
var wh=this.ownerCt.getSize();
Ext.applyIf(this,wh);
this.ltmaps=new LTMaps(this.contentEl);
if(this.lat!=null){
this.getMap().centerAndZoom(new LTPoint(this.getltmaplng(this.lng),this.getltmaplat(this.lat)),this.zoomLevel);}
else{
this.getMap().cityNameAndZoom(this.city,this.zoomLevel);}
var LTScaleCtrl=new LTScaleControl();
LTScaleCtrl.setRight(10);
LTScaleCtrl.setTop(10);
this.getMap().addControl(LTScaleCtrl);
this.getMap().handleKeyboard();
this.getMap().handleMouseScroll();
this.getMap().addControl(new LTStandMapControl());
this.getMap().addControl(new LTOverviewMapControl());
this.oMeasureTool=new LTPolyLineControl();
this.oMeasureTool.setVisible(false);
this.getMap().addControl(this.oMeasureTool);
this.getMap().resizeMapDiv();
this.load=true;
this.ltAreaTool=new LTAreaTool(this.getMap(),this);
this.ltPAreaTool=new LTPAreaTool(this.getMap(),this);
this.ltPointTool=new LTPointTool(this.getMap(),this);
LTEvent.addListener(self.getMap(),"move",self.onMapMove);
LTEvent.addListener(self.getMap(),"mouseup",self.onCenterChange);
this.hiddenLoadTip();},
afterRender:function(){
ltMapPanel.superclass.afterRender.call(this);
var		self=this;
this.showLoadTip();
setTimeout(function(){self.initMap()},1000);},
initComponent:function(){
ltMapPanel.superclass.initComponent.call(this);},
getltmaplng:function(lng){
return lng*100000+460;},
getltmaplat:function(lat){
return lat*100000-270;},
getlngFromltmap:function(ltlng){
return(ltlng-460)/100000;},
getlatFromltmap:function(ltlat){
return(ltlat+270)/100000;},
getMap:function(){
return this.ltmaps;},
onResize:function(w,h){
if(this.load==true){
this.getMap().resizeMapDiv();}
ltMapPanel.superclass.onResize.call(this,w,h);},
setSize:function(width,height,animate){
if(this.load==true){
this.ltmaps.resizeMapDiv();}
ltMapPanel.superclass.setSize.call(this,width,height,animate);},
center:function(lng,lat){
this.getMap().moveToCenter(new LTPoint(this.getltmaplng(lng),this.getltmaplat(lat)));},
centerAndZoom:function(lng,lat,zoom){
this.getMap().centerAndZoom(new LTPoint(this.getltmaplng(lng),this.getltmaplat(lat)),zoom);},
getCenter:function(){
return this.getMap().getCenterPoint();},
getCenterLatLng:function(){
var ll=this.getMap().getCenterPoint();
return{
lat:this.getlatFromltmap(ll.getLatitude()),
lng:this.getlngFromltmap(ll.getLongitude()),
zoom:this.getMap().getCurrentZoom()};},
deleteAll:function(){
this.getMap().clearOverLays();},
bestMaps:function(arrPoints){
var points=new Array();
for(var i=0;i<arrPoints.length;i++){
points.push(new LTPoint(this.getltmaplng(arrPoints[i].lng),this.getltmaplat(arrPoints[i].lat)));}
this.getMap().getBestMap(points);},
getAddress:function(obj,successfunc){},
mapobj:function(uiid){
this.uiid=uiid;
this.obj=new Array();},
getmapobj:function(uiid){
var obj=null;
for(var i=0;i<this.mapobjs.length;i++){
if(this.mapobjs[i].uiid==uiid){
obj=this.mapobjs[i];
this.mapobjs.splice(i,1);
break;}}
if(obj==null){
obj=new this.mapobj(uiid);}
return obj;},
searchAddress:function(address){
try{
this.getMap().cityNameAndZoom(address,5);}
catch(e){}},
addmapobj:function(mapobj){
this.mapobjs[this.mapobjs.length]=mapobj;},
removemaker:function(mapobj){
var			obj;
while(1){
obj=mapobj.obj.pop();
if(obj==undefined){
break;}
else{
this.getMap().removeOverLay(obj);}}},
deleteMarker:function(uiid){
this.removemaker(this.getmapobj(uiid));},
addMarker:function(obj){
var mapobj=this.getmapobj(obj.uiid);
this.removemaker(mapobj);
var	icon=new LTIcon();
if(obj.icon!=null){
icon.setImageUrl(obj.icon);}
var point=new LTPoint(this.getltmaplng(obj.lng),this.getltmaplat(obj.lat));
var markobj=new LTMarker(point,icon);
var textobj=new LTMapText(markobj);
textobj.setLabel(obj.name);
this.getMap().addOverLay(markobj);
mapobj.obj[0]=markobj;
this.getMap().addOverLay(textobj);
mapobj.obj[1]=textobj;
LTEvent.addListener(markobj,"mouseover",function(){var win=markobj.openInfoWinHtml(obj.description);win.closeInfoWindowWithMouse();});
if(obj.showInfo&&obj.showInfo==true){
markobj.openInfoWinHtml(obj.description);}
this.addmapobj(mapobj);},
addLine:function(obj){
if(obj.points.length<2){
return;}
var mapobj=this.getmapobj(obj.uiid);
this.removemaker(mapobj);
var points=new Array();
for(var i=0;i<obj.points.length;i++){
points.push(new LTPoint(this.getltmaplng(obj.points[i].lng),this.getltmaplat(obj.points[i].lat)));}
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
this.getMap().addOverLay(polyLine);
mapobj.obj[0]=polyLine;
this.addmapobj(mapobj);},
addTriAngle:function(obj){
var		x=parseFloat(obj.lng);
var		y=parseFloat(obj.lat);
nLen=this.getMap().getZoomUnits(this.getMap().getCurrentZoom())/5000;
direction=270-obj.direction;
var	points=new Array();
points.push(new mapPoint(x,y));
points.push(new mapPoint(GetX1Point(x,direction,nLen),GetY1Point(y,direction,nLen)));
points.push(new mapPoint(GetX2Point(x,direction,nLen),GetY2Point(y,direction,nLen)));
points.push(new mapPoint(GetX3Point(x,direction,nLen),GetY3Point(y,direction,nLen)));
obj.points=points;
this.addPolygon(obj);
return true;},
addPolygon2:function(obj){
var		self=this;
var		latlngs=obj.datastr.split('__');
var		latlng;
var		lat1,lat2,lng1,lng2;
obj.points=new Array();
for(var i=0;i<latlngs.length;i++){
latlng=latlngs[i].split(',');
obj.points.push({lng:parseFloat(latlng[0]),lat:parseFloat(latlng[1])});}
lat1=obj.points[0].lat;
lng1=obj.points[0].lng;
var		j=Math.round(latlngs.length/2);
lat2=obj.points[j].lat;
lng2=obj.points[j].lng;
obj.lat=lat1+(lat2-lat1)/2;
obj.lng=lng1+(lng2-lng1)/2;
return self.addPolygon(obj);},
addPolygon:function(obj){
if(obj.points.length<3){
return;}
if(typeof(obj.color)=="undefined"){
obj.color="#0000FF";}
if(typeof(obj.lat)=="undefined"){
obj.lat=obj.points[0].lat;}
if(typeof(obj.lng)=="undefined"){
obj.lng=obj.points[0].lng;}
var mapobj=this.getmapobj(obj.uiid);
this.removemaker(mapobj);
var points=new Array();
for(var i=0;i<obj.points.length;i++){
points.push(new LTPoint(this.getltmaplng(obj.points[i].lng),this.getltmaplat(obj.points[i].lat)));}
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
this.getMap().addOverLay(oPolygon);
mapobj.obj.push(oPolygon);
var textobj=new LTMapText(new LTPoint(this.getltmaplng(obj.lng),this.getltmaplat(obj.lat)));
textobj.setLabel(obj.name);
this.getMap().addOverLay(textobj);
mapobj.obj.push(textobj);
LTEvent.addListener(textobj,"mouseover",function(){
var win=textobj.openInfoWinHtml(obj.description);
win.closeInfoWindowWithMouse();});
if(obj.showInfo&&obj.showInfo==true){
textobj.openInfoWinHtml(obj.description);}
this.addmapobj(mapobj);},
measure:function(){
this.oMeasureTool.btnClick();},
addFence:function(){
this.ltAreaTool.click();},
addPFence:function(){
this.ltPAreaTool.click();},
addPoint:function(){
this.ltPointTool.click();},
print:function(){
var html="<!DOCTYPE HTML PUBLIC \'-//W3C//DTD HTML 4.01 Transitional//EN\'>\n";
html+=(document.all)?"<html xmlns:v=\"urn:schemeas-microsoft-com:vml\">":"<html>";
html+="\n<head>\n<meta http-equiv=\"Content-Type\" content=\"text/html; charset=gb2312\">\n<title>Print Maps<\/title>\n";
html+="<style type=\"text\/css\">\nbody {margin: 0px;}\n";
html+=(document.all)?"v\\:*{ Behavior:url(#default#VML);}":"";
html+="\n</style>\n";
html+="<\/head>\n";
html+="<body><center>\n";
html+=this.getMap().getMapContent(0);
html+="\n<\/center><\/body>\n<\/html>";
var win=document.open("about:blank","win","menubar=1,width="+this.getMap().container.offsetWidth+",height="+(this.getMap().container.offsetHeight-20)+"\"");
win.document.writeln(html);
win.document.close();},
IsContainPoint:function(obj){
var bounds=this.getMap().getBoundsLatLng();
return bounds.containsPoint(new LTPoint(this.getltmaplng(obj.lng),this.getltmaplat(obj.lat)));}});
function LTPointTool(map,panel){
var self=this;
self.map=map;
self.panel=panel;
var onMapCLick=function(p){
var point=self.map.getClickLatLng(p);
SavePOIDlg({
lat:self.panel.getlatFromltmap(point.getLatitude()),
lng:self.panel.getlngFromltmap(point.getLongitude()),
YesFunc:function(){},
NoFunc:function(){self.destroy();}});}
self.destroy=function(){
LTEvent.removeListener(self.listener);}
self.click=function(){
self.listener=LTEvent.addListener(self.map,"click",onMapCLick);}}
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
if(self.drawing==true){
LTEvent.removeListener(self.listener1);
LTEvent.removeListener(self.listener2);
LTEvent.removeListener(self.listener3);
var		lat1=parseFloat(self.ptFirst.lat.toFixed(6));
var		lng1=parseFloat(self.ptFirst.lng.toFixed(6));
var		lat2=parseFloat(self.ptSecond.lat.toFixed(6));
var		lng2=parseFloat(self.ptSecond.lng.toFixed(6));
if(lng1>lng2){
tmp=lng1;
lng1=lng2;
lng2=tmp;}
if(lat1>lat2){
tmp=lat1;
lat1=lat2;
lat2=tmp;}
SaveAreaDlg({
lat1:lat1,
lng1:lng1,
lat2:lat2,
lng2:lng2,
YesFunc:function(){
self.map.removeOverLay(self.polyobj);
self.click();},
NoFunc:function(){self.destroy();}})}};
self.destroy=function(){
self.map.enableDrag();
if(self.polyobj!=null){
self.map.removeOverLay(self.polyobj);
self.polyobj=null;}};
self.click=function(){
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
function LTPAreaTool(map,panel){
this.map=map;
this.panel=panel;
this.arrPoint=[];
this.objname='__polyareaObj';
var self=this;
var mouseDownHandler=function(p,btn,marker){
if(btn==1){
var point=self.map.getClickLatLng(p);
self.arrPoint.push({
lat:self.panel.getlatFromltmap(point.getLatitude()),
lng:self.panel.getlngFromltmap(point.getLongitude())});
self.draw();}
else if(btn==2){
if(self.arrPoint.length>=3){
SavePAreaDlg({
arrPoint:self.arrPoint,
YesFunc:function(){self.click();},
NoFunc:function(){self.destroy();}});}}
return;};
self.click=function(){
self.arrPoint.length=0;
self.map.disableDrag();
self.panel.deleteMarker(self.objname);
self.listener=LTEvent.addListener(self.map,"mouseup",mouseDownHandler);};
self.destroy=function(){
self.arrPoint.length=0;
self.map.enableDrag();
if(self.listener!=null){
LTEvent.removeListener(self.listener);}
self.panel.deleteMarker(self.objname);};
self.draw=function(){
var len=0;
len=self.arrPoint.length;
switch(len){
case 0:
break;
case 1:
self.panel.addMarker({
uiid:self.objname,
name:'start',
lat:self.arrPoint[0].lat,
lng:self.arrPoint[0].lng});
break;
case 2:
self.panel.addLine({
uiid:self.objname,
points:self.arrPoint,
color:'#0000FF',
linewidth:1});
break;
default:
self.panel.addPolygon({
uiid:self.objname,
name:'right click complete!',
points:self.arrPoint,
lat:self.arrPoint[len-1].lat,
lng:self.arrPoint[len-1].lng,
color:"#0000ff",
description:'right click complete!'});
break;}};}
Ext.reg('ltMapPanel',ltMapPanel);
if(typeof(changeLoadStr)=="function"){
changeLoadStr("load ltMapPanel.js ...");}
veMapPanel=function(config){
var self=this;
var defConfig={
zoomLevel:3,
lat:35.0000,
lng:101.8,
disableAddFunc:false,
homeurl:'http://www.gogps.mobi',
logo:'http://www.gogps.mobi/car.jpg',
vemaps:null,
mapobjs:new Array()};
Ext.apply(this,defConfig);
Ext.apply(this,config);
var	newDiv=document.getElementById(self.contentEl);
if(newDiv==null){
var newDiv=document.createElement("div");
newDiv.id=self.contentEl;
newDiv.style.position="absolute";
newDiv.style.zIndex="10";
newDiv.style.width="100%";
newDiv.style.height="100%";
document.body.appendChild(newDiv);}
this.zoomIn=function(){
self.getMap().ZoomIn();};
this.zoomOut=function(){
self.getMap().ZoomOut();};
this.zoomAll=function(){
self.getMap().SetCenterAndZoom(new VELatLong(self.lat,self.lng),self.zoomLevel);};
this.textSearch=new Ext.form.TextField({
width:130,
emptyText:MapTrack.lang.s_PleaseTypeAddress,
listeners:{
'specialkey':function(txt,ev){
if(ev.getKey()==ev.ENTER){
self.searchAddress(txt.getValue(),10);}}}});
this.btnSearch={
text:MapTrack.lang.s_Search,
iconCls:'Search',
handler:function(){
var address=self.textSearch.getValue();
if(address.length<1){
return;}
self.searchAddress(address,10);}};
self.showAllFence=function(flag){
if(typeof(gShowAllFence)=="function"){
gShowAllFence(self,flag);}};
self.showAllPOI=function(flag){
if(typeof(gShowAllPOI)=="function"){
gShowAllPOI(self,flag);}};
self.showAllPFence=function(flag){
if(typeof(gShowAllPFence)=="function"){
gShowAllPFence(self,flag);}};
self.txt_status=new Ext.Button({
tooltip:' ',
text:' ',
anchor:'90%'});
self.txt_status2=new Ext.Button({
tooltip:' ',
text:' ',
anchor:'90%'});
self.txt_status3=new Ext.Button({
tooltip:' ',
text:' ',
anchor:'90%'});
var		menuitems=[{
text:MapTrack.lang.s_Zoomin,
iconCls:'zoomin',
handler:function(){self.zoomIn();}},{
text:MapTrack.lang.s_Zoomout,
iconCls:'zoomout',
handler:function(){self.zoomOut();}},{
text:MapTrack.lang.s_Zoomall,
iconCls:'zoomall',
handler:function(){self.zoomAll();}},{
text:MapTrack.lang.s_Measure,
iconCls:'measure',
handler:function(){self.measure();}}];
if(self.disableAddFunc==false){
menuitems.push('-');
menuitems.push({
text:MapTrack.lang.s_Polygon,
iconCls:'PolygonTool',
menu:new Ext.menu.Menu({
items:[{
text:MapTrack.lang.s_Add,
iconCls:'Add',
handler:function(){self.addPFence();}},{
text:MapTrack.lang.s_ShowAll,
iconCls:'showAll',
handler:function(item){self.showAllPFence(true);}},{
text:MapTrack.lang.s_HideAll,
iconCls:'hideAll',
handler:function(item){self.showAllPFence(false);}}]})});
menuitems.push({
text:MapTrack.lang.s_Fence,
iconCls:'FenceTool',
menu:new Ext.menu.Menu({
items:[{
text:MapTrack.lang.s_Add,
iconCls:'Add',
handler:function(){self.addFence();}},{
text:MapTrack.lang.s_ShowAll,
iconCls:'showAll',
handler:function(item){self.showAllFence(true);}},{
text:MapTrack.lang.s_HideAll,
iconCls:'hideAll',
handler:function(item){self.showAllFence(false);}}]})});
menuitems.push({
text:MapTrack.lang.s_POI,
iconCls:'pointTool',
menu:new Ext.menu.Menu({
items:[{
text:MapTrack.lang.s_Add,
iconCls:'Add',
handler:function(){self.addPoint();}},{
text:MapTrack.lang.s_ShowAll,
iconCls:'showAll',
handler:function(item){self.showAllPOI(true);}},{
text:MapTrack.lang.s_HideAll,
iconCls:'hideAll',
handler:function(item){self.showAllPOI(false);}}]})});}
menuitems.push('-');
menuitems.push({
text:MapTrack.lang.s_Print,
iconCls:'print',
handler:function(){self.print();}});
self.splitbutton=({
xtype:'tbsplit',
text:MapTrack.lang.s_MapTool,
iconCls:'MapTool',
menu:new Ext.menu.Menu({
items:menuitems})});
self.onMapMove=function(e){
var pt=self.getMap().PixelToLatLong(new VEPixel(e.mapX,e.mapY));
if(self.txt_status){
self.txt_status.setText(
MapTrack.lang.s_MousePos+':'+
pt.Latitude.toFixed(6)+','+
pt.Longitude.toFixed(6)+'['+self.getMap().GetZoomLevel()+']');}};
self.onCenterChange=function(e){
var center=self.getMap().GetCenter();
self.txt_status3.setText("... ...");
self.txt_status2.setText(MapTrack.lang.s_MapCenter+':'+center.Latitude.toFixed(6)+","+center.Longitude.toFixed(6));
setTimeout(
function(){
if(mapGetAddress==null){
return;}
mapGetAddress({lat:center.Latitude,lng:center.Longitude},
function(address){if(address.length>0){self.txt_status3.setText(address);}},
null)},
500);};
veMapPanel.superclass.constructor.call(this,{
bbar:[
this.txt_status,{width:10},
this.txt_status2,
this.txt_status3,
'->',
this.splitbutton,'-',
this.textSearch,this.btnSearch]});}
Ext.extend(veMapPanel,Ext.Panel,{
showLoadTip:function(){
var		self=this;
setTimeout(
function(){
self.oLoadTip=new Ext.LoadMask(Ext.getBody(),{removeMask:true});
self.oLoadTip.show();},500);},
hiddenLoadTip:function(){
var self=this;
setTimeout(
function(){
try{
self.oLoadTip.hide();
self.oLoadTip=null;}catch(e){}},500);},
initMap:function(){
var		self=this;
if(typeof(VEMap)=='undefined'){
setTimeout(function(){try{self.initMap();}catch(e){return;}},2000);
return;}
var wh=this.ownerCt.getSize();
Ext.applyIf(this,wh);
this.vemaps=new VEMap(this.contentEl);
this.getMap().LoadMap(new VELatLong(this.lat,this.lng,0,VEAltitudeMode.RelativeToGround),this.zoomLevel,VEMapStyle.Road,false,VEMapMode.Mode2D,true,1);
this.load=true;
this.veFenceTool=new VEAreaTool(this.vemaps,this);
this.vePFenceTool=new VEPolyAreaTool(this.vemaps,this);
this.vePointTool=new VEPointTool(this.vemaps,this);
this.hiddenLoadTip();
this.getMap().AttachEvent("onmousemove",self.onMapMove);
this.getMap().AttachEvent("onendpan",self.onCenterChange);},
afterRender:function(){
veMapPanel.superclass.afterRender.call(this);
this.showLoadTip();
var id='_id_vemap_js';
if(document.getElementById(id)){
this.initMap();}
else{
if(typeof("loadJSFile")=="function"){
loadJSFile(id,'http://dev.virtualearth.net/mapcontrol/mapcontrol.ashx?v=6.1',this.initMap());}
else{
this.initMap();}}},
initComponent:function(){
veMapPanel.superclass.initComponent.call(this);},
getMap:function(){
return this.vemaps;},
onResize:function(w,h){
if(this.load==true){}
veMapPanel.superclass.onResize.call(this,w,h);},
setSize:function(owidth,oheight,animate){
if(this.load==true){
if(typeof(owidth)=='object'){
this.getMap().Resize(owidth.width-2,owidth.height-28);}
else{
this.getMap().Resize(owidth-2,oheight-28);}}
veMapPanel.superclass.setSize.call(this,owidth,owidth,animate);},
center:function(lng,lat){
this.getMap().SetCenter(new VELatLong(lat,lng));},
centerAndZoom:function(lng,lat,zoom){
this.getMap().SetCenterAndZoom(new VELatLong(lat,lng),zoom);},
getCenter:function(){
var		centerlatlng=this.getMap().GetCenter();
return({lat:centerlatlng.Latitude,lng:centerlatlng.Longitude});},
getCenterLatLng:function(){
var ll=this.getMap().GetCenter();
return{lat:ll.Latitude,
lng:ll.Longitude,
zoom:this.getMap().GetZoomLevel()};},
deleteAll:function(){
this.getMap().DeleteAllShapes();},
bestMaps:function(arrPoints){
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
this.getMap().SetMapView(bounds);},
searchAddress:function(address,zoom){
results=this.getMap().Find("",
address,
null,
null,
0,
1,
true,
true,
true,
true,
null);},
getAddress:function(obj,successfunc){},
mapobj:function(uiid){
this.uiid=uiid;
this.obj=new Array();},
getmapobj:function(uiid){
var obj=null;
for(var i=0;i<this.mapobjs.length;i++){
if(this.mapobjs[i].uiid==uiid){
obj=this.mapobjs[i];
this.mapobjs.splice(i,1);
break;}}
if(obj==null){
obj=new this.mapobj(uiid);}
return obj;},
addmapobj:function(mapobj){
this.mapobjs[this.mapobjs.length]=mapobj;},
removemaker:function(mapobj){
var			obj;
while(1){
obj=mapobj.obj.pop();
if(obj==undefined){
break;}
else{
this.getMap().DeleteShape(obj);}}},
deleteMarker:function(name){
this.removemaker(this.getmapobj(name));},
addMarker:function(obj){
var mapobj=this.getmapobj(obj.uiid);
this.removemaker(mapobj);
var	markobj=new VEShape(VEShapeType.Pushpin,new VELatLong(obj.lat,obj.lng));
if(obj.rotate==null){
obj.rotate=0;}
markobj.SetTitle(obj.name);
markobj.SetDescription(obj.description);
markobj.SetMoreInfoURL(this.homeurl);
markobj.SetPhotoURL(this.logo);
if(typeof(obj.icon)!="undefined"){
markobj.SetCustomIcon(getRotateImgHtml({URL:obj.icon,angle:obj.rotate}));}
this.getMap().AddShape(markobj);
mapobj.obj[0]=markobj;
this.addmapobj(mapobj);},
addLine:function(obj){
if(obj.points.length<2){
return;}
var mapobj=this.getmapobj(obj.uiid);
this.removemaker(mapobj);
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
lineobj.SetLineColor(new VEColor(r,g,b,0.3));
lineobj.HideIcon();
this.getMap().AddShape(lineobj);
mapobj.obj.push(lineobj);
this.addmapobj(mapobj);},
addTriAngle:function(obj){
var		x=parseFloat(obj.lng);
var		y=parseFloat(obj.lat);
var		nLen;
var		lat1;
var		lat2;
var		nSize;
var 	bounds=this.getMap().GetMapView();
lat1=bounds.BottomRightLatLong.Latitude;
lat2=bounds.TopLeftLatLong.Latitude;
lat2-=lat1;
nSize=1000;
nLen=60*lat2/nSize;
direction=270-obj.direction;
var	points=new Array();
points.push(new mapPoint(x,y));
points.push(new mapPoint(GetX1Point(x,direction,nLen),GetY1Point(y,direction,nLen)));
points.push(new mapPoint(GetX2Point(x,direction,nLen),GetY2Point(y,direction,nLen)));
points.push(new mapPoint(GetX3Point(x,direction,nLen),GetY3Point(y,direction,nLen)));
obj.points=points;
this.addPolygon(obj);
return true;},
addPolygon2:function(obj){
var		self=this;
var		latlngs=obj.datastr.split('__');
var		latlng;
var		lat1,lat2,lng1,lng2;
obj.points=new Array();
for(var i=0;i<latlngs.length;i++){
latlng=latlngs[i].split(',');
obj.points.push({lng:parseFloat(latlng[0]),lat:parseFloat(latlng[1])});}
lat1=obj.points[0].lat;
lng1=obj.points[0].lng;
var		j=Math.round(latlngs.length/2);
lat2=obj.points[j].lat;
lng2=obj.points[j].lng;
obj.lat=lat1+(lat2-lat1)/2;
obj.lng=lng1+(lng2-lng1)/2;
return self.addPolygon(obj);},
addPolygon:function(obj){
if(obj.points.length<3){
return;}
if(typeof(obj.color)=="undefined"){
obj.color="#0000FF";}
if(typeof(obj.lat)=="undefined"){
obj.lat=obj.points[0].lat;}
if(typeof(obj.lng)=="undefined"){
obj.lng=obj.points[0].lng;}
var mapobj=this.getmapobj(obj.uiid);
this.removemaker(mapobj);
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
polyobj.SetMoreInfoURL(this.homeurl);
polyobj.SetPhotoURL(this.logo);
polyobj.HideIcon();
if(obj.icon!=null){
var	markobj=new VEShape(VEShapeType.Pushpin,new VELatLong(obj.points[0].lat,obj.points[0].lng));
markobj.SetCustomIcon(obj.icon);
this.getMap().AddShape(markobj);
mapobj.obj.push(markobj);}
this.getMap().AddShape(polyobj);
mapobj.obj.push(polyobj);
this.addmapobj(mapobj);
return;},
measure:function(){
alert('NG');},
addFence:function(){
this.veFenceTool.click();},
addPFence:function(){
this.vePFenceTool.click();},
addPoint:function(){
this.vePointTool.click();},
print:function(){
var obj=document.getElementById(this.contentEl);
var content=obj.innerHTML;
var html="<html>"+"<head><title>Print Maps</title></head>"+"<body  style='margin:0;overflow:hidden;'>"+content+"</body>"+"</html>";
var win=window.open("","win","","width=100%,height=100%");
win.document.writeln(html);
win.document.close();},
IsContainPoint:function(obj){
var 	bounds=this.getMap().GetMapView();
var lng1=bounds.TopLeftLatLong.Longitude;
var lat1=bounds.TopLeftLatLong.Latitude;
var lng2=bounds.BottomRightLatLong.Longitude;
var lat2=bounds.BottomRightLatLong.Latitude;
if(obj.lat>=lat2&&obj.lat<=lat1&&
obj.lng>=lng1&&obj.lng<=lng2){
return true;}
else{
return false;}}});
function VEPointTool(map,panel){
var self=this;
this.map=map;
this.panel=panel;
var mouseDownHandler=function(e){
var		pt=map.PixelToLatLong(new VEPixel(e.mapX,e.mapY));
SavePOIDlg({
lat:pt.Latitude,
lng:pt.Longitude,
YesFunc:function(){},
NoFunc:function(){self.destroy()}});};
self.destroy=function(){
self.map.vemapcontrol.EnableGeoCommunity(false);
self.map.DetachEvent("onmousedown",mouseDownHandler);}
self.click=function(){
self.map.vemapcontrol.EnableGeoCommunity(true);
self.map.AttachEvent("onmousedown",mouseDownHandler);}}
function VEAreaTool(map,panel){
this.map=map;
this.ptFirst;
this.ptSecond;
this.polyobj=null;
this.drawing=false;
this.panel=panel;
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
if(self.drawing==true){
self.map.DetachEvent("onmousedown",mouseDownHandler);
self.map.DetachEvent("onmousemove",mouseMoveHandler);
self.map.DetachEvent("onmouseup",mouseUpHandler);
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
var		continueFunc=function(){
Ext.Msg.confirm(
MapTrack.lang.s_Tip,
MapTrack.lang.s_Continue+'?',
function(btn){
if(btn=="yes"){
self.click();}});}
SaveAreaDlg({
lat1:lat1,
lng1:lng1,
lat2:lat2,
lng2:lng2,
YesFunc:function(){
self.map.DeleteShape(self.polyobj);
self.click();},
NoFunc:function(){self.map.DeleteShape(self.polyobj);}});}
self.map.vemapcontrol.EnableGeoCommunity(false);};
self.click=function(){
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
function VEPolyAreaTool(map,panel){
this.map=map;
this.panel=panel;
this.arrPoint=[];
this.objname='__polyareaObj';
var self=this;
var mouseClickHandler=function(e){
if(e.leftMouseButton==true){
var			latlng=self.map.PixelToLatLong(new VEPixel(e.mapX,e.mapY));
self.arrPoint.push({
lat:parseFloat(latlng.Latitude.toFixed(6)),
lng:parseFloat(latlng.Longitude.toFixed(6))});
self.draw();}
else if(e.rightMouseButton==true){
if(self.arrPoint.length>=3){
self.map.vemapcontrol.EnableGeoCommunity(false);
SavePAreaDlg({
arrPoint:self.arrPoint,
YesFunc:function(){self.click();},
NoFunc:function(){self.destroy();}});}}};
self.click=function(){
self.arrPoint.length=0;
if(self.polyobj!=null){
self.map.DeleteShape(self.polyobj);
self.polyobj=null;}
self.map.vemapcontrol.EnableGeoCommunity(true);
self.map.AttachEvent("onclick",mouseClickHandler);}
self.destroy=function(){
self.arrPoint.length=0;
self.panel.deleteMarker(self.objname);
self.map.vemapcontrol.EnableGeoCommunity(false);
self.map.DetachEvent("onclick",mouseClickHandler);}
self.draw=function(){
var len=0;
len=self.arrPoint.length;
switch(len){
case 0:
break;
case 1:
self.panel.addMarker({
uiid:self.objname,
name:'start',
lat:self.arrPoint[0].lat,
lng:self.arrPoint[0].lng});
break;
case 2:
self.panel.addLine({
uiid:self.objname,
points:self.arrPoint,
color:'#0000FF',
linewidth:1});
break;
default:
self.panel.addPolygon({
uiid:self.objname,
name:'right click complete!',
points:self.arrPoint,
lat:self.arrPoint[len-1].lat,
lng:self.arrPoint[len-1].lng,
color:"#0000ff",
description:'right click complete!'});
break;}}}
Ext.reg('veMapPanel',veMapPanel);
if(typeof(changeLoadStr)=="function"){
changeLoadStr("load veMapPanel.js ...");}
function google_distance(lat1,lng1,lat2,lng2){
var		PI=3.1415926;
var		EARTH_RADIUS=637.8137;
function rad(d){
return d*PI/180;}
var		radLat1=rad(lat1);
var		radLat2=rad(lat2);
var		a=radLat1-radLat2;
var		b=rad(lng1)-rad(lng2);
var s=2*Math.asin(Math.sqrt(Math.pow(Math.sin(a/2),2) +  Math.cos(radLat1)*Math.cos(radLat2)*Math.pow(Math.sin(b/2),2)));
s=s*EARTH_RADIUS;
s*=10000;
return s;}
function pointInPolygon(points,lat,lng){
var i;
var j=points.length-1;
var inPoly=false;
for(i=0;i<points.length;i++){
if(points[i].lng<lng&&points[j].lng>=lng||points[j].lng<lng&&points[i].lng>=lng){
if(points[i].lat+(lng-points[i].lng)/(points[j].lng-points[i].lng)*(points[j].lat-points[i].lat)<lat){
inPoly=!inPoly;}}
j=i;}
return inPoly;}
ggMapPanel=function(config){
var self=this;
var defConfig={
zoomLevel:2,
lat:35.0000,
lng:101.8,
ggmaps:null,
disableAddFunc:false,
mapobjs:new Array()};
Ext.apply(this,defConfig);
Ext.apply(this,config);
var	newDiv=document.getElementById(self.contentEl);
if(newDiv==null){
var newDiv=document.createElement("div");
newDiv.id=self.contentEl;
newDiv.style.position="absolute";
newDiv.style.zIndex="10";
newDiv.style.width="100%";
newDiv.style.height="100%";
document.body.appendChild(newDiv);}
self.zoomIn=function(){
self.getMap().setZoom(self.getMap().getZoom()+1);
self.savesession();};
self.zoomOut=function(){
var		zoom=self.getMap().getZoom();
if(zoom>0){
zoom-=1;}
self.getMap().setZoom(zoom);
self.savesession();};
self.zoomAll=function(){
self.getMap().setCenter(new google.maps.LatLng(self.lat,self.lng));
self.getMap().setZoom(self.zoomLevel);
self.savesession();};
self.savesession=function(){
var centerlatlng=this.getCenterLatLng();
saveMapCenterZoom(0,{lat:centerlatlng.lat,
lng:centerlatlng.lng,
zoomLevel:centerlatlng.zoom});};
self.textSearch=new Ext.form.TextField({
width:130,
emptyText:MapTrack.lang.s_PleaseTypeAddress,
listeners:{
'specialkey':function(txt,ev){
if(ev.getKey()==ev.ENTER){
self.searchAddress(txt.getValue());}}}});
self.btnSearch={
text:MapTrack.lang.s_Search,
iconCls:'Search',
handler:function(){
var address=self.textSearch.getValue();
if(address.length<1){
return;}
self.searchAddress(address);}};
self.showAllFence=function(flag){
if(typeof(gShowAllFence)=="function"){
gShowAllFence(self,flag);}};
self.showAllPOI=function(flag){
if(typeof(gShowAllPOI)=="function"){
gShowAllPOI(self,flag);}};
self.showAllPFence=function(flag){
if(typeof(gShowAllPFence)=="function"){
gShowAllPFence(self,flag);}};
self.onMapClick=function(event){
self.geocoder.geocode({'latLng':event.latLng},
function(results,status){
var	address="No Address...";
if(status==google.maps.GeocoderStatus.OK){
if(results[1].formatted_address.length>results[0].formatted_address.length){
address=results[1].formatted_address;}
else{
address=results[0].formatted_address;}}
else{
address=status;}
alert(address);});};
self.onMapMove=function(event){
if(self.txt_status){
self.txt_status.setText(MapTrack.lang.s_MousePos+':'+event.latLng.lat().toFixed(6)+','+event.latLng.lng().toFixed(6)+'['+self.getMap().getZoom()+']');}};
self.onCenterChange=function(){
var center=self.getMap().getCenter();
self.txt_status3.setText("... ...");
self.txt_status2.setText(MapTrack.lang.s_MapCenter+':'+center.lat().toFixed(6)+","+center.lng().toFixed(6));
setTimeout(
function(){
if(mapGetAddress==null){
return;}
mapGetAddress({lat:center.lat(),lng:center.lng()},
function(address){if(address.length>0){self.txt_status3.setText(address);}},
null)},
500);};
self.txt_status=new Ext.Button({
tooltip:' ',
text:' ',
anchor:'90%'});
self.txt_status2=new Ext.Button({
tooltip:' ',
text:' ',
anchor:'90%'});
self.txt_status3=new Ext.Button({
tooltip:' ',
text:' ',
anchor:'90%'});
var		menuitems=[{
text:MapTrack.lang.s_Zoomin,
iconCls:'zoomin',
handler:function(){self.zoomIn();}},{
text:MapTrack.lang.s_Zoomout,
iconCls:'zoomout',
handler:function(){self.zoomOut();}},{
text:MapTrack.lang.s_Zoomall,
iconCls:'zoomall',
handler:function(){self.zoomAll();}},{
text:MapTrack.lang.s_Measure,
iconCls:'measure',
handler:function(){self.measure();}}];
if(self.disableAddFunc==false){
menuitems.push('-');
menuitems.push({
text:MapTrack.lang.s_Polygon,
iconCls:'PolygonTool',
menu:new Ext.menu.Menu({
items:[{
text:MapTrack.lang.s_Add,
iconCls:'Add',
handler:function(){self.addPFence();}},{
text:MapTrack.lang.s_ShowAll,
iconCls:'showAll',
handler:function(item){self.showAllPFence(true);}},{
text:MapTrack.lang.s_HideAll,
iconCls:'hideAll',
handler:function(item){self.showAllPFence(false);}}]})});
menuitems.push({
text:MapTrack.lang.s_Fence,
iconCls:'FenceTool',
menu:new Ext.menu.Menu({
items:[{
text:MapTrack.lang.s_Add,
iconCls:'Add',
handler:function(){self.addFence();}},{
text:MapTrack.lang.s_ShowAll,
iconCls:'showAll',
handler:function(item){self.showAllFence(true);}},{
text:MapTrack.lang.s_HideAll,
iconCls:'hideAll',
handler:function(item){self.showAllFence(false);}}]})});
menuitems.push({
text:MapTrack.lang.s_POI,
iconCls:'pointTool',
menu:new Ext.menu.Menu({
items:[{
text:MapTrack.lang.s_Add,
iconCls:'Add',
handler:function(){self.addPoint();}},{
text:MapTrack.lang.s_ShowAll,
iconCls:'showAll',
handler:function(item){self.showAllPOI(true);}},{
text:MapTrack.lang.s_HideAll,
iconCls:'hideAll',
handler:function(item){self.showAllPOI(false);}}]})});}
menuitems.push('-');
menuitems.push({
text:MapTrack.lang.s_Print,
iconCls:'print',
handler:function(){self.print();}});
self.splitbutton=({
xtype:'tbsplit',
text:MapTrack.lang.s_MapTool,
iconCls:'MapTool',
menu:new Ext.menu.Menu({
items:menuitems})});
ggMapPanel.superclass.constructor.call(this,{
bbar:[
this.txt_status,{width:10},
this.txt_status2,
this.txt_status3,
'->',
this.splitbutton,'-',
this.textSearch,this.btnSearch]});}
Ext.extend(ggMapPanel,Ext.Panel,{
showLoadTip:function(){
var		self=this;
setTimeout(
function(){
self.oLoadTip=new Ext.LoadMask(Ext.getBody(),{removeMask:true});
self.oLoadTip.show();},500);},
hiddenLoadTip:function(){
var self=this;
setTimeout(
function(){
try{
self.oLoadTip.hide();
self.oLoadTip=null;}catch(e){}},500);},
initMap:function(){
var		self=this;
if(typeof(google.maps)=='undefined'){
setTimeout(function(){try{self.initMap();}catch(e){return;}},500);
return;}
this.ggmaps=new google.maps.Map(document.getElementById(self.contentEl),{
center:new google.maps.LatLng(self.lat,self.lng),
mapTypeControl:true,
mapTypeControlOptions:{style:google.maps.MapTypeControlStyle.DEFAULT,position:google.maps.ControlPosition.TOP},
scaleControl:true,
scaleControlOptions:{style:google.maps.ScaleControlStyle.DEFAULT,position:google.maps.ControlPosition.BOTTOM},
navigationControl:true,
navigationControlOptions:{style:google.maps.NavigationControlStyle.DEFAULT,position:google.maps.ControlPosition.LEFT},
streetViewControl:true,
draggableCursor:'crosshair',
mapTypeId:google.maps.MapTypeId.ROADMAP,
zoom:self.zoomLevel});
var traffic=new google.maps.ImageMapType({
getTileUrl:function(coord,zoom){
return "http://mt3.google.com/mapstt?"+"zoom="+zoom+"&x="+coord.x+"&y="+coord.y+"&client=api";},
tileSize:new google.maps.Size(256,256),
isPng:true});
this.getMap().overlayMapTypes.insertAt(0,traffic);
this.GMeasure=new GMeasureTool(this.getMap());
this.GAddPoint=new GAddPointTool(this.getMap(),this);
this.GAddPFence=new GAddPolyAreaTool(this.getMap(),this);
this.geocoder=new google.maps.Geocoder();
google.maps.event.addListener(this.getMap(),"mousemove",this.onMapMove);
google.maps.event.addListener(this.getMap(),"center_changed",this.onCenterChange);
this.getMap().enableKeyDragZoom();
this.hiddenLoadTip();
this.load=true;},
afterRender:function(){
this.showLoadTip();
ggMapPanel.superclass.afterRender.call(this);
var wh=this.ownerCt.getSize();
Ext.applyIf(this,wh);
this.initMap();},
initComponent:function(){
ggMapPanel.superclass.initComponent.call(this);},
getMap:function(){
return this.ggmaps;},
onResize:function(w,h){
ggMapPanel.superclass.onResize.call(this,w,h);
if(this.load==true){
google.maps.event.trigger(this.getMap(),'resize');}},
setSize:function(width,height,animate){
if(this.load==true){
google.maps.event.trigger(this.getMap(),'resize');}
ggMapPanel.superclass.setSize.call(this,width,height,animate);},
center:function(lng,lat){
this.getMap().setCenter(new google.maps.LatLng(lat,lng));
this.savesession();},
centerAndZoom:function(lng,lat,zoom){
this.getMap().setCenter(new google.maps.LatLng(lat,lng),zoom);
this.savesession();},
getCenter:function(){
return this.getMap().getCenter();},
getCenterLatLng:function(){
var ll=this.getMap().getCenter();
var	zoom=this.getMap().getZoom();
return{lat:ll.lat(),lng:ll.lng(),zoom:zoom};},
deleteAll:function(){},
bestMaps:function(arrPoints){
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
this.getMap().fitBounds(bounds);},
searchAddress:function(address){
var	self=this;
if(self.searchMarker){
self.searchMarker.setMap(null);}
self.geocoder.geocode({'address':address},
function(results,status){
if(status==google.maps.GeocoderStatus.OK){
self.getMap().setCenter(results[0].geometry.location);
self.searchMarker=new google.maps.Marker({
map:self.getMap(),
position:results[0].geometry.location});}else{
alert("Geocode was not successful for the following reason: "+status);}});},
getAddress:function(obj,successfunc,failedfunc){
if(obj.lat==0&&obj.lng==0){
if(failedfunc!=null){failedfunc()}
return;}
var point=new google.maps.LatLng(parseFloat(obj.lat),parseFloat(obj.lng));
this.geocoder.geocode({'latLng':point},
function(results,status){
var	address="No Address...";
if(status==google.maps.GeocoderStatus.OK){
address=results[0].formatted_address;
if((results[0].geometry.location_type==google.maps.GeocoderLocationType.ROOFTOP)||(results[0].geometry.location_type==google.maps.GeocoderLocationType.APPROXIMATE)){
var		meter=0;
var 	meter=google_distance(point.lat(),point.lng(),results[0].geometry.location.lat(),results[0].geometry.location.lng());
meter=parseInt(meter);
if(meter>1000){
meter=meter/1000;
address+='('+meter+'km)';}
else{
address+='('+meter+'m)';}}
successfunc(address);}
else{
if(failedfunc!=null){
failedfunc();}}});},
mapobj:function(uiid){
this.uiid=uiid;
this.obj=new Array();},
getmapobj:function(uiid){
var obj=null;
for(var i=0;i<this.mapobjs.length;i++){
if(this.mapobjs[i].uiid==uiid){
obj=this.mapobjs[i];
this.mapobjs.splice(i,1);
break;}}
if(obj==null){
obj=new this.mapobj(uiid);}
return obj;},
addmapobj:function(mapobj){
this.mapobjs[this.mapobjs.length]=mapobj;},
removemaker:function(mapobj){
var			obj;
while(1){
obj=mapobj.obj.pop();
if(obj==undefined){
break;}
else{
obj.setMap(null);}}},
deleteMarker:function(name){
this.removemaker(this.getmapobj(name));},
addMarker:function(obj){
var	self=this;
var mapobj=this.getmapobj(obj.uiid);
this.removemaker(mapobj);
var	markobj=new GUMarker(obj);
markobj.setMap(this.getMap());
mapobj.obj[0]=markobj;
this.addmapobj(mapobj);
var iw=new google.maps.InfoWindow({content:obj.description,disableAutoPan:true,pixelOffset:new google.maps.Size(0,0)});
google.maps.event.addListener(
markobj,
"click",
function(){
iw.open(self.getMap(),markobj);});},
addLine:function(obj){
if(obj.points.length<2){
return;}
var mapobj=this.getmapobj(obj.uiid);
this.removemaker(mapobj);
var			points=new Array();
for(var i=0;i<obj.points.length;i++){
points.push(new google.maps.LatLng(obj.points[i].lat,obj.points[i].lng));}
if(obj.color==null){
obj.color="red";}
if(obj.linewidth==null){
obj.linewidth=1;}
obj.linewidth*=4;
if(obj.opacity==null){
obj.opacity=0.3;}
var lineobj=new google.maps.Polyline({
path:points,
strokeColor:obj.color,
strokeWeight:obj.linewidth,
strokeOpacity:obj.opacity,
geodesic:true});
lineobj.setMap(this.getMap());
mapobj.obj.push(lineobj);
this.addmapobj(mapobj);},
addTriAngle:function(obj){
var		x=parseFloat(obj.lng);
var		y=parseFloat(obj.lat);
var		nLen;
var		lat1;
var		lat2;
var 	nSize=1024;
var 	bounds=this.getMap().getBounds();
lat1=bounds.getSouthWest().lat();
lat2=bounds.getNorthEast().lat();
lat2-=lat1;
nLen=80*lat2/nSize;
direction=270-obj.direction;
var	points=new Array();
points.push(new mapPoint(x,y));
points.push(new mapPoint(GetX1Point(x,direction,nLen),GetY1Point(y,direction,nLen)));
points.push(new mapPoint(GetX2Point(x,direction,nLen),GetY2Point(y,direction,nLen)));
points.push(new mapPoint(GetX3Point(x,direction,nLen),GetY3Point(y,direction,nLen)));
obj.points=points;
this.addPolygon(obj);
return true;},
addPolygon2:function(obj){
var		self=this;
var		latlngs=obj.datastr.split('__');
var		latlng;
var		lat1,lat2,lng1,lng2;
obj.points=new Array();
for(var i=0;i<latlngs.length;i++){
latlng=latlngs[i].split(',');
obj.points.push({lng:parseFloat(latlng[0]),lat:parseFloat(latlng[1])});}
lat1=obj.points[0].lat;
lng1=obj.points[0].lng;
var		j=Math.round(latlngs.length/2);
lat2=obj.points[j].lat;
lng2=obj.points[j].lng;
obj.lat=lat1+(lat2-lat1)/2;
obj.lng=lng1+(lng2-lng1)/2;
return self.addPolygon(obj);},
addPolygon:function(obj){
var		self=this;
if(obj.points.length<3){
return;}
if(typeof(obj.color)=="undefined"){
obj.color="#0000FF";}
if(typeof(obj.lat)=="undefined"){
obj.lat=obj.points[0].lat;}
if(typeof(obj.lng)=="undefined"){
obj.lng=obj.points[0].lng;}
var mapobj=this.getmapobj(obj.uiid);
this.removemaker(mapobj);
var			points=new Array();
for(var i=0;i<obj.points.length;i++){
points.push(new google.maps.LatLng(obj.points[i].lat,obj.points[i].lng));}
var polyobj=new google.maps.Polygon({
paths:points,
strokeColor:obj.color,
strokeOpacity:0.8,
fillColor:obj.color,
fillOpacity:0.4});
polyobj.setMap(this.getMap());
mapobj.obj.push(polyobj);
var	markobj=new GUMarker(obj);
markobj.setMap(this.getMap());
mapobj.obj.push(markobj);
this.addmapobj(mapobj);
return polyobj;},
measure:function(){
this.GMeasure.click();},
addFence:function(){
var		self=this;
self.getMap().enableDragRect();
var dz=self.getMap().getDragRectObject();
google.maps.event.addListener(dz,'dragend',
function(bnds){
SaveAreaDlg({
lat1:bnds.getSouthWest().lat(),
lng1:bnds.getSouthWest().lng(),
lat2:bnds.getNorthEast().lat(),
lng2:bnds.getNorthEast().lng(),
YesFunc:function(obj){},
NoFunc:function(){self.getMap().disableDragRect();}});});},
addPoint:function(){
this.GAddPoint.click();},
addPFence:function(){
this.GAddPFence.click();},
print:function(){
var obj=document.getElementById(this.contentEl);
var content=obj.innerHTML;
var html="<html>"+"<head><title>Print Maps</title></head>"+"<body  style='margin:0;overflow:hidden;'>"+content+"</body>"+"</html>";
var win=window.open("","win","","status=no,location=no,scrollbars=no,resizable=yes,width=100%,height=100%");
win.document.writeln(html);
win.document.close();},
IsContainPoint:function(obj){
var bounds=this.getMap().getBounds();
return bounds.contains(new google.maps.LatLng(obj.lat,obj.lng));}});
function GMeasureTool(map){
this.status=0;
this.curpoint=null;
this.lastpoint=null;
this.lineObj=null;
this.distancelen=0;
this.map=map;
this.lineColor="#0000ff";
this.lineWidth=3;
this.lineAlpha=0.5;
this.infowindow=new google.maps.InfoWindow({
content:'start'});
this.init=function(){
var self=this;
if(self.map==null){
return;}
self.event=google.maps.event.addListener(
self.map,
"click",
function(event){
self.curpoint=event.latLng;
if(self.lastpoint!=null){
if(self.lineObj==null){
self.lineObj=new google.maps.Polyline({
path:[self.lastpoint,self.curpoint],
strokeColor:self.lineColor,
strokeWeight:self.lineWidth,
strokeOpacity:self.lineAlpha});
self.lineObj.setMap(self.map);}
else{
self.lineObj.getPath().push(self.curpoint);}
self.distancelen+=google_distance(self.lastpoint.lat(),self.lastpoint.lng(),self.curpoint.lat(),self.curpoint.lng());}
var		msg=Math.round(self.distancelen)*0.001;
self.infowindow.setContent(msg+"km");
self.infowindow.setPosition(self.curpoint);
self.infowindow.close();
self.infowindow.open(self.map);
self.lastpoint=self.curpoint;});}
this.click=function(){
if(this.status==0){
this.init();
this.status=1;}
else{
this.destroy();
this.status=0;}}
this.destroy=function(){
var self=this;
google.maps.event.removeListener(self.event);
self.lineObj.setMap(null);
self.infowindow.close();
self.event=null;
self.status=0;
self.distancelen=0;
self.curpoint=null;
self.lastpoint=null;
self.lineObj=null;
self.infowindow=null;}}
function GAddPointTool(map,panel){
var self=this;
this.map=map;
this.panel=panel;
var onMapCLick=function(event){
SavePOIDlg({
lat:event.latLng.lat().toFixed(6),
lng:event.latLng.lng().toFixed(6),
YesFunc:function(){},
NoFunc:function(){self.destroy();}});}
self.click=function(){
self.event=google.maps.event.addListener(self.map,"click",onMapCLick);}
self.destroy=function(){
google.maps.event.removeListener(self.event);
self.event=null;}}
function GAddPolyAreaTool(map,panel){
this.map=map;
this.panel=panel;
this.arrPoint=[];
this.event1=null;
this.event2=null;
this.objname='__polyareaObj';
this.polyobj=null;
var self=this;
self.click=function(){
self.arrPoint.length=0;
if(self.map==null){
return;}
self.event1=google.maps.event.addListener(
self.map,
"click",
function(event){
self.arrPoint.push({lat:event.latLng.lat().toFixed(6),lng:event.latLng.lng().toFixed(6)});
self.draw();});}
self.destroy=function(){
self.arrPoint.length=0;
if(self.event1!=null){
google.maps.event.removeListener(self.event1);
self.event1=null;}
if(self.event2!=null){
google.maps.event.removeListener(self.event2);
self.event2=null;}
self.panel.deleteMarker(self.objname);}
self.draw=function(){
var len=0;
len=self.arrPoint.length;
switch(len){
case 0:
break;
case 1:
self.panel.addMarker({
uiid:self.objname,
name:'start',
lat:self.arrPoint[0].lat,
lng:self.arrPoint[0].lng});
break;
case 2:
self.panel.addLine({
uiid:self.objname,
points:self.arrPoint,
color:'#0000FF',
linewidth:0.8});
break;
default:
if((self.polyobj!=null)&&(self.event2!=null)){
google.maps.event.removeListener(self.event2);
self.event2=null;}
self.polyobj=self.panel.addPolygon({
uiid:self.objname,
name:'right click complete!',
points:self.arrPoint,
lat:self.arrPoint[len-1].lat,
lng:self.arrPoint[len-1].lng,
color:"#0000ff",
description:'right click complete!'});
self.event2=google.maps.event.addListener(
self.polyobj,
"rightclick",
function(event){
SavePAreaDlg({
arrPoint:self.arrPoint,
YesFunc:function(){},
NoFunc:function(){self.destroy();}});});
break;}}}
function GUMarker(obj){
this.latlng_=new google.maps.LatLng(obj.lat,obj.lng),
this.obj=obj;}
GUMarker.prototype=new google.maps.OverlayView();
GUMarker.prototype.draw=function(){
var self=this;
var div=self.div_;
if(!div){
div=self.div_=document.createElement('DIV');
div.style.border="none";
div.style.position="absolute";
div.style.paddingLeft="0px";
div.style.cursor='pointer';
var panes=this.getPanes();
panes.overlayImage.appendChild(div);
google.maps.event.addDomListener(div,"click",function(event){
google.maps.event.trigger(self,"click");});}
if(self.obj.rotate==null){
self.obj.rotate=0;}
if(self.obj.icon!=null){
var text="<span>"+getRotateImgHtml({URL:self.obj.icon,angle:self.obj.rotate})+"</span>";}
else{
var text="";}
text+="<div style='border:1px solid #aaaaaa;background-color:#ffffd7;color:"+self.obj.color+";font:normal 10px verdana;white-space:nowrap;'>"+self.obj.name+"</div>";
div.innerHTML=text;
var point=this.getProjection().fromLatLngToDivPixel(self.latlng_);
if(point){
div.style.left=point.x+'px';
div.style.top=point.y+'px';}};
GUMarker.prototype.remove=function(){
if(this.div_){
this.div_.parentNode.removeChild(this.div_);
this.div_=null;}};
GUMarker.prototype.getPosition=function(){
return this.latlng_;};(function(){
var toPixels=function(widthValue){
var px;
switch(widthValue){
case 'thin':
px="2px";
break;
case 'medium':
px="4px";
break;
case 'thick':
px="6px";
break;
default:
px=widthValue;}
return px;};
var getBorderWidths=function(h){
var computedStyle;
var bw={};
if(document.defaultView&&document.defaultView.getComputedStyle){
computedStyle=h.ownerDocument.defaultView.getComputedStyle(h,"");
if(computedStyle){
bw.top=parseInt(computedStyle.borderTopWidth,10)||0;
bw.bottom=parseInt(computedStyle.borderBottomWidth,10)||0;
bw.left=parseInt(computedStyle.borderLeftWidth,10)||0;
bw.right=parseInt(computedStyle.borderRightWidth,10)||0;
return bw;}}else if(document.documentElement.currentStyle){
if(h.currentStyle){
bw.top=parseInt(toPixels(h.currentStyle.borderTopWidth),10)||0;
bw.bottom=parseInt(toPixels(h.currentStyle.borderBottomWidth),10)||0;
bw.left=parseInt(toPixels(h.currentStyle.borderLeftWidth),10)||0;
bw.right=parseInt(toPixels(h.currentStyle.borderRightWidth),10)||0;
return bw;}}
bw.top=parseInt(h.style["border-top-width"],10)||0;
bw.bottom=parseInt(h.style["border-bottom-width"],10)||0;
bw.left=parseInt(h.style["border-left-width"],10)||0;
bw.right=parseInt(h.style["border-right-width"],10)||0;
return bw;};
var getMousePosition=function(e){
var posX=0,posY=0;
e=e||window.event;
if(typeof e.pageX!=="undefined"){
posX=e.pageX;
posY=e.pageY;}else if(typeof e.clientX!=="undefined"){
posX=e.clientX+(typeof document.documentElement.scrollLeft!=="undefined"?document.documentElement.scrollLeft:document.body.scrollLeft);
posY=e.clientY+(typeof document.documentElement.scrollTop!=="undefined"?document.documentElement.scrollTop:document.body.scrollTop);}
return{
left:posX,
top:posY};};
var getElementPosition=function(h){
var posX=h.offsetLeft;
var posY=h.offsetTop;
var parent=h.offsetParent;
while(parent!==null){
if(parent!==document.body&&parent!==document.documentElement){
posX-=parent.scrollLeft;
posY-=parent.scrollTop;}
posX+=parent.offsetLeft;
posY+=parent.offsetTop;
parent=parent.offsetParent;}
return{
left:posX,
top:posY};};
var setVals=function(obj,vals){
if(obj&&vals){
for(var x in vals){
if(vals.hasOwnProperty(x)){
obj[x]=vals[x];}}}
return obj;};
var setOpacity=function(div,op){
if(typeof op!=='undefined'){
div.style.opacity=op;}
if(typeof div.style.opacity!=='undefined'){
div.style.filter="alpha(opacity="+(div.style.opacity*100)+")";}};
function DragRect(map,opt_zoomOpts){
var ov=new google.maps.OverlayView();
var me=this;
ov.onAdd=function(){
me.init_(map,opt_zoomOpts);};
ov.draw=function(){};
ov.onRemove=function(){};
ov.setMap(map);
this.prjov_=ov;}
DragRect.prototype.init_=function(map,opt_zoomOpts){
this.map_=map;
opt_zoomOpts=opt_zoomOpts||{};
this.key_=opt_zoomOpts.key||'shift';
this.key_=this.key_.toLowerCase();
this.borderWidths_=getBorderWidths(this.map_.getDiv());
this.paneDiv_=document.createElement("div");
this.paneDiv_.onselectstart=function(){
return false;};
setVals(this.paneDiv_.style,{
backgroundColor:'white',
opacity:0.0,
cursor:'crosshair'});
setVals(this.paneDiv_.style,opt_zoomOpts.paneStyle);
setVals(this.paneDiv_.style,{
position:'absolute',
overflow:'hidden',
zIndex:10001,
display:'none'});
if(this.key_==='shift'){
this.paneDiv_.style.MozUserSelect="none";}
setOpacity(this.paneDiv_);
if(this.paneDiv_.style.backgroundColor==='transparent'){
this.paneDiv_.style.backgroundColor='white';
setOpacity(this.paneDiv_,0);}
this.map_.getDiv().appendChild(this.paneDiv_);
this.boxDiv_=document.createElement('div');
setVals(this.boxDiv_.style,{
border:'thin solid #FF0000'});
setVals(this.boxDiv_.style,opt_zoomOpts.boxStyle);
setVals(this.boxDiv_.style,{
position:'absolute',
display:'none'});
setOpacity(this.boxDiv_);
this.map_.getDiv().appendChild(this.boxDiv_);
this.boxBorderWidths_=getBorderWidths(this.boxDiv_);
var me=this;
this.keyDownListener_=google.maps.event.addDomListener(document,'keydown',function(e){});
this.keyUpListener_=google.maps.event.addDomListener(document,'keyup',function(e){});
this.mouseDownListener_=google.maps.event.addDomListener(this.paneDiv_,'mousedown',function(e){
me.onMouseDown_(e);});
this.mouseDownListenerDocument_=google.maps.event.addDomListener(document,'mousedown',function(e){
me.onMouseDownDocument_(e);});
this.mouseMoveListener_=google.maps.event.addDomListener(document,'mousemove',function(e){
me.onMouseMove_(e);});
this.mouseUpListener_=google.maps.event.addDomListener(document,'mouseup',function(e){
me.onMouseUp_(e);});
this.enableDrag_=false;
this.dragging_=false;
this.startPt_=null;
this.endPt_=null;
this.boxMaxX_=null;
this.boxMaxY_=null;
this.mousePosn_=null;
this.mapPosn_=getElementPosition(this.map_.getDiv());
this.mouseDown_=false;
this.start();};
DragRect.prototype.start=function(){
var me=this;
if(this.map_){
me.enableDrag_=true;
me.setPaneVisibility_();
google.maps.event.trigger(me,'activate');}}
DragRect.prototype.isMouseOnMap_=function(){
var mousePos=this.mousePosn_;
if(mousePos){
var mapPos=this.mapPosn_;
var mapDiv=this.map_.getDiv();
return mousePos.left>mapPos.left&&mousePos.left<mapPos.left+mapDiv.offsetWidth&&
mousePos.top>mapPos.top&&mousePos.top<mapPos.top+mapDiv.offsetHeight;}else{
return false;}};
DragRect.prototype.setPaneVisibility_=function(){
if(this.map_&&this.enableDrag_&&this.isMouseOnMap_()){
var mapDiv=this.map_.getDiv();
this.paneDiv_.style.left=0+'px';
this.paneDiv_.style.top=0+'px';
this.paneDiv_.style.width=mapDiv.offsetWidth-(this.borderWidths_.left+this.borderWidths_.right)+'px';
this.paneDiv_.style.height=mapDiv.offsetHeight-(this.borderWidths_.top+this.borderWidths_.bottom)+'px';
this.paneDiv_.style.display='block';
this.boxMaxX_=parseInt(this.paneDiv_.style.width,10)-(this.boxBorderWidths_.left+this.boxBorderWidths_.right);
this.boxMaxY_=parseInt(this.paneDiv_.style.height,10)-(this.boxBorderWidths_.top+this.boxBorderWidths_.bottom);}else{
this.paneDiv_.style.display='none';}};
DragRect.prototype.getMousePoint_=function(e){
var mousePosn=getMousePosition(e);
var p=new google.maps.Point();
p.x=mousePosn.left-this.mapPosn_.left-this.borderWidths_.left;
p.y=mousePosn.top-this.mapPosn_.top-this.borderWidths_.top;
p.x=Math.min(p.x,this.boxMaxX_);
p.y=Math.min(p.y,this.boxMaxY_);
p.x=Math.max(p.x,0);
p.y=Math.max(p.y,0);
return p;};
DragRect.prototype.onMouseDown_=function(e){
if(this.map_&&this.enableDrag_){
this.mapPosn_=getElementPosition(this.map_.getDiv());
this.dragging_=true;
this.startPt_=this.endPt_=this.getMousePoint_(e);
var prj=this.prjov_.getProjection();
var latlng=prj.fromDivPixelToLatLng(this.startPt_);
google.maps.event.trigger(this,'dragstart',latlng);}};
DragRect.prototype.onMouseDownDocument_=function(e){
this.mouseDown_=true;};
DragRect.prototype.onMouseMove_=function(e){
this.mousePosn_=getMousePosition(e);
if(this.dragging_){
this.endPt_=this.getMousePoint_(e);
var left=Math.min(this.startPt_.x,this.endPt_.x);
var top=Math.min(this.startPt_.y,this.endPt_.y);
var width=Math.abs(this.startPt_.x-this.endPt_.x);
var height=Math.abs(this.startPt_.y-this.endPt_.y);
this.boxDiv_.style.left=left+'px';
this.boxDiv_.style.top=top+'px';
this.boxDiv_.style.width=width+'px';
this.boxDiv_.style.height=height+'px';
this.boxDiv_.style.display='block';
google.maps.event.trigger(this,'drag',new google.maps.Point(left,top+height),new google.maps.Point(left+width,top));}else if(!this.mouseDown_){
this.setPaneVisibility_();}};
DragRect.prototype.onMouseUp_=function(e){
this.mouseDown_=false;
if(this.dragging_){
var left=Math.min(this.startPt_.x,this.endPt_.x);
var top=Math.min(this.startPt_.y,this.endPt_.y);
var width=Math.abs(this.startPt_.x-this.endPt_.x);
var height=Math.abs(this.startPt_.y-this.endPt_.y);
var prj=this.prjov_.getProjection();
var containerPos=getElementPosition(this.map_.getDiv());
var mapPanePos=getElementPosition(this.prjov_.getPanes().mapPane);
left=left+(containerPos.left-mapPanePos.left);
top=top+(containerPos.top-mapPanePos.top);
var sw=prj.fromDivPixelToLatLng(new google.maps.Point(left,top+height));
var ne=prj.fromDivPixelToLatLng(new google.maps.Point(left+width,top));
var bnds=new google.maps.LatLngBounds(sw,ne);
this.dragging_=false;
this.boxDiv_.style.display='none';
google.maps.event.trigger(this,'dragend',bnds);}};
google.maps.Map.prototype.enableDragRect=function(opt_zoomOpts){
this.dragRect_=new DragRect(this,opt_zoomOpts);};
google.maps.Map.prototype.disableDragRect=function(){
var d=this.dragRect_;
if(d){
google.maps.event.removeListener(d.mouseDownListener_);
google.maps.event.removeListener(d.mouseDownListenerDocument_);
google.maps.event.removeListener(d.mouseMoveListener_);
google.maps.event.removeListener(d.mouseUpListener_);
google.maps.event.removeListener(d.keyUpListener_);
google.maps.event.removeListener(d.keyDownListener_);
this.getDiv().removeChild(d.boxDiv_);
this.getDiv().removeChild(d.paneDiv_);
this.dragRect_=null;}};
google.maps.Map.prototype.DragRectEnabled=function(){
return this.dragRect_!==null;};
google.maps.Map.prototype.getDragRectObject=function(){
return this.dragRect_;};})();(function(){
var toPixels=function(widthValue){
var px;
switch(widthValue){
case 'thin':
px="2px";
break;
case 'medium':
px="4px";
break;
case 'thick':
px="6px";
break;
default:
px=widthValue;}
return px;};
var getBorderWidths=function(h){
var computedStyle;
var bw={};
if(document.defaultView&&document.defaultView.getComputedStyle){
computedStyle=h.ownerDocument.defaultView.getComputedStyle(h,"");
if(computedStyle){
bw.top=parseInt(computedStyle.borderTopWidth,10)||0;
bw.bottom=parseInt(computedStyle.borderBottomWidth,10)||0;
bw.left=parseInt(computedStyle.borderLeftWidth,10)||0;
bw.right=parseInt(computedStyle.borderRightWidth,10)||0;
return bw;}}else if(document.documentElement.currentStyle){
if(h.currentStyle){
bw.top=parseInt(toPixels(h.currentStyle.borderTopWidth),10)||0;
bw.bottom=parseInt(toPixels(h.currentStyle.borderBottomWidth),10)||0;
bw.left=parseInt(toPixels(h.currentStyle.borderLeftWidth),10)||0;
bw.right=parseInt(toPixels(h.currentStyle.borderRightWidth),10)||0;
return bw;}}
bw.top=parseInt(h.style["border-top-width"],10)||0;
bw.bottom=parseInt(h.style["border-bottom-width"],10)||0;
bw.left=parseInt(h.style["border-left-width"],10)||0;
bw.right=parseInt(h.style["border-right-width"],10)||0;
return bw;};
var getMousePosition=function(e){
var posX=0,posY=0;
e=e||window.event;
if(typeof e.pageX!=="undefined"){
posX=e.pageX;
posY=e.pageY;}else if(typeof e.clientX!=="undefined"){
posX=e.clientX+(typeof document.documentElement.scrollLeft!=="undefined"?document.documentElement.scrollLeft:document.body.scrollLeft);
posY=e.clientY+(typeof document.documentElement.scrollTop!=="undefined"?document.documentElement.scrollTop:document.body.scrollTop);}
return{
left:posX,
top:posY};};
var getElementPosition=function(h){
var posX=h.offsetLeft;
var posY=h.offsetTop;
var parent=h.offsetParent;
while(parent!==null){
if(parent!==document.body&&parent!==document.documentElement){
posX-=parent.scrollLeft;
posY-=parent.scrollTop;}
posX+=parent.offsetLeft;
posY+=parent.offsetTop;
parent=parent.offsetParent;}
return{
left:posX,
top:posY};};
var setVals=function(obj,vals){
if(obj&&vals){
for(var x in vals){
if(vals.hasOwnProperty(x)){
obj[x]=vals[x];}}}
return obj;};
var setOpacity=function(div,op){
if(typeof op!=='undefined'){
div.style.opacity=op;}
if(typeof div.style.opacity!=='undefined'){
div.style.filter="alpha(opacity="+(div.style.opacity*100)+")";}};
function DragZoom(map,opt_zoomOpts){
var ov=new google.maps.OverlayView();
var me=this;
ov.onAdd=function(){
me.init_(map,opt_zoomOpts);};
ov.draw=function(){};
ov.onRemove=function(){};
ov.setMap(map);
this.prjov_=ov;}
DragZoom.prototype.init_=function(map,opt_zoomOpts){
this.map_=map;
opt_zoomOpts=opt_zoomOpts||{};
this.key_=opt_zoomOpts.key||'shift';
this.key_=this.key_.toLowerCase();
this.borderWidths_=getBorderWidths(this.map_.getDiv());
this.paneDiv_=document.createElement("div");
this.paneDiv_.onselectstart=function(){
return false;};
setVals(this.paneDiv_.style,{
backgroundColor:'white',
opacity:0.0,
cursor:'crosshair'});
setVals(this.paneDiv_.style,opt_zoomOpts.paneStyle);
setVals(this.paneDiv_.style,{
position:'absolute',
overflow:'hidden',
zIndex:10001,
display:'none'});
if(this.key_==='shift'){
this.paneDiv_.style.MozUserSelect="none";}
setOpacity(this.paneDiv_);
if(this.paneDiv_.style.backgroundColor==='transparent'){
this.paneDiv_.style.backgroundColor='white';
setOpacity(this.paneDiv_,0);}
this.map_.getDiv().appendChild(this.paneDiv_);
this.boxDiv_=document.createElement('div');
setVals(this.boxDiv_.style,{
border:'thin solid #FF0000'});
setVals(this.boxDiv_.style,opt_zoomOpts.boxStyle);
setVals(this.boxDiv_.style,{
position:'absolute',
display:'none'});
setOpacity(this.boxDiv_);
this.map_.getDiv().appendChild(this.boxDiv_);
this.boxBorderWidths_=getBorderWidths(this.boxDiv_);
var me=this;
this.keyDownListener_=google.maps.event.addDomListener(document,'keydown',function(e){
me.onKeyDown_(e);});
this.keyUpListener_=google.maps.event.addDomListener(document,'keyup',function(e){
me.onKeyUp_(e);});
this.mouseDownListener_=google.maps.event.addDomListener(this.paneDiv_,'mousedown',function(e){
me.onMouseDown_(e);});
this.mouseDownListenerDocument_=google.maps.event.addDomListener(document,'mousedown',function(e){
me.onMouseDownDocument_(e);});
this.mouseMoveListener_=google.maps.event.addDomListener(document,'mousemove',function(e){
me.onMouseMove_(e);});
this.mouseUpListener_=google.maps.event.addDomListener(document,'mouseup',function(e){
me.onMouseUp_(e);});
this.hotKeyDown_=false;
this.dragging_=false;
this.startPt_=null;
this.endPt_=null;
this.boxMaxX_=null;
this.boxMaxY_=null;
this.mousePosn_=null;
this.mapPosn_=getElementPosition(this.map_.getDiv());
this.mouseDown_=false;};
DragZoom.prototype.isHotKeyDown_=function(e){
var isHot;
e=e||window.event;
isHot=(e.shiftKey&&this.key_==='shift')||(e.altKey&&this.key_==='alt')||(e.ctrlKey&&this.key_==='ctrl');
if(!isHot){
switch(e.keyCode){
case 16:
if(this.key_==='shift'){
isHot=true;}
break;
case 17:
if(this.key_==='ctrl'){
isHot=true;}
break;
case 18:
if(this.key_==='alt'){
isHot=true;}
break;}}
return isHot;};
DragZoom.prototype.isMouseOnMap_=function(){
var mousePos=this.mousePosn_;
if(mousePos){
var mapPos=this.mapPosn_;
var mapDiv=this.map_.getDiv();
return mousePos.left>mapPos.left&&mousePos.left<mapPos.left+mapDiv.offsetWidth&&
mousePos.top>mapPos.top&&mousePos.top<mapPos.top+mapDiv.offsetHeight;}else{
return false;}};
DragZoom.prototype.setPaneVisibility_=function(){
if(this.map_&&this.hotKeyDown_&&this.isMouseOnMap_()){
var mapDiv=this.map_.getDiv();
this.paneDiv_.style.left=0+'px';
this.paneDiv_.style.top=0+'px';
this.paneDiv_.style.width=mapDiv.offsetWidth-(this.borderWidths_.left+this.borderWidths_.right)+'px';
this.paneDiv_.style.height=mapDiv.offsetHeight-(this.borderWidths_.top+this.borderWidths_.bottom)+'px';
this.paneDiv_.style.display='block';
this.boxMaxX_=parseInt(this.paneDiv_.style.width,10)-(this.boxBorderWidths_.left+this.boxBorderWidths_.right);
this.boxMaxY_=parseInt(this.paneDiv_.style.height,10)-(this.boxBorderWidths_.top+this.boxBorderWidths_.bottom);}else{
this.paneDiv_.style.display='none';}};
DragZoom.prototype.onKeyDown_=function(e){
var me=this;
if(this.map_&&!this.hotKeyDown_&&this.isHotKeyDown_(e)){
me.hotKeyDown_=true;
me.setPaneVisibility_();
google.maps.event.trigger(me,'activate');}};
DragZoom.prototype.getMousePoint_=function(e){
var mousePosn=getMousePosition(e);
var p=new google.maps.Point();
p.x=mousePosn.left-this.mapPosn_.left-this.borderWidths_.left;
p.y=mousePosn.top-this.mapPosn_.top-this.borderWidths_.top;
p.x=Math.min(p.x,this.boxMaxX_);
p.y=Math.min(p.y,this.boxMaxY_);
p.x=Math.max(p.x,0);
p.y=Math.max(p.y,0);
return p;};
DragZoom.prototype.onMouseDown_=function(e){
if(this.map_&&this.hotKeyDown_){
this.mapPosn_=getElementPosition(this.map_.getDiv());
this.dragging_=true;
this.startPt_=this.endPt_=this.getMousePoint_(e);
var prj=this.prjov_.getProjection();
var latlng=prj.fromDivPixelToLatLng(this.startPt_);
google.maps.event.trigger(this,'dragstart',latlng);}};
DragZoom.prototype.onMouseDownDocument_=function(e){
this.mouseDown_=true;};
DragZoom.prototype.onMouseMove_=function(e){
this.mousePosn_=getMousePosition(e);
if(this.dragging_){
this.endPt_=this.getMousePoint_(e);
var left=Math.min(this.startPt_.x,this.endPt_.x);
var top=Math.min(this.startPt_.y,this.endPt_.y);
var width=Math.abs(this.startPt_.x-this.endPt_.x);
var height=Math.abs(this.startPt_.y-this.endPt_.y);
this.boxDiv_.style.left=left+'px';
this.boxDiv_.style.top=top+'px';
this.boxDiv_.style.width=width+'px';
this.boxDiv_.style.height=height+'px';
this.boxDiv_.style.display='block';
google.maps.event.trigger(this,'drag',new google.maps.Point(left,top+height),new google.maps.Point(left+width,top));}else if(!this.mouseDown_){
this.setPaneVisibility_();}};
DragZoom.prototype.onMouseUp_=function(e){
this.mouseDown_=false;
if(this.dragging_){
var left=Math.min(this.startPt_.x,this.endPt_.x);
var top=Math.min(this.startPt_.y,this.endPt_.y);
var width=Math.abs(this.startPt_.x-this.endPt_.x);
var height=Math.abs(this.startPt_.y-this.endPt_.y);
var prj=this.prjov_.getProjection();
var containerPos=getElementPosition(this.map_.getDiv());
var mapPanePos=getElementPosition(this.prjov_.getPanes().mapPane);
left=left+(containerPos.left-mapPanePos.left);
top=top+(containerPos.top-mapPanePos.top);
var sw=prj.fromDivPixelToLatLng(new google.maps.Point(left,top+height));
var ne=prj.fromDivPixelToLatLng(new google.maps.Point(left+width,top));
var bnds=new google.maps.LatLngBounds(sw,ne);
this.map_.fitBounds(bnds);
this.dragging_=false;
this.boxDiv_.style.display='none';
google.maps.event.trigger(this,'dragend',bnds);}};
DragZoom.prototype.onKeyUp_=function(e){
if(this.map_&&this.hotKeyDown_){
this.hotKeyDown_=false;
this.dragging_=false;
this.boxDiv_.style.display='none';
this.paneDiv_.style.display="none";
google.maps.event.trigger(this,'deactivate');}};
google.maps.Map.prototype.enableKeyDragZoom=function(opt_zoomOpts){
this.dragZoom_=new DragZoom(this,opt_zoomOpts);};
google.maps.Map.prototype.disableKeyDragZoom=function(){
var d=this.dragZoom_;
if(d){
google.maps.event.removeListener(d.mouseDownListener_);
google.maps.event.removeListener(d.mouseDownListenerDocument_);
google.maps.event.removeListener(d.mouseMoveListener_);
google.maps.event.removeListener(d.mouseUpListener_);
google.maps.event.removeListener(d.keyUpListener_);
google.maps.event.removeListener(d.keyDownListener_);
this.getDiv().removeChild(d.boxDiv_);
this.getDiv().removeChild(d.paneDiv_);
this.dragZoom_=null;}};
google.maps.Map.prototype.keyDragZoomEnabled=function(){
return this.dragZoom_!==null;};
google.maps.Map.prototype.getDragZoomObject=function(){
return this.dragZoom_;};})();
Ext.reg('ggMapPanel',ggMapPanel);
if(typeof(changeLoadStr)=="function"){
changeLoadStr("load ggMapPanel.js ...");}
MapTrack.lang={
s_Index:"::MapTrack WebService System::",
s_RegisterUser:"Creat New Account",
s_ManagerCenter:"Manager Center",
s_UserManager:"User Manager",
s_ViewUserInfo:"View User Info",
s_ModifyUserInfo:"Modify User Info",
s_CarManager:"Object Manager",
s_VehicleList:"Object List",
s_HowToDispalyVehicle:"Please select checkbox to diplay",
s_CarDistributeToUser:"Distribute To SubUser",
s_CarDistributeToGroup:"Distribute To Group",
s_ChildUserManager:"SubUser Manager",
s_GroupManager:"Group Manager",
s_ReportCenter:"Report Center",
s_MileageReport:"Mileage Report",
s_AlarmReport:"Alarm Report",
s_RunReport:"Run Report",
s_SpeedReport:"Speed Report",
s_OnlineReport:"Online Report",
s_FenceList:"Rectangle Area List",
s_PFenceList:"Polygon Area List",
s_FenceSetup:"Fence Alarm Setup",
s_RadiusGeoFenceSetup:"Movement Alarm Setup",
s_AreaNo:"GEO-Fence No",
s_SetupType:"Setup Type",
s_Out:"Out",
s_In:"In",
s_FenceAlarm:"Fence Alarm",
s_SystemSetup:"System",
s_ChangeSkin:"Change Skin",
s_Default:"Default",
s_Metal:"Metal",
s_Vista:"Vista",
s_DarkGray:"DarkGray",
s_Green:"Green",
s_CommonCmd:"Common Command",
s_AdvancedCmd:"Advanced Command",
s_Setting:"Setting",
s_Power:"Power",
s_DEType_SimpleA:"Simple-A",
s_DEType_SimpleB:"Simple-B",
s_DEType_SimpleC:"Simple-C",
s_DEType_SimpleD:"Simple-D",
s_DEType_StandardA:"Standard-A",
s_DEType_StandardB:"Standard-B",
s_DEType_Enhance:"Enhanced",
s_DEType_Advance:"Advance",
s_DEType_UnknowDEType:"Unknow",
s_Privilege_LimitUser:"Limited User",
s_Privilege_NormalUser:"Normal User",
s_Privilege_SuperUser:"Super User",
s_Privilege_UnknownUser:"Unknow User",
s_StopAlarm:"Stop Alarm",
s_Alarm:"Alarm",
s_AlarmSetup:"Alarm Setup",
s_AlarmType:"Alarm type",
s_Urgency:"Emergency",
s_PowerOff:"Power Off",
s_InArea:"In Area",
s_OutArea:"Out Area",
s_Custom1:"Custom1",
s_Custom2:"Custom2",
s_Custom3:"Custom3",
s_Custom4:"Custom4",
s_LowPower:"Low Power",
s_IllAccOn:"Ill-AccOn",
s_IllDoorOpen:"Ill-DoorOpen",
s_OverSpeed:"OverSpeed",
s_Parking:"Parking",
s_TiredDrive:"Tired Drive",
s_Tow:"Tow",
s_Send:"Send",
s_Setup:"Setup",
s_CMD:"Command",
s_TrackOnce:"Track Position",
s_LastPosition:"Last Position",
s_TrackHistory:"Track History",
s_DisableOil:"Fuel Off",
s_EnableOil:"Fuel On",
s_CtrlOil:"Fuel Control",
s_CloseDoor:"Lock Door",
s_OpenDoor:"UnLock Door",
s_CtrlDoor:"Remote Center-Lock",
s_TEReFactory:"Device Restore Factory Setting",
s_TERestart:"Device Reset",
s_CarListen:"Car Listen",
s_CarTalk:"Car Talk",
s_CallBackMode:"Transmission Mode",
s_DeviceServer:"Server IP port",
s_AlarmEnable:"Alarm Enable",
s_OverSpeedAlarm:"OverSpeed Alarm",
s_ParkingAlarm:"Parking Alarm",
s_IllOpenAlarm:"Ill-DoorOpen Alarm",
s_TiredDriveAlarm:"Tired DriveAlarm",
s_HWName:"Hardware",
s_HWState:"Hardware Status",
s_GSMAntenna:"GSM",
s_GPSAntenna:"GPS",
s_ViewHWState:"View Hardware Status",
s_ViewHWSetup:"View Hardware Setup",
s_ON:"ON",
s_OFF:"OFF",
s_Normal:"Normal",
s_Abnormal:"Abnormal",
s_Enable:"Enable",
s_Disable:"Disable",
s_HighLevel:"High Level",
s_LowLevel:"Low Level",
s_OverLoad:"OverLoad",
s_Empty:"Empty",
s_Busy:"Busy",
s_Free:"Free",
s_sep:"-",
s_Ok:"OK",
s_Cancel:"Cancel",
s_Exit:"Exit",
s_Back:"Back",
s_Close:"Close",
s_Register:"Register",
s_User:"User",
s_Password:"Password",
s_ReinputPassWord:"Re-Password",
s_Name:"Name",
s_FName:"First Name",
s_LName:"Last Name",
s_CompanyName:"Company",
s_StartTime:"From",
s_EndTime:"To",
s_License:"Object Name",
s_Sim:"Device SIM",
s_DEType:"Device Type",
s_DEUID:"Device UID",
s_Tel:"Tel No",
s_Address:"Address",
s_Emaill:"Email",
s_Remark:"Remark",
s_Key:"key",
s_Time:"Time",
s_Time_min:"Time(min)",
s_Time_sec:"Time(sec)",
s_ClickForAddr:"double click for address",
s_Status:"Status",
s_Direction:"Direction",
s_Lon:"Longitude",
s_Lat:"Latitude",
s_DriveTime:"Driving Time(min)",
s_Privilege:"Privilege",
s_Group:"Group",
s_All:"All",
s_Search:"Search",
s_IpAddress:"IP Addr.",
s_Port:"Port",
s_Pan:"Pan",
s_Zoomin:"ZoomIn",
s_Zoomout:"ZommOut",
s_Zoomall:"ZoomAll",
s_Measure:"Measure",
s_AddFence:"Add Fence",
s_AddPoint:"Add POI",
s_Print:"Print",
s_Count:"Total",
s_Check:"Check",
s_Agree:"Agree",
s_Deny:"Deny",
s_Submit:"Submit",
s_Tip:"Warning",
s_Add:"Add",
s_Modify:"Modify",
s_View:"View",
s_Del:"Delete",
s_DelAll:"Delete All",
s_SpeedKMH:"Speed(km/h)",
s_MileageKM:"Mileage(km)",
s_UsedOilLH:"consumption(L)",
s_UsedOilLHKM:"consumption(L/100Km)",
s_HasPosition:"Located",
s_NoPosition:"Unlocated",
s_ByTime:"By Time(s)",
s_ByDistance:"By Distance(m)",
s_ByNone:"Disable",
s_ByCondition:"By Condition",
s_OutputExcel:"Export Excel file",
s_OutputPDF:"Export PDF File",
s_FeedbackInfo:"Lastest Information",
s_AlarmInfo:"Alarm Information",
s_LogInfo:"Log Information",
s_HWACC:"ACC",
s_HWDoor:"Door",
s_HWMainPower:"Main Power",
s_HWBackBattery:"Backup Battery",
s_HWOilway:"Fuel line",
s_HWSOS:"SOS",
s_HWAntiSteal:"Anti-Steal",
s_HWMotor:"Motor",
s_HWCustom1:"Custom1",
s_HWCustom2:"Custom2",
s_HWCustom3:"Custom3",
s_HWCustom4:"Custom4",
s_HWLoad:"OverLoad/Empty",
s_HWWork:"Taxi Work",
s_HWADPanel:"AD Panel",
s_HWHandSet:"HandSet",
s_RealTimeTrack:"RealTime Track",
s_None:"none",
s_Refresh:"Refresh",
s_LoginTime:"Login",
s_LastRefresh:"LastRefresh",
s_Alert_Confirm:"Are you sure?",
s_Alert_Success:"Succeed!",
s_Alert_Failed:"Failed!",
s_Alert_NoBackResults:"No Result!",
s_Alert_PasswordError:"Password Error!",
s_Alert_NoSelectCar:"Please Select Vehicle First!",
s_Alert_ServerError:"Server Error",
s_Alert_LoginError:"Login failed! Please Check your Username and password!",
s_Alert_DateExceed:"Date range  can't exceed 15 days",
s_WaitDistributeCar:"Wait Distribute list",
s_PleaseTypeAddress:"Type Address Here",
s_PleaseTypeTel:"Type TelNo. Here",
s_RightTips:"Press Mouse Right key for more function.",
s_HasUserName:"Sorry, this account name has been register.",
s_NoUserName:"Congratulations, You can register this name.",
s_NoPrivilegeSet:"Sorry, No Privilege",
s_ServerBusy:"Server busy now, please try again after some time!",
s_ValidDate:"Valid Date To",
s_MoreFunctionPlsUseRightKey:"For more function please press right key",
s_Sum:"Sum",
s_GraphicReport:"Graphic Report",
s_VehicleSum:"Sum",
s_GPRSOnlineVehicle:"GPRS online",
s_GPRSOfflineVehicle:"GPRS offline",
s_NormalVehicle:"Normal",
s_AlarmVehicle:"Alarm",
s_AlarmAreaToolHelp:"First Point is TopLeft of Area, Second Point is BottomRight of Area",
s_AlarmPlsClickSecond:"Next Click is BottomRight of Area",
s_LeftBottomLngLat:"LeftBottom Lng,Lat",
s_RightTopLngLat:"RightTop Lng,Lat",
s_LngLat:"Lng,Lat",
s_NotSupportFunction:"This Device Can't support this function!",
s_IOPortNo:"IO Port",
s_ControlDeviceIOPort:"Control Device's Output Port",
s_Center:"Center",
s_Radius:"radius",
s_CurrentPos:"Current Position",
s_PleaseSelect:"Please select first!",
s_MapWindow:"Map Window",
s_VirtualEarth:"VirtualEarth",
s_ChinaMap:"China Map",
s_MapInfo:"MapInfo Map",
s_MapTool:"Map Tools",
s_POIList:"POI List",
s_CaptureImage:"Capture Image",
s_CameraNo:"Camera No",
s_Captureing:"Captureing...",
s_SendToHandSetText:"Send Text To Handset",
s_SendToADPanelText:"Send Text To ADPanel",
s_SendToSpeakerText:"Send Text To SoundPanel",
s_SetupCaptureCondition:"Setup Capture Condition",
s_ImageDataUpload:"Image Data uploading...",
s_StartupTime:'Startup Time',
s_ArriveTime:'Arrive Time',
s_StartupAddr:'Startup Addr',
s_ArriveAddr:'Arrive Addr',
s_StartAddr:'Start Addr',
s_EndAddr:'End Addr',
s_LeaveTime:'Leave Time',
s_Duration:'Duration',
s_RunMileage:'Sum Mileage',
s_MaxSpeed:'Max Speed',
s_ParkTime:'Parking time',
s_Day:'Day',
s_Hour:'Hour',
s_Minute:'Min',
s_Second:'Sec',
s_Graphic:'Graphic',
s_ShowOnMap:'Show On Map',
s_HideOnMap:'Hide On Map',
s_PhotoInfo:'Photo Info',
s_TipCheckVehicle:'No GPS data! Please note if checked checkbox',
s_PlaySpeed:'Speed',
s_Fast:'Fast',
s_Slow:'Slow',
s_Play:'Play',
s_Pause:'Pause',
s_Stop:'Stop',
s_Today:'Today',
s_Last3Day:'Last 3 days',
s_Last7Day:'Last Week',
s_Last15Day:'Last 15 days',
s_Dashboard:'Dashboard',
s_SendSMS:'Send Text To HandSet',
s_SendVoice:'Send Voice',
s_SendADText:'Send Text To ADPanel',
s_Context:'Context',
s_TemperatureReport:'Temperature Report',
s_PhotoReport:'Photo Report',
s_GasReport:'Gas Report',
s_POIReport:'POI Run Report',
s_POI:'POI',
s_FenceReport:'Rectangle Area Run Report',
s_Fence:'Rectangle Area',
s_PolygonReport:'Polygon Area Run Report',
s_Polygon:'Polygon Area',
s_Gas:'Gas',
s_MousePos:'Mouse Pos',
s_MapCenter:'Map Center',
s_Type:'Type',
s_Home:'Home',
s_Office:'Office',
s_Restaurant:'Restaurant',
s_Entertainment:'Entertainment',
s_Services:'Services',
s_Finance:'Finance ',
s_Other:'Other',
s_ShowAll:'Show All',
s_HideAll:'Hide All',
s_Navigation:'Navigation',
s_Bound:'bound(meter)',
s_Alert_SelectExceed:'You can and only can slect 1~3 items',
s_EnterInto:'Enter Into',
s_Leave:'Leave',
s_Continue:'Continue',
s_GasResistanceManager:'Gas Resistance Manager',
s_Resistance:'Resistance',
s_LowOil:'Lower Oil',
s_ACCAbnormity:'Acc Abnormity',
s_NoGPS:'No GPS',
s_HighTemperatureAlarm:"High Temperature Alarm",
s_HighTemperature:"High Temperature",
s_Temperature:"Temperature(�?",
s_AutoExit:'Auto Exit System',
s_LEDPanelManager:'LED Panel Manger',
s_SendTextInfo:'Display Text Infomation',
s_DisplayTime:'Display Date and Time',
s_VerifyTime:'Verify Time',
s_PowerControl:'Power Control',
s_Show:'Show',
s_Year:'Year',
s_MonthDay:'Month,Day',
s_HourMinute:'Hour,Minute',
s_Week:'Week',
s_LegalTips:"Your operation maybe cause as following:<br>"+
"1.To cut off gas remotely and stop the running vehicle which maybe be dangerous to driver  and others <br>"+
"2.To resotre default setting will clear all customer setting.<br>"+
"3.Setup Server worng maybe make device work not well.<br>"+
"4.Other situations<br><br>"+
"Warning! If you are not clear about this system, please be careful to operate it. .<br>"+
"Our agents and us decline all responsibility  from any  demage and lost caused by above  situations",
s_driection:["↑North",
"↗North East",
"→East",
"↘South East",
"↓South",
"↙Southe West",
"←West",
"↖North West"],
s_NoData:"No Data"};
var		historyobj=new Array();
var		historyobj1=new Array();
var		config=new Object();
var		getRandomID=(function(){var a=0;function b(){return'_ID_MT_'+(a++);}return b;})();
function getObjectFromStr(str){
return Ext.util.JSON.decode(str);}
function mapConfig(lng,lat,zoom){
config.lng=lng;
config.lat=lat;
config.zoom=zoom;}
function mapPoint(lng,lat){
this.lng=lng;
this.lat=lat;};
function mapOnSize(){
document.getElementById("div_map").style.width=getBodyWidth();
document.getElementById("div_map").style.height=getBodyHeight();
document.getElementById("div_map").style.left=0;
document.getElementById("div_map").style.right=0;
document.getElementById("div_map").style.top=0;
document.getElementById("div_map").style.bottom=0;}
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
function GetX1Point(x,Direction,nLen){
var result;
if((Direction+30)>=360){
Direction=(Direction+30)-360;}
else{
Direction+=30;}
result=x+Math.cos(Direction*Math.PI/180)*nLen;
return result;}
function GetY1Point(y,Direction,nLen){
var result;
if((Direction+30)>=360){
Direction=(Direction+30)-360;}
else{
Direction+=30;}
result=y+Math.sin(Direction*Math.PI/180)*nLen;
return result;}
function GetX2Point(x,Direction,nLen){
var result=0.0;
result=x+(nLen/(2* Math.sin(60* Math.PI/ 180.0)))*Math.cos(Direction*Math.PI/180.0);
return result;}
function GetY2Point(y,Direction,nLen){
var result=0.0;
result=y+(nLen/(2* Math.sin(60* Math.PI/ 180.0)))*Math.sin(Direction*Math.PI/180.0);
return result;}
function GetX3Point(x,Direction,nLen){
var result;
if((Direction-30)<0){
Direction=360+(Direction-30);}
else{
Direction-=30;}
result=x+Math.cos(Direction*Math.PI/180)*nLen;
return result;}
function GetY3Point(y,Direction,nLen){
var result;
if((Direction-30)<0){
Direction=360+(Direction-30);}
else{
Direction-=30;}
result=y+Math.sin(Direction*Math.PI/180)*nLen;
return result;}
function getRotateImgHtml(cfg){
var config={
URL:'',
angle:0,
round:false};
Ext.apply(config,cfg);
var strHtml;
var angle=config.angle;
if(!angle||typeof(angle)!='number'){
angle=0;}
if(angle>=0){
var rotation=Math.PI*angle/180;}else{
var rotation=Math.PI*(360+angle)/180;}
var costheta=Math.cos(rotation);
var sintheta=Math.sin(rotation);
strHtml='<div>'+'<img style="filter:progid:'+'DXImageTransform.Microsoft.Matrix('+'M11='+costheta+','+'M12='+(-sintheta)+','+'M21='+sintheta+','+'M22='+costheta+','+'SizingMethod=\'auto expand\');" '+'src="'+config.URL+'" '+'/>'+'</div>';
return strHtml;}
var	IconInfo=[{id:0,mini:'0_mini.gif',run:'0_run.gif',stop:'0_stop.gif',alarm:'0_alarm.gif',offline:'0_lost.gif'}];
function	getIconByType(type){
if(type>=IconInfo.length){
type=IconInfo.length-1;}
return IconInfo[type];}
function mapGetIconUrl(obj){
var text='';
var textIcon='';
var icon=getIconByType(0);
if(obj.alState>0){
icon=icon.alarm;}
else if(obj.speed>10){
icon=icon.run;}
else{
icon=icon.stop;}
text+='image/car2/'+icon;
return text;}
function mapGetBlinkIconUrl(obj){
var text='';
var icon='';
if(obj.alState>0){
icon='icon_red.gif';}
else if(MapTrack.IsOnline(obj.time)==false){
icon='icon_black.gif';}
else if(obj.speed>10){
icon='icon_blue.gif';}
else{
icon='icon_black.gif';}
text+='image/car/'+icon;
return text;}
function mapGetColor(obj){
var		color="";
if(obj.alState>0){
color="#ff0000";}
else if(obj.speed>10){
color="#0000ff";}
else{
color="#000000";}
return color;}
function mapGetStartUrl(obj){
return "image/car/airports.png";}
function mapGetEndUrl(obj){
return "image/car/marina.png";}
function mapGetParkUrl(obj){
return "image/car/flag.png";}
function mapGetPOIIconUrl(type){
var	POIIcon=[{type:0,icon:'image/home.png'},{type:1,icon:'image/office.png'},{type:2,icon:'image/Restaurant.png'},{type:3,icon:'image/Entertainment.png'},{type:4,icon:'image/pushpin.png'},{type:5,icon:'image/Services.png'},{type:255,icon:'image/pushpin.png'}]
for(var i=0;i<POIIcon.length;i++){
if(POIIcon[i].type==type){
return POIIcon[i].icon;}}
return POIIcon[i-1].icon;}
function mapZoomIn(){
MapTrack.g_Map.zoomIn();}
function mapZoomOut(){
MapTrack.g_Map.zoomOut();}
function mapZoomAll(){
MapTrack.g_Map.zoomAll();}
function mapMeasure(){
MapTrack.g_Map.measure();}
function mapAddMarker(obj2){
var obj=getObjectFromStr(obj2);
if(MapTrack.g_Map!=null){
MapTrack.g_Map.addMarker(obj);}}
function mapDeleteMarker(deuid){
if(MapTrack.g_Map!=null){
MapTrack.g_Map.deleteMarker(deuid);}}
function mapAddPoint(obj2){
if(MapTrack.g_Map!=null){
MapTrack.g_Map.addPoint();}}
function mapAddLine(obj2){
var obj=getObjectFromStr(obj2);
if(MapTrack.g_Map!=null){
MapTrack.g_Map.addLine(obj);}}
function mapAddPolygon(obj2){
var obj=getObjectFromStr(obj2);
if(MapTrack.g_Map!=null){
MapTrack.g_Map.addPolygon(obj);}}
function mapAddPolygon2(obj2){
var obj=getObjectFromStr(obj2);
if(MapTrack.g_Map!=null){
MapTrack.g_Map.addPolygon2(obj);}
return{lng:obj.points[0].lng,lat:obj.points[0].lat};}
function mapAddTriAngle(obj2){
var obj=getObjectFromStr(obj2);
if(MapTrack.g_Map!=null){
MapTrack.g_Map.addTriAngle(obj);}}
function mapCenter(lng,lat){
if(MapTrack.g_Map!=null){
MapTrack.g_Map.center(lng,lat);}}
function mapGetAddress(obj,func){}
function mapBestView(points){}
function mapIsContainPoint(obj){
return MapTrack.centerpanel.getActiveTab().IsContainPoint(obj);}
function saveMapCenterZoom(map,obj){
if(map==0){}
if(map==1){}
if(map==2){}}
function mapSetCenterZoom(lng,lat,zoom){
if(MapTrack.g_Map!=null){
MapTrack.g_Map.centerAndZoom(lng,lat,zoom);}}
function mapGetCenterZoom(){
if(MapTrack.g_Map!=null){
var centerlatlng=MapTrack.g_Map.getCenterLatLng();
return centerlatlng.lng+','+centerlatlng.lat+','+centerlatlng.zoom;}
return "";}
function mapDisplayGPSObj(obj2){
var obj=getObjectFromStr(obj2);
obj.lat=parseFloat(obj.lat);
obj.lng=parseFloat(obj.lng);
obj.rotate=obj.direction;
obj.color=mapGetColor(obj);
obj.icon=mapGetIconUrl(obj);
if(MapTrack.g_Map!=null){
MapTrack.g_Map.addMarker(obj);}}
function mapDisplayPOIObj(obj2){
var obj=getObjectFromStr(obj2);
obj.lat=parseFloat(obj.lat);
obj.lng=parseFloat(obj.lng);
if(typeof(obj.uiid)=="undefined"){
obj.uiid=obj.name;}
if(obj.autoHide){
obj.uiid+='_temp';}
obj.icon=mapGetPOIIconUrl(obj.type);
obj.description=obj.remark;
if(MapTrack.g_Map!=null){
MapTrack.g_Map.addMarker(obj);}
if(obj.autoHide){
mapCenter(obj.lng,obj.lat);
setTimeout(function(){mapDeleteMarker(obj.uiid)},5000);}}
function mapDisplayFenceObj(obj2){
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
if(typeof(obj.uiid)=="undefined"){
obj.uiid=obj.name;}
if(obj.autoHide){
obj.uiid+='_temp';}
obj.lat=obj.lat1+(obj.lat2-obj.lat1)/2;
obj.lng=obj.lng1+(obj.lng2-obj.lng1)/2;
obj.color="#0000ff";
obj.points=points;
obj.description=obj.remark;
if(MapTrack.g_Map!=null){
MapTrack.g_Map.addPolygon(obj);}
if(obj.autoHide){
mapCenter(obj.lng,obj.lat);
setTimeout(function(){mapDeleteMarker(obj.uiid)},5000);}}
function mapDisplayPFenceObj(obj2){
var obj=getObjectFromStr(obj2);
if(typeof(obj.uiid)=="undefined"){
obj.uiid=obj.name;}
if(obj.autoHide){
obj.uiid+='_temp';}
obj.color="#0000ff";
obj.description=obj.remark;
if(MapTrack.g_Map!=null){
MapTrack.g_Map.addPolygon2(obj);}
if(obj.autoHide){
mapCenter(obj.lng,obj.lat);
setTimeout(function(){mapDeleteMarker(obj.uiid)},5000);}}
function history_play(obj2){
var obj=getObjectFromStr(obj2);
obj.lat=parseFloat(obj.lat);
obj.lng=parseFloat(obj.lng);
obj.rotate=obj.direction;
obj.color=mapGetColor(obj);
if(MapTrack.g_Map!=null){
MapTrack.g_Map.addTriAngle(obj);
if(MapTrack.g_Map.IsContainPoint(obj)==false){
MapTrack.g_Map.center(obj.lng,obj.lat);}
var		points=new Array();
var		len=historyobj.length;
if(len>0){
points.push(historyobj[len-1]);
points.push(obj);
MapTrack.g_Map.addLine({uiid:'line'+len,points:points});
historyobj1.push('line'+len);}
historyobj.push(obj);}}
function history_stop(){
var		lineobj;
if(MapTrack.g_Map!=null){
if(historyobj.length>0){
MapTrack.g_Map.deleteMarker(historyobj[0].uiid);}
while(1){
lineobj=historyobj1.pop();
if(lineobj==undefined){
break;}
else{
MapTrack.g_Map.deleteMarker(lineobj);}}}
historyobj.slice(0);}
MapTrack.g_oPOI={empty:true};
MapTrack.g_oFence={empty:true};
MapTrack.g_oPFence={empty:true};
function mapAddPOI(){
MapTrack.g_oPOI.empty=true;
if(MapTrack.g_Map!=null){
MapTrack.g_Map.addPoint();}}
function mapAddFence(){
MapTrack.g_oFence.empty=true;
if(MapTrack.g_Map!=null){
MapTrack.g_Map.addFence();}}
function mapAddPFence(){
MapTrack.g_oPFence.empty=true;
if(MapTrack.g_Map!=null){
MapTrack.g_Map.addPFence();}}
function mapGetPOI(){
if(MapTrack.g_oPOI.empty==true){
return "";}
else{
MapTrack.g_oPOI.empty=true;
return MapTrack.g_oPOI.lng+','+MapTrack.g_oPOI.lat;}}
function mapGetFence(){
if(MapTrack.g_oFence.empty==true){
return "";}
else{
MapTrack.g_oFence.empty=true;
return MapTrack.g_oFence.lng1+','+MapTrack.g_oFence.lat1+','+MapTrack.g_oFence.lng2+','+MapTrack.g_oFence.lat2;}}
function mapGetPFence(){
if(MapTrack.g_oPFence.empty==true){
return "";}
else{
MapTrack.g_oPFence.empty=true;
var lnglatstr='';
for(i=0;i<MapTrack.g_oPFence.arrPoint.length;i++){
if(lnglatstr.length>0){
lnglatstr+='__';}
lnglatstr+=MapTrack.g_oPFence.arrPoint[i].lng+','+MapTrack.g_oPFence.arrPoint[i].lat;}
return lnglatstr;}}
function SaveAreaDlg(obj){
MapTrack.g_oFence.empty=false;
MapTrack.g_oFence.lat1=obj.lat1;
MapTrack.g_oFence.lng1=obj.lng1;
MapTrack.g_oFence.lat2=obj.lat2;
MapTrack.g_oFence.lng2=obj.lng2;
obj.NoFunc();}
function SavePOIDlg(obj){
MapTrack.g_oPOI.empty=false;
MapTrack.g_oPOI.lat=obj.lat;
MapTrack.g_oPOI.lng=obj.lng;
obj.NoFunc();}
function SavePAreaDlg(obj){
MapTrack.g_oPFence.arrPoint=[];
for(var i=0;i<obj.arrPoint.length;i++){
MapTrack.g_oPFence.arrPoint.push(obj.arrPoint[i]);}
MapTrack.g_oPFence.empty=false;
obj.NoFunc();}
if(typeof(changeLoadStr)=="function"){
changeLoadStr("load map.js ...");}

