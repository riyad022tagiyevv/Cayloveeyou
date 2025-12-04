// ============================
// 1) Sifariş Göndər
// ============================
function sendOrder() {
    const masa = document.getElementById("masa").value.trim();
    const mehsul = document.getElementById("mehsul").value.trim();
    const qeyd = document.getElementById("qeyd").value.trim() || "-";

    if (!masa || !mehsul) {
        alert("Masa və məhsul boş ola bilməz!");
        return;
    }

    const order = {
        id: Date.now(),
        masa,
        mehsul,
        qeyd,
        time: new Date().toLocaleTimeString(),
        status: "new"
    };

    let all = JSON.parse(localStorage.getItem("orders")) || [];
    all.push(order);
    localStorage.setItem("orders", JSON.stringify(all));

    document.getElementById("sound").play();
    alert("Göndərildi ✔");
}



// ============================
// 2) Mətbəx — sifarişləri göstər
// ============================
function loadKitchen() {
    const list = document.getElementById("kitchenList");
    let all = JSON.parse(localStorage.getItem("orders")) || [];

    list.innerHTML = "";

    all.forEach(o => {
        if (o.status === "new") {
            const li = document.createElement("li");
            li.innerHTML = `${o.masa} | ${o.mehsul} | ${o.qeyd} | ${o.time} `;

            const btn = document.createElement("button");
            btn.textContent = "Qəbul Et";
            btn.onclick = () => acceptOrder(o.id);

            li.appendChild(btn);
            list.appendChild(li);
        }
    });
}



// ============================
// 3) Mətbəx — yeni sifariş göndərilən kimi ding
// ============================
function listenNewOrders() {
    let lastCount = 0;

    setInterval(() => {
        const all = JSON.parse(localStorage.getItem("orders")) || [];
        const newCount = all.filter(o => o.status === "new").length;

        if (newCount > lastCount) {
            document.getElementById("kitchenSound").play();
        }

        lastCount = newCount;
        loadKitchen();
    }, 2000);
}



// ============================
// 4) Mətbəx — sifarişi qəbul et
// ============================
function acceptOrder(id) {
    let all = JSON.parse(localStorage.getItem("orders")) || [];

    all = all.map(o => {
        if (o.id === id) o.status = "accepted";
        return o;
    });

    localStorage.setItem("orders", JSON.stringify(all));

    loadKitchen();
}



// ============================
// 5) Ofisiant — qəbul olunan sifariş üçün bildiriş
// ============================
function listenAccepted() {
    setInterval(() => {
        let all = JSON.parse(localStorage.getItem("orders")) || [];

        all.forEach(o => {
            if (o.status === "accepted") {
                document.getElementById("acceptedSound").play();
                alert(`Qəbul olundu: Masa ${o.masa}`);

                o.status = "notified";
            }
        });

        localStorage.setItem("orders", JSON.stringify(all));
    }, 2000);
}



// ============================
// 6) Müdir — giriş
// ============================
function adminLogin() {
    const code = document.getElementById("adminCode").value;

    if (code === "1986") {
        document.getElementById("panel").style.display = "block";
        loadAdminOrders();
        loadCerime();
    } else {
        alert("Səhv kod!");
    }
}



// ============================
// 7) Müdir — sifarişləri göstər
// ============================
function loadAdminOrders() {
    const list = document.getElementById("adminList");
    let all = JSON.parse(localStorage.getItem("orders")) || [];

    list.innerHTML = "";

    all.forEach(o => {
        const li = document.createElement("li");
        li.innerHTML = `${o.masa} | ${o.mehsul} | ${o.qeyd} | ${o.time} | (${o.status}) `;

        const btn = document.createElement("button");
        btn.textContent = "Sil";
        btn.onclick = () => deleteOrder(o.id);

        li.appendChild(btn);
        list.appendChild(li);
    });
}



// ============================
// 8) Müdir — sifariş sil
// ============================
function deleteOrder(id) {
    let all = JSON.parse(localStorage.getItem("orders")) || [];

    all = all.filter(o => o.id !== id);

    localStorage.setItem("orders", JSON.stringify(all));

    loadAdminOrders();
}



// ============================
// 9) Müdir — Cərimə əlavə et
// ============================
function addCerime() {
    const amount = document.getElementById("cerimeAmount").value;

    if (!amount) {
        alert("Məbləğ daxil et!");
        return;
    }

    let list = JSON.parse(localStorage.getItem("cerime")) || [];
    list.push(amount);

    localStorage.setItem("cerime", JSON.stringify(list));

    loadCerime();
}



// ============================
// 10) Müdir — Cərimələri göstər
// ============================
function loadCerime() {
    const listHtml = document.getElementById("cerimeList");
    let list = JSON.parse(localStorage.getItem("cerime")) || [];

    listHtml.innerHTML = "";

    list.forEach((c, i) => {
        const li = document.createElement("li");
        li.innerHTML = `${c} AZN `;

        const btn = document.createElement("button");
        btn.textContent = "Sil";
        btn.onclick = () => deleteCerime(i);

        li.appendChild(btn);
        listHtml.appendChild(li);
    });
}



// ============================
// 11) Müdir — Cərimə sil
// ============================
function deleteCerime(index) {
    let list = JSON.parse(localStorage.getItem("cerime")) || [];

    list.splice(index, 1);

    localStorage.setItem("cerime", JSON.stringify(list));

    loadCerime();
}
