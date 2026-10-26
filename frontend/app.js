const BASE = "http://localhost:3000/api";
async function checkHealth(){
    try{
        const res = await fetch(`${BASE}/health`);
        if(!res.ok)
            throw new Error(`HTTP error: ${res.status}`);
        data = await res.json();
        console.log("Health Check Response:", data);
        return data;
    } catch (err) {
        console.error("Health check failed:", err.message);
        throw err;
    }
}

async function checkDB(){
    try{
        const res = await fetch(`${BASE}/db-test`);
        if(!res.ok)
            throw new Error(`Database error: ${res.status}`);
        data = await res.json();
        console.log("Health Check Response:", data);
        return data;
    } catch (err) {
        console.error("Health check failed:", err.message);
        throw err;
    }
}

async function sendRequest(endpoint, method = "GET", payload = null){
    const options = {
        method,
        headers: {"Content-Type": "application/json"}
    };

    if(payload && method !== "GET")
        options.body = JSON.stringify(payload);

    res = await fetch (`${BASE}/${endpoint}`, options);
    data = await res.json();

    if(!res.ok)
        throw new Error(data.error || data.message || `Request failed (${res.status})`)
    return data;
}

function renderTable(tableHeadRow, tableBody, rows) {
    tableHeadRow.empty();
    tableBody.empty();

    if(!rows || rows.length === 0){
        tableBody.append("<tr><td colspan = `100%`>No data returned</td></tr>");
        return;
    }

    headers = Object.keys(rows[0]);
    headers.forEach((h) => {
        tableHeadRow.append($("<th>").text(h));
    });

    rows.forEach((row) => {
        tr = $("<tr>");
        headers.forEach((h) => {
            tr.append($("<td>").text(row[h] !== null ? row[h] : "NULL"));
        });
        tableBody.append(tr);
    });
}

const dataTypes = {
    VARCHAR: (max = 100, required = true) => ({
        attrs: {
            type: "text",
            maxlength: String(max),
            required
        }
    }),

    DECIMAL_12_2: (min = "0.00", max = "9999999999.99") => ({
        attrs: {
            type: "number",
            step: "0.01",
            min: String(min),
            max: String(max),
            placehoolder: "0.00",
            required: true
        }
    }),

    CHAR: (length = 2, uppercase = true) => ({
        attrs: {
            type: "text",
            maxlength: String(length),
            minlength: String(length),
            pattern: `[A-Za-z]{${length}}`,
            required: true
        },
        onInput: uppercase
            ? function() {
                $(this).val($(this).val().replace(/[^a-zA-Z]/g, "").toUpperCase()); }
                : null
    }),

    INT:  (min = "1", max = "2147483647") => ({
        attrs: {
            type: "number",
            step: "1",
            min: String(min),
            max: String(max),
            required: true
        },
        onKeydown: function(e){
            if([".", "e", "E", "+", "-"].includes(e.key))
                e.preventDefault();
        }
    }),

    DECIMAL_5_4: (min = "-9.9999", max = "9.9999") => ({
        attrs: {
            type: "number",
            step: "0.0001",
            min: String(min),
            max: String(max),
            placeholder: "0.0000",
            required: true
        }
    }),

    TIMESTAMP: (required = true) => ({
        attrs: {
            type: "datetime-local",
            step: "1",
            required
        }
    }),

    BOOLEAN: (required = true) => ({
        isSelect: true,
        options: [
            { value: "", label: "-- Select --"},
            { value: "true", label: "True"},
            { value: "false", label: "False"}
        ],
        attrs: {
            required
        }
    }),

    PHONE: (required = true) => ({
        attrs: {
            type: "tel",
            placeholder: "555-555-5555",
            maxlength: "12",
            pattern: "\\d{3}-\\d{3}-\\d{4}",
            required
        },
        onInput: function(){
            let val = $(this).val().replace(/\D/g, "").substring(0, 10);
            if(val.length > 10)
                val = val.substring(0, 10);
            
            let formatted = "";
            if(val.length > 6){
                formatted = `${val.substring(0, 3)}-${val.substring(3, 6)}-${val.substring(6)}`;
            } else if(val.length > 3){
                formatted = `${val.substring(0, 3)}-${val.substring(3)}`;
            } else {
                formatted = val;
            }

            $(this).val(formatted);
        }
    }),

    EMAIL: (max = 100, required = true) => ({
        attrs: {
            type: "email",
            maxlength: String(max),
            placeholder: "user@domain.com",
            required
        }
    })
};

