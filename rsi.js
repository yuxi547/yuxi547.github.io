// Keep original episode data and media; maintain the responsive player locally.
const replayFrame=document.querySelector('.rsi-article iframe.replay');
if(replayFrame){
 const original=new URL(replayFrame.src,location.href);
 replayFrame.src='/replay/index.html'+original.search+original.hash;
}
// The original interactive episode player remains hosted with its video assets.
window.addEventListener('message',event=>{
 if(event.origin!==location.origin)return;
 const frame=document.querySelector('.rsi-article iframe.replay');
 const height=Number(event.data?.height);
 if(frame&&event.source===frame.contentWindow&&Number.isFinite(height)&&height>=300&&height<=10000)frame.style.height=height+'px';
});
