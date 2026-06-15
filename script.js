function addRow() {

    let table = document.getElementById("paymentBody");

    let row = table.insertRow();

    row.innerHTML = `
<td><button class="deleteRow" onclick="deleteRow(this)">X</button></td>

<td>
<select name="payment_type[]">
<option value="">Select</option>
<option value="Payment Received">Payment Received</option>
<option value="Due On Installation">Due On Installation</option>
<option value="Flexible Payment">Flexible Payment</option>
</select>
</td>

<td>
<input type="number" name="amount[]" placeholder="Enter Amount" oninput="calculateTotals()">
</td>

<td>
<input type="number" name="day[]" placeholder="Enter Day">
</td>
`;
    calculateTotals();
}

let tablerow = document.getElementById("paymentBody");

tablerow.addEventListener("change", (e) => {

    if (e.target.name === "payment_type[]") {

        let row = e.target.closest("tr");
        let daysInput = row.querySelector("input[name='day[]']");

        let selectedValue = e.target.value;

        if (selectedValue === "Payment Received" || selectedValue === "Due On Installation") {

            daysInput.value = 0;
            daysInput.readOnly = true;   // freeze

        } else {

            daysInput.value = "";
            daysInput.readOnly = false;  // enable

        }
    }

});


function deleteRow(btn) {
    let row = btn.parentNode.parentNode;
    row.remove();
    calculateTotals();
}

var dealAmount = 0;

function calculateTotals() {
    let amounts = document.getElementsByName("amount[]");
    let totalAdded = 0;
    for (let i = 0; i < amounts.length; i++) {
        let val = parseFloat(amounts[i].value);
        if (!isNaN(val)) {
            totalAdded += val;
        }
    }

    let remaining = dealAmount - totalAdded;

    document.getElementById("totalDealAmount").innerText = dealAmount.toFixed(2);
    document.getElementById("totalAddedAmount").innerText = totalAdded.toFixed(2);
    document.getElementById("remainingAmount").innerText = remaining.toFixed(2);
}

function savePayments() {

    let table = document.getElementById("paymentBody");
    let rows = table.rows;

    let subformData = [];

    for (let i = 0; i < rows.length; i++) {

        let row = rows[i];

        let paymentType = row.querySelector("select[name='payment_type[]']").value;
        let amount = row.querySelector("input[name='amount[]']").value;
        let days = row.querySelector("input[name='day[]']").value;

        if (!paymentType || !amount || !days) {
            alert("Please fill Payment Type, Amount and Days in row " + (i + 1));
            return;
        }

        if (paymentType) {

            let obj = {

                "Payment_Type": paymentType,
                "Amount": amount,
                "Days": days

            };

            subformData.push(obj);
        }

    }

    if (subformData.length == 0) {
        alert("Please enter data to save");
        return;
    }

    let config = {

        Entity: module,

        APIData: {
            "id": recordId,
            "Payment_Terms": subformData
        }

    };

    ZOHO.CRM.API.updateRecord(config).then(function (data) {
        console.log(data);
        alert("Saved Successfully");
    });

    setTimeout(function () {

        ZOHO.CRM.BLUEPRINT.proceed().then(function () {

            // Wait again before reload
            setTimeout(function () {

                ZOHO.CRM.UI.Popup.closeReload();

            }, 1500); // reload delay

        });

    }, 1000); // blueprint delay


}

var module;
var recordId;
ZOHO.embeddedApp.on("PageLoad", function (data) {
    recordId = data.EntityId;
    module = data.Entity;

    ZOHO.CRM.UI.Resize({ height: "500", width: "2000" }).then(function (data) {
        console.log(data);
    });

    ZOHO.CRM.API.getRecord({ Entity: module, RecordID: recordId }).then(function (response) {
        if (response.data && response.data.length > 0) {
            let record = response.data[0];
            dealAmount = parseFloat(record.Amount) || 0;
            calculateTotals();
        }
    });

});



ZOHO.embeddedApp.init();