const manFieldSchemas = {
    //Decimals
    taxRate: {label: "Tax Rate", ...dataTypes.DECIMAL_5_4("0.0000", "1.0000")},
    balance: {label: "Balance", ...dataTypes.DECIMAL_12_2("-9999999999.99")},
    price: {label: "Price", ...dataTypes.DECIMAL_12_2()},
    total: {label: "Total", ...dataTypes.DECIMAL_12_2()},
    quantity: {label: "Quantity", ...dataTypes.DECIMAL_12_2()},
    unitPrice: {label: "Unit Price", ...dataTypes.DECIMAL_12_2()},
    taxAmount: {label: "Tax Amount", ...dataTypes.DECIMAL_12_2()}, 

    //Integers
    storeId: {label: "Store ID", ...dataTypes.INT()},
    aisleNumber: {label: "Aisle Number", ...dataTypes.INT()},
    purchaseId: {label: "Purchase ID", ...dataTypes.INT()},
    lineNumber: {label: "Line Number", ...dataTypes.INT()},
    customerId: {label: "Customer ID", ...dataTypes.INT()},
    accountId: {label: "Account ID", ...dataTypes.INT()}, 
    
    //Contacts & Strings
    firstName: {label: "First Name", ...dataTypes.VARCHAR(50)},
    lastName: {label: "Last Name", ...dataTypes.VARCHAR(50)},
    email: {label: "Email Address", ...dataTypes.EMAIL(120)},
    phone: {label: "Phone Number", ...dataTypes.PHONE()},
    state: {label: "State Code", ...dataTypes.CHAR(2)},

    name: {label: "Name", ...dataTypes.VARCHAR(100)},
    address: {label: "Address", ...dataTypes.VARCHAR(200)},
    city: {label: "City", ...dataTypes.VARCHAR(100)},
    zip: {label: "Zip Code", ...dataTypes.VARCHAR(10)},
    category: {label: "Category", ...dataTypes.VARCHAR(100)},
    sku: {label: "SKU", ...dataTypes.VARCHAR(30)},
    paymentMethod: {label: "Payment Method", ...dataTypes.VARCHAR(10)},

    //System Fields
    purchaseDate: {label: "Purchase Date", ...dataTypes.TIMESTAMP()},
    taxable: {label: "Taxable", ...dataTypes.BOOLEAN()},
    byWeight: {label: "By Weight", ...dataTypes.BOOLEAN()}
};

const tableSchemas = {
    stateTax: ["state", "taxRate"],
    store: ["storeId", "state", "name", "address", "city", "zip"],
    aisle: ["storeId", "aisleNumber", "category"],
    inventory: ["storeId", "sku", "aisleNumber", "quantity"],
    customer: ["customerId", "firstName", "lastName", "email", "phone"],
    product: ["sku", "name", "price", "taxable", "byWeight"],
    purchaseItem: ["purchaseId", "lineNumber", "sku", "quantity", "unitPrice", "taxAmount"],
    purchase: ["purchaseId", "storeId", "customerId", "purchaseDate", "total", "paymentMethod", "accountId"],
    bankAccount: ["accountId", "customerId", "balance"]
};


