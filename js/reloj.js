function reloj(){
if (!document.layers&&!document.all&&!document.getElementById)
return

     var Digital=new Date()
     var hours=Digital.getHours()
     var minutes=Digital.getMinutes()
     var seconds=Digital.getSeconds()

    var dn="PM"
    if (hours<12)
    dn="AM"
    if (hours>12)
    hours=hours-12
    if (hours==0)
    hours=12

     if (minutes<=9)
     minutes="0"+minutes
     if (seconds<=9)
     seconds="0"+seconds
    //change font size here to your desire
    myclock="<b><font size='3' face='Roboto' style='text-align: center; display: block; margin: 0 30%; padding-bottom: 10px;'>"+hours+":"+minutes+":"
     +seconds+" "+dn+"</b></font>"
    if (document.layers){
    document.layers.liveclock.document.write(myclock)
    document.layers.liveclock.document.close()
    }
    else if (document.all)
    liveclock.innerHTML=myclock
    else if (document.getElementById)
    document.getElementById("liveclock").innerHTML=myclock
    setTimeout("reloj()",1000)
 }