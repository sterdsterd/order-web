var config = {
    apiKey: "AIzaSyAtFYM963b-Xj3mnJtfe4e-d4_l0vQ1QwI",
    authDomain: "order-5de62.firebaseapp.com",
    databaseURL: "https://order-5de62.firebaseio.com",
    projectId: "order-5de62",
    storageBucket: "order-5de62.appspot.com",
    messagingSenderId: "436632360400"
};

var last = 0;

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function getPrice() {
    var price = 0;
    for (var i = 1; i <= last; i++) {
        if (document.getElementById("item" + i))
            price += Number(document.getElementById("item" + i).value) * Number(document.getElementById("price" + i).textContent.replace(/[^0-9]/g, ""));
    }
    document.all("price").innerHTML = "￦" + numFormat(price);
}

function numFormat(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

window.onload = function() {
    document.all("title").innerHTML = "TABLE No " + getParameterByName('tableNo');
    firebase.initializeApp(config);
    show();

    showNotification();
};

function showNotification() {
    /* navigator.serviceWorker.register('sw.js')

    Notification.requestPermission(function(result) {
        if (result === 'granted') {
            navigator.serviceWorker.ready.then(function(registration) {
                registration.showNotification('Vibration Sample', {
                    body: 'Buzz! Buzz!',
                    vibrate: [200, 100, 200, 100, 200, 100, 200],
                    tag: 'vibration-sample'
                });
            });
        }
    }); */

    Notification.requestPermission();

    var notification = new Notification('Notification title', {
        icon: 'http://cdn.sstatic.net/stackexchange/img/logos/so/so-icon.png',
        body: 'Notification text',
    });

    notification.onclick = function () {
        window.open('http://google.com');
    };


}

function order() {
    var tableNo = getParameterByName('tableNo');
    var url = "/order/result/?tableNo=" + tableNo;
    if (tableNo.length === 0) {
        alert("테이블 번호가 누락되었습니다.");
        return;
    }
    var c = false;
    for (var i = 1; i <= last; i++) {
        if (document.getElementById("item" + i))
            if (document.getElementById("item" + i).value !== 0) {
                c = true;
                url += "&qt" + i + "=" + document.getElementById("item" + i).value;
            }
    }
    if (c) window.location.replace(url);
    else alert("메뉴를 선택하세요");
};

function show() {
    var urlRef = firebase.database().ref().child("menuList");

    urlRef.on("value", function(snapshot) {
        document.getElementById("main").innerHTML = "";
        snapshot.forEach(function(childSnapshot) {
            var data = childSnapshot.val();

            last = data.id;

            var div = document.createElement("div");
            var img = document.createElement('img');
            img.style.margin = "1em";
            img.style.height = "5em";


            var storageRef = firebase.storage().ref().child("img").child(last + ".png");
            storageRef.getDownloadURL().then(function(url) {
                img.src = url;
            });
            img.id = "img" + last;

            var info = document.createElement("div");

            var t = document.createElement("t");
            t.style.margin = "auto 0";

            var name = document.createElement("h3");
            name.innerText = data.name;
            name.id = "menu" + last;
            var price = document.createElement("p");
            price.innerText = "￦" + numFormat(data.price);
            price.id = "price" + last;

            var stpouter = document.createElement("div");
            stpouter.className = "quantity";

            var stp = document.createElement("input");
            stp.type = "number";
            stp.id = "item" + last;
            stp.onchange = getPrice;
            stp.min = "0";
            stp.max = "9";
            stp.step = "0";
            stp.value = "0";

            t.appendChild(name);
            t.appendChild(price);
            info.appendChild(t);
            stpouter.appendChild(stp);
            info.appendChild(stpouter);
            div.appendChild(img);
            div.appendChild(info);
            document.getElementById('main').appendChild(div);
        });
        stepper();
    });
}

function stepper() {
    jQuery('<div class="quantity-nav"><div class="quantity-button quantity-up">+</div><div class="quantity-button quantity-down">-</div></div>').insertAfter('.quantity input');
    jQuery('.quantity').each(function() {
        var spinner = jQuery(this),
            input = spinner.find('input[type="number"]'),
            btnUp = spinner.find('.quantity-up'),
            btnDown = spinner.find('.quantity-down'),
            min = input.attr('min'),
            max = input.attr('max');

        btnUp.click(function() {
            var oldValue = parseFloat(input.val());
            if (oldValue >= max) {
                var newVal = oldValue;
            } else {
                var newVal = oldValue + 1;
            }
            spinner.find("input").val(newVal);
            spinner.find("input").trigger("change");
        });

        btnDown.click(function() {
            var oldValue = parseFloat(input.val());
            if (oldValue <= min) {
                var newVal = oldValue;
            } else {
                var newVal = oldValue - 1;
            }
            spinner.find("input").val(newVal);
            spinner.find("input").trigger("change");
        });

    });
}