$(function(){ 
    const outputLog = $("#outputLog");
    const tableHeadRow = $("#tableHeadRow");
    const tableBody = $("#tableBody");

    $(".tabBtn").on("click", function () {
        targetTabId = $(this).data("tab");

        $(".tabBtn").removeClass("active");
        $(".tabContent").removeClass("active");

        $(this).addClass("active");
        $(`#${targetTabId}`).addClass("active");

        if(targetTabId === "tabHistory")
            loadTransactionHistory();
    });

    //--Connection Status & DB Control


    $("#healthCheck").on("click", async () => {
        outputLog.text("Checking server health...");
        try{
            const result = await checkHealth();
            outputLog.text(JSON.stringify(result, null, 2));
        } catch (err){
            outputLog.text(`Server Unreachable: ${err.message}`);
        }
    });

    $("#dbCheck").on("click", async () => {
        outputLog.text("Checking database connection...");
        try{
            const result = await checkDB();
            outputLog.text(JSON.stringify(result, null, 2));
        } catch (err) {
            outputLog.text(`Database Unreachable: ${err.message}`);
        }
    });


    $("#initTables").on("click", async () => {

        const confirmed = window.confirm(
            "WARNING: Reinitializing will reset current schema and overwrite any active transaction states\n\nContinue with initialization?"
        )

        if(!confirmed){
            outputLog.text("Operation aborted: Initialization cancelled");
            return;
        }

        
        outputLog.text("Initializaing tables...");

        try{
            const res = await sendRequest("db/init", "POST");
            outputLog.text(JSON.stringify(res, null, 2));
        } catch (err){
            outputLog.text(`Init Error: ${err.message}`);
        }
    });

    $("#randomInit").on("click", async () => {
        outputLog.text("Seeding baseline data...");
        try{
            const res = await sendRequest("db/seed", "POST");
            outputLog.text(JSON.stringify(res, null, 2));
        } catch (err) {
            outputLog.text(`Seed Error: ${err.message}`);
        }
    });

    $("#viewTable").on("change", async () => {
        selectedTable = $("#viewTable").val();

        tableHeadRow.empty();
        tableBody.empty();

        if(!selectedTable || !tableSchemas[selectedTable]){
            return;
        }

        let endpoint = "";

        if(selectedTable === "stateTax")
            endpoint = "state_tax";
        else if(selectedTable === "purchaseItem")
            endpoint = "purchase_item";
        else if(selectedTable === "bankAccount")
            endpoint = "bank_account";
        else
            endpoint = selectedTable;

        try{
            const res = await sendRequest(`tables/${endpoint}`, "GET");
            renderTable($("#inspectHeadRow"), $("#inspectBody"), res.data);
        } catch (err){
            outputLog.text(`Report Error: ${err.message}`);
            tableHeadRow.empty();
            tableBody.empty();
        }
    });
    

    $("#dropTables").on("click", async () => {

        const confirmed = window.confirm(
            "DANGER: This will clear all tables and wipe all data!\n\nAre you sure you want to proceed?"
        )

        if(!confirmed){
            outputLog.text("Operation aborted: Clear Tables cancelled by user.");
            return;
        }

        outputLog.text("Dropping tables...");

        try{
            const res = await sendRequest("db/reset", "POST", {confirm: true});
            outputLog.text(JSON.stringify(res, null, 2));

            renderTable($("#inspectHeadRow"), $("#inspectBody"));

        } catch (err){
            outputLog.text(`Drop Error: ${err.message}`);
        }
    });

    //--OLTP Simulation

    // 1. Live Concurrent / Single Simulation
    $("#btnRunOneSim").on("click", async () => {
    const $feed = $("#simLogContainer");
    $feed.empty();

    const storeId = parseInt($("#simStoreId").val(), 10) || 1;
    const itemCount = parseInt($("#simItemCount").val(), 10) || 12;
    const paymentMethod = $("#simPaymentMethod").val();
    const concurrentClients = parseInt($("#simConClients").val(), 10) || 1;

    // Render pending cards immediately
    const cards = [];
    for (let i = 0; i < concurrentClients; i++) {
        const cardId = `simCard_${Date.now()}_${i}`;
        const $card = $("<div>", {
        id: cardId,
        class: "simCard pending",
        html: `
            <h4>Client #${i + 1} (Store ${storeId}) <span class="badge">Processing</span></h4>
            <p class="muted">Locking inventory rows and verifying bank balance...</p>
        `
        });
        $feed.prepend($card);
        cards.push({ id: cardId, clientNum: i + 1 });
    }

    // Fire requests concurrently using Promise.allSettled
    const checkoutPromises = cards.map(async (c) => {
        const $card = $(`#${c.id}`);

        try {
        const res = await sendRequest("simulation/checkout", "POST", {
            store_id: storeId,
            item_count: itemCount,
            payment_method: paymentMethod
        });

        const receipt = Array.isArray(res.simulations) ? res.simulations[0] : res;

        if(!receipt || (!receipt.purchase_id && !receipt.success)){
            throw new Error(res.message || "Invalid receipt data returned");
        }

        // Render Committed State
        $card.removeClass("pending").addClass("committed");
        $card.empty();
        $card.append(`
            <h4>Transaction #${receipt.purchase_id} | Client #${c.clientNum} <span class="badge">Committed</span></h4>
            <p style="margin: 2px 0; font-size: 12px;">Customer: <strong>${receipt.customer_id || "Guest"}</strong> | Payment: <strong>${receipt.payment_method}</strong> ${receipt.account_id ? `(Acct #${receipt.account_id})` : ""}</p>
        `);

        const $itemList = $("<ul>");
        receipt.items.forEach((it) => {
            const unit = Number(it.unit_price).toFixed(2);
            // const line = Number(it.line_total).toFixed(2);
            $itemList.append(`<li>${it.name || it.sku} (${it.sku}) - ${it.quantity} @ $${unit} = $${(it.quantity * unit).toFixed(2)}</li>`);        });
        $card.append($itemList);

       $card.append(`
            <div class="totals" style="margin-top: 6px; border-top: 1px solid #eee; padding-top: 4px;">
                Subtotal: $${receipt.subtotal} | Tax: $${(receipt.total - receipt.subtotal).toFixed(2) || "0.00"} | <strong>Total: $${receipt.total}</strong>
            </div>
            `);
        } catch (err) {
        // Render Rolled Back / Aborted State
        $card.removeClass("pending").addClass("aborted");
        $card.empty();
        $card.append(`
            <h4>Client #${c.clientNum} <span class="badge">Rolled Back</span></h4>
            <p style="color: #c0392b; margin: 4px 0; font-weight: bold;">Error: ${err.message}</p>
            <p class="muted" style="margin: 0; font-size: 11px;">ACID transaction safely aborted. All inventory and bank updates rolled back.</p>
        `);
        }
    });

    await Promise.allSettled(checkoutPromises);
    });

    $("#btnTestHardcodedCheckout").on("click", async () => {
        const $feed = $("#simLogContainer");
        $feed.prepend(`
            <div id="testCard" class="sim-card pending">
            <h4>Deterministic Test Transaction <span class="badge">Running</span></h4>
            <p class="muted">Testing processCheckout with fixed SKUs (1003, 1009) and Account #1...</p>
            </div>
        `);

        try {
            const res = await sendRequest("checkout/test", "POST", { account_id: 1 });
            const receipt = res.simulations ? res.simulations[0] : res;

            $("#testCard").removeClass("pending").addClass("committed").html(`
            <h4>Tx #${receipt.purchase_id} <span class="badge">Committed</span></h4>
            <p style="margin: 2px 0; font-size: 12px;">Customer: <strong>${receipt.customer_id}</strong> | Paid via <strong>${receipt.payment_method}</strong> (Account #${receipt.account_id})</p>
            <ul>
                ${receipt.items.map(it => `<li>${it.name || it.sku} (${it.sku}) - Qty: ${it.quantity} @ $${it.unit_price} = $${it.line_total}</li>`).join("")}
            </ul>
            <div class="totals">
                Subtotal: $${receipt.subtotal} | Tax: $${receipt.tax} | <strong>Total: $${receipt.total}</strong>
            </div>
            `);
        } catch (err) {
            $("#testCard").removeClass("pending").addClass("aborted").html(`
            <h4>Deterministic Test <span class="badge">Failed / Rolled Back</span></h4>
            <p style="color: #c0392b; font-weight: bold; margin: 4px 0;">Error: ${err.message}</p>
            `);
        }
    });

    // $("#btnRunSim").on("click", async () => {
    //     feed = $("#simLogContainer");
    //     feed.empty();
    //     feed.append("<p>Beginning Simulation...</p>");

    //     storeIdVal = $("#simStoreId").val();
    //     custIdVal = $("#simCustId").val();
    //     accountIdVal = $("simAcctId").val();

    //     payload = {
    //         store_id: storeIdVal ? parseInt(storeIdVal, 10) : 1,
    //         customer_id: custIdVal ? parseInt(cusIdVal, 10) : null,
    //         account_id: accountIdVal ? parseInt(accountIdVal, 10) : null
    //     };

    //     try{
    //         const res = await sendRequest("simulation/checkout", "POST", payload);
    //         feed.empty();

    //         if(!res.simulations || res.simulations.length === 0){
    //             feed.append("<p>No transactions generated</p>");
    //             return;
    //         }

    //         res.simulations.forEach((sim, idx) => {
    //             isErr = !sim.success;
    //             card = $("<div>", {class: `simCard ${isErr ? "error" : ""}`}); 
    //             card.append(`<h4>Tx #${idx + 1}: Customer ${sim.customer_id} (${sim.payment_method.toUpperCase()})</h4>`);

    //             if(isErr)
    //                 card.append(`<p style="color:red; margin:0;"><strong>ABORTED/ROLLED BACK:</strong> ${sim.error}</p>`);
    //             else{
    //                 const $ul =$("<ul>");
    //                 sim.items.forEach((it) => {
    //                     $ul.append(`<li>${it.sku} - ${it.name} | Qty: ${it.quantity} @ $${it.unit_price} (Tax: $${it.tax_amount})</li>`);
    //                 });
    //                 card.append($ul);
    //                 card.append(`<div><strong>Subtotal:</strong> $${sim.subtotal} | <strong>Total Paid:</strong> $${sim.total}</div>`);
    //                 if (sim.account_id) {
    //                     card.append(`<div class="muted">Charged to Bank Account ID: ${sim.account_id}</div>`);
    //                 }
    //             }
    //             feed.append(card);
    //         });
    //     } catch (err){
    //         feed.html(`<p style="color:red;">Simulation Engine Failed: ${err.message}</p>`);
    //     }
    // });

    //--Analytical Report Views

    async function report(endpoint) {

        head = $("#tableHeadRow");
        body = $("#tableBody");
        body.html("<tr><td colspan='100%'>Querying analytical view...</td></tr>");

        try{
            const res = await sendRequest(`reports/${endpoint}`, "GET");
            outputLog.text(`Successful Query. Retrieved ${res.data ? res.data.length : 0} rows.`);
            renderTable(head, body, res.data);
        } catch (err){
            head.empty();
            body.html(`<tr><td colspan='100%' style="color:red;">Report Failed: ${err.message}</td></tr>`);
            
        }
    }

    $("#btnReportStoreSales").on("click", () => report("store-sales"));
    $("#btnReportTopProducts").on("click", () => report("top-products"));
    $("#btnReportInventoryLevels").on("click", () => report("low-stock"));

    async function loadTransactionHistory () {
        body = $("#historyBody");
        body.html("<tr><td colspan='7'>Loading latest 50 transactions...</td></tr>");

        try{
            const res = await sendRequest("transactions/history");
            body.empty();

            if(!res.data || res.data.length === 0){
                body.append("<tr><td colspan='7'>No transaction records available.</td></tr>");
                return;
            }

            res.data.forEach((tx) => {
                $tr = $("<tr>");
                $tr.append($("<td>").text(tx.purchase_id));
                $tr.append($("<td>").text(tx.store_id));
                $tr.append($("<td>").text(tx.customer_id !== null ? tx.customer_id : "N/A (Guest)"));
                $tr.append($("<td>").text(new Date(tx.purchase_date).toLocaleString()));
                $tr.append($("<td>").text(tx.payment_method));
                $tr.append($("<td>").text(tx.account_id !== null ? tx.account_id : "N/A"));
                $tr.append($("<td>").text(`$${parseFloat(tx.total).toFixed(2)}`));
                body.append($tr);
            });
        } catch (err) {
            body.html(`<tr><td colspan='7' style="color:red;">Failed to retrieve transaction history: ${err.message}</td></tr>`);
        }
    }

    $("#btnRefreshHistory").on("click", loadTransactionHistory);

});