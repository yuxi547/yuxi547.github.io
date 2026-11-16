// The original interactive episode player remains hosted with its video assets.
window.addEventListener('message',event=>{
 if(event.origin!=='https://maoningge.github.io')return;
 const frame=document.querySelector('.rsi-article iframe.replay');
 const height=Number(event.data?.height);
 if(frame&&event.source===frame.contentWindow&&Number.isFinite(height)&&height>=300&&height<=10000)frame.style.height=height+'px';
});
