const ajaxHandlerScript="https://fe.it-academy.by/AjaxStringStorage2.php";
 let messages; 
 let updatePassword;
const stringName='SOTNICHENKO_TETRIS_SCORE';
function showMessages() {
    let str='';
    for ( let m=0; m<messages.length; m++ ) {
        const message=messages[m];
        str+="<b>"+escapeHTML(message.name)+":</b> "
            +escapeHTML(message.mess)+"<br />";
    }
    document.getElementById('IChat').innerHTML=str;
}

function escapeHTML(text) {
    if ( !text )
        return text;
    text=text.toString()
        .split("&").join("&amp;")
        .split("<").join("&lt;")
        .split(">").join("&gt;")
        .split('"').join("&quot;")
        .split("'").join("&#039;");
    return text;
}

// получает сообщения с сервера и потом показывает
function refreshMessages() {
    $.ajax( {
            url : ajaxHandlerScript,
            type : 'POST', dataType:'json',
            data : { f : 'READ', n : stringName },
            cache : false,
            success : readReady,
            error : errorHandler
        }
    );
}

// сообщения получены - показываем
function readReady(callresult) {
    if ( callresult.error!=undefined )
        alert(callresult.error);
    else {
        messages=[];
        if ( callresult.result!="" ) { // строка пустая - сообщений нет
            // либо в строке - JSON-представление массива сообщений
            messages=JSON.parse(callresult.result);
            // вдруг кто-то сохранил мусор?
            if ( !Array.isArray(messages) )
                messages=[];
        }
        showMessages();
    }
}

// получает сообщения с сервера, добавляет новое,
// показывает и сохраняет на сервере
function sendMessage() {
    updatePassword=Math.random();
    $.ajax( {
            url : ajaxHandlerScript,
            type : 'POST', dataType:'json',
            data : { f : 'LOCKGET', n : stringName,
                p : updatePassword },
            cache : false,
            success : lockGetReady,
            error : errorHandler
        }
    );
}

// сообщения получены, добавляет, показывает, сохраняет
function lockGetReady(callresult) {
    if ( callresult.error!=undefined )
        alert(callresult.error);
    else {
        messages=[];
        if ( callresult.result!="" ) { // строка пустая - сообщений нет
            // либо в строке - JSON-представление массива сообщений
            messages=JSON.parse(callresult.result);
            // вдруг кто-то сохранил мусор?
            if ( !Array.isArray(messages) )
                messages=[];
        }

        const senderName=document.getElementById('IName').value;
        const message=document.getElementById('IMess').value;
        messages.push( { name:senderName, mess:message } );
        if ( messages.length>10 )
            messages=messages.slice(messages.length-10);

        showMessages();

        $.ajax( {
                url : ajaxHandlerScript,
                type : 'POST', dataType:'json',
                data : { f : 'UPDATE', n : stringName,
                    v : JSON.stringify(messages), p : updatePassword },
                cache : false,
                success : updateReady,
                error : errorHandler
            }
        );
    }
}

// сообщения вместе с новым сохранены на сервере
function updateReady(callresult) {
    if ( callresult.error!=undefined )
        alert(callresult.error);
}

function errorHandler(jqXHR,statusStr,errorStr) {
    alert(statusStr+' '+errorStr);
}

refreshMessages();


