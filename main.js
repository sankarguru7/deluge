Vue.component("v-select", VueSelect.VueSelect);
// Vue.component("vue-multiselect", window.VueMultiselect.default);
// window.onload = function () {
var CosBrandarr = "";
var InjBrandarr = "";
var EntityName = "";
var IsSalesOrder = false;
var app = new Vue({
  el: '#app',
  data() {
    return {
      show: false,
      // Dropdown options
      billingaccounts: [],
      buttonText: "Save",
      division: ['Cosmetics', 'Injectables'],
      userdivisions: [],
      EntityId: [],
      // Selected values
      selectedCategory: 'All',
      selectedStatus: 'All',
      selectedPriority: 'All',
      selecteddivision: null,
      selectedbillingaccount: "",
      openDialogalert: false,
      errorMessage: "",
      brandist: [],
      selectbrand: "",
      Pricing_Terms: [],
      deleteitems: [],
      selecteterm: "",
      actdiscountperc: 0,
      actdiscountvalue: 0,
      Sum_Total: 0,
      Sale_orderid: null,
      supplyType: "",
      supplyTypeOptions: [
        { value: "",            text: "Select Supply Type" },
        { value: "Sales",       text: "Sales"              },
        { value: "Demo",        text: "Demo"               },
        { value: "Sample",      text: "Sample"             },
        { value: "Replacement", text: "Replacement"        }
      ],
      communicationBox: "",
      users: [],

      fields: [{ key: "act", label: "Act" }, { key: "S_No", label: "S.No" }, { key: "Product", label: "Product" }, { key: "qty", label: "Quantity" },
      { key: "Unit_Price", label: "Unit Price" }, { key: "mrp_price", label: "MRP Price" }, { key: "mrp_total", label: "MRP Total" }, { key: "tax", label: "Tax" }, { key: "discount", label: "Discount" }, { key: "total_value", label: "Total" }
      ],
      items: [],
      partList: []
    };
  },

  methods: {

    Cancel() {
      ZOHO.CRM.UI.Popup.closeReload().then(function (data) {
        console.log(data);
        window.location.reload();
      });
    },

    Savefunc() {

      if (app.buttonText == "Approve") {
        var func_name = "approvesaleorder";
        var req_data = {
          "arguments": JSON.stringify({
            "recid": app.Sale_orderid
          })
        };
        ZOHO.CRM.FUNCTIONS.execute(func_name, req_data)
          .then(function (data) {
            console.log(data)
            if (data.code == "success") {
              Swal.fire({
                backdrop: true,
                allowOutsideClick: false,
                title: "",
                text: "Record Approved Successfully!",
                icon: "success",
                buttons: true,
                buttons: {
                  confirm: "OK",
                },
              }).then((data) => {
                ZOHO.CRM.UI.Popup.closeReload().then(function (data) {
                  console.log(data);
                  window.location.reload();
                });
              });
            }
          })

      }
      else {

        var jsp = app.findDuplicates();

        if (jsp.length > 0) {
          console.log("Have Duplicates");
          app.openDialogalert = true;
          app.errorMessage = "There is duplicate in Selected Product";
        }
        else {
          console.log("No Duplicates");
          var orderitems = [];
          var Ordered_Items = [];
          app.items.forEach(element => {
            var obj = {};
            var newobj = {};

            newobj.Product_Name = element.Product.id;
            newobj.product = element.Product.id;
            newobj.Tax = parseFloat(element.tax);
            newobj.Quantity = parseFloat(element.Qty);
            newobj.quantity = parseFloat(element.Qty);
            newobj.Discount = element.Discount;
            newobj.Total_Amount = parseFloat(element.Total);
            newobj.Tax_Value = parseFloat(element.tax);
            if (app.Sale_orderid) {
              newobj.id = element.id;
            }
            Ordered_Items.push(newobj);
          });

          if (app.deleteitems) {
            app.deleteitems.forEach(delelement => {
              var obj = {};
              obj.id = delelement.id;
              obj._delete = null;
              Ordered_Items.push(obj);
            });
          }

          //Insert Records
          var recordData = {
            "Account_Name": app.EntityId,
            "Subject": app.selectedbillingaccount.text,
            "Billing_Account": app.selectedbillingaccount.value,
            "Product_Details": Ordered_Items,
            "Ordered_Items": Ordered_Items,
            "Division": app.selecteddivision,
            "Pricing_Terms": app.selecteterm,
            "Brand": app.selectbrand,
            "Supply_Type": app.supplyType,
            "Communication_Box": app.communicationBox
          };
          console.log(recordData);

          if (app.Sale_orderid == null) {
            recordData.Status = "Created";
          }
          var rlist = [];
          rlist.push(recordData);
          var mobj = {};
          mobj.data = rlist;

          if (app.Sale_orderid) {
            var conn_name = "z_crm";
            var req_data = {
              "parameters": mobj,
              "method": "PUT",
              "url": "https://www.zohoapis.com/crm/v8/Sales_Orders/" + app.Sale_orderid,
            };
            ZOHO.CRM.CONNECTION.invoke(conn_name, req_data)
              .then(function (data) {
                console.log(data);
                var response = data;
                if (response.code == "SUCCESS") {
                  var resdata = response.details.statusMessage.data[0].details.id;
                  Swal.fire({
                    backdrop: true,
                    allowOutsideClick: false,
                    title: "",
                    text: "Record Updated Successfully!",
                    icon: "success",
                    buttons: true,
                    buttons: {
                      confirm: "OK",
                    },
                  }).then((data) => {
                    ZOHO.CRM.UI.Popup.closeReload().then(function (data) {
                      console.log(data);
                      window.location.reload();
                    });
                  });
                }
              })
          }
          else {
            var conn_name = "z_crm";
            var req_data = {
              "parameters": mobj,
              "method": "POST",
              "url": "https://www.zohoapis.com/crm/v8/Sales_Orders",
            };
            ZOHO.CRM.CONNECTION.invoke(conn_name, req_data)
              .then(function (data) {
                console.log(data);
                var response = data;
                if (response.code == "SUCCESS") {
                  var resdata = response.details.statusMessage.data[0].details.id;
                  Swal.fire({
                    backdrop: true,
                    allowOutsideClick: false,
                    title: "",
                    text: "Record Created Successfully!",
                    icon: "success",
                    buttons: true,
                    buttons: {
                      confirm: "OK",
                    },
                  }).then((data) => {
                    ZOHO.CRM.UI.Popup.closeReload().then(function (data) {
                      console.log(data);
                      window.location.reload();
                    });
                  });
                }
              })
          }
        }
      }
    },

    findDuplicates() {
      const seen = new Set();
      const duplicates = [];

      app.items.forEach(item => {
        const value = item.Product.id;
        if (seen.has(value)) {
          duplicates.push(item);
        } else {
          seen.add(value);
        }
      });
      return duplicates;
    },

    displayhide() {
      console.log("MANU");
      app.show = "false";
      document.getElementById("transscreen").style.display = "none";
    },
    displayshow() {
      app.show = "true";
      document.getElementById("transscreen").style.display = "block";
    },

    async getbillingaccount(parentacc) {
      var config = {
        select_query: "select id, Account_Name from Accounts where Parent_Account='" + parentacc + "'"
      };
      console.log(config);
      await ZOHO.CRM.API.coql(config).then(async function (respdata) {
        console.log(respdata);
        if (respdata.status == 204) {
          Swal.fire({
            backdrop: true,
            allowOutsideClick: false,
            title: "",
            text: "This is not an Parent Account / No Billing Account Present for this Account!",
            icon: "info",
            buttons: true,
            dangerMode: true,
            buttons: {
              confirm: "OK",
            },
          }).then((data) => {
            ZOHO.CRM.UI.Popup.closeReload().then(function (data) {
              console.log(data);
              window.location.reload();
            });
          });
        }
        else {
          app.billingaccounts = [];
          var sample = [];
          respdata.data.forEach(element => {
            var obj = {};
            obj.text = element.Account_Name;
            obj.value = element.id;
            app.billingaccounts.push(obj);
          });
          app.$forceUpdate();
          console.log(app.billingaccounts);
        }
      });
    },

    deleterow(index) {
      if (app.buttonText == "Approve") {
        app.openDialogalert = true;
        app.errorMessage = "You cannot Delete Material in Approval Screen";
      }
      else {
        app.deleteitems.push(app.items[index]);
        app.items.splice(index, 1);
        app.$forceUpdate();
      }
    },

    addRowHandler() {
      if (app.buttonText == "Approve") {
        app.openDialogalert = true;
        app.errorMessage = "You cannot Add Material in Approval Screen";
      }
      else if (app.selecteddivision == null) {
        app.openDialogalert = true;
        app.errorMessage = "Please Select Division";
      }
      else if (app.selectedbillingaccount == null) {
        app.openDialogalert = true;
        app.errorMessage = "Please Select Billing Account";
      }
      else if (app.selectbrand == null) {
        app.openDialogalert = true;
        app.errorMessage = "Please Select Brand";
      }
      else if (!app.selecteterm) {
        app.openDialogalert = true;
        app.errorMessage = "Please Select Pricing Terms";
      }
      else {
        var newRow = {};
        serialNo = this.items.length;
        serialNo = serialNo + 1;
        newRow.isEdit = true;
        newRow.S_No = serialNo;
        newRow.partList = app.partList;
        newRow.Qty = "0";
        newRow.Unit_Price = "";
        newRow.Maximum_Selling_Price = "";
        newRow.mrp_total = "";
        newRow.tax = 0;
        newRow.Discount = app.actdiscountperc;
        newRow.Total = "";
        app.items.push(newRow);
        console.log(app.items);
        app.$forceUpdate();
      }
    },

    OnchangeMat(index) {
      if (1 == 1) {
        console.log(index);
        app.items[index].Unit_Price = app.items[index].Product.Unit_Price;
        app.items[index].tax = app.items[index].Product.tax;
        app.items[index].Maximum_Selling_Price = app.items[index].Product.Maximum_Selling_Price;
        app.items[index].mrp_total = (parseFloat(app.items[index].Qty || 0) * (parseFloat(app.items[index].Maximum_Selling_Price) || 0)).toFixed(2);

        if (app.selecteddivision == "Injectables") {
          app.settaxinj(index);
        }
        app.$forceUpdate();
      }
    },

    async settaxinj(index) {
      if (IsSalesOrder == false) {
        await ZOHO.CRM.API.getRecord({
          Entity: "Products", approved: "both", RecordID: app.items[index].Product.id
        })
          .then(function (data) {
            console.log("PRODUCT ---");
            console.log(data);
            var injsubform = data.data[0].Injectables_Subform;
            if (injsubform) {
              var slabs = "";
              injsubform.forEach(element => {
                console.log(element);
                slabs = element[app.actdiscountvalue];
              });
              app.items[index].Discount = slabs;
            }
          });
      }
    },

    Calculate(index) {
      console.log(index);
      if (app.buttonText == "Approve") {
        app.openDialogalert = true;
        app.errorMessage = "You cannot Edit in Approval Screen";
      }
      else if (app.items[index].Discount) {
        let actvalud = 0;
        if (app.selecteddivision == "Cosmetics") { actvalud = app.actdiscountperc; }
        else if (app.selecteddivision == "Injectables") { actvalud = app.actdiscountvalue; }

        if (parseFloat(actvalud) < parseFloat(app.items[index].Discount)) {
          app.items[index].ishigh = true;
        }
        else {
          app.items[index].ishigh = false;
        }
      }

      app.qtycalculation(index);
      app.$forceUpdate();
    },

    qtycalculation(index) {
      console.log(index);
      if (app.buttonText == "Approve") {
        app.openDialogalert = true;
        app.errorMessage = "You cannot Edit in Approval Screen";
      }
      else {
        var up = app.items[index].Unit_Price;
        var dis = app.items[index].Discount;
        var tax = app.items[index].tax;
        var linqty = app.items[index].Qty;
        var total = 0;

        if (tax) {
          tax = 0;
        }
        //For Cosmetics
        if (app.selecteddivision == "Cosmetics") {
          var cosdis = 0;
          if (dis) {
            cosdis = parseFloat(dis) / 100;
            total = (parseFloat(linqty) * parseFloat(up));
            var distotal = total * cosdis;
            total = total - distotal;
            total = total.toFixed(2);
          }
        }
        else if (app.selecteddivision == "Injectables") {
          total = (parseFloat(linqty) * parseFloat(dis));
          total = total.toFixed(2);
        }

        app.items[index].Total = total;
        app.items[index].mrp_total = (parseFloat(linqty || 0) * (parseFloat(app.items[index].Maximum_Selling_Price) || 0)).toFixed(2);
        app.alllinesum();
        app.$forceUpdate();
      }
    },

    alllinesum() {
      var totalsum = 0;
      app.items.forEach(element => {
        totalsum = totalsum + parseFloat(element.Total);
      });
      app.Sum_Total = totalsum;
    },

    async Onbrandchange() {
      if (1 == 1) {
        app.Pricing_Terms = [];
        document.getElementById("pricing-term").disabled = false;
        app.selecteterm = "";
        let flag = 1;
        let i = 0;

        while (flag == 1) {
          var req_data = {
            "parameters": { "select_query": "select id,Record_Type,Credit_Period,Scheme_Name.Value,Scheme_Name,Slabs from Pricing_Terms Where Brand='" + app.selectbrand + "' and Account ='" + app.selectedbillingaccount.value + "'  LIMIT " + i + ",200" },
            "method": "POST",
            "url": "https://www.zohoapis.com/crm/v2/coql"
          }
          var conn_name = "crmall";
          await ZOHO.CRM.CONNECTION.invoke(conn_name, req_data)
            .then(async function (response) {
              console.log(response);
              if (response.details.statusMessage.info.more_records == true) {
                i = i + 199;
              } else {
                flag = 0;
              }
              if (response.code == "SUCCESS") {
                if (response.details.status == "true") {
                  if (response.details.statusMessage.data) {
                    let Size_Opt = response.details.statusMessage.data;
                    Size_Opt.forEach(element => {
                      var obj = {};
                      obj.Record_Type = element.Record_Type;
                      obj.Scheme_Name = element.Scheme_Name;
                      obj.Credit_Period = element.Credit_Period;
                      obj.Slabs = element.Slabs;
                      obj.Scheme_Value = element["Scheme_Name.Value"];
                      app.Pricing_Terms.push(obj);
                    });
                  }
                }
              }
            });
        }

        console.log(app.Pricing_Terms);

        if (app.Pricing_Terms.length > 0) {
          app.Pricing_Terms.forEach(element => {
            app.selecteterm = element.Credit_Period;
            if (app.selecteddivision == "Cosmetics") {
              app.actdiscountperc = element.Scheme_Value;
            }
            if (app.selecteddivision == "Injectables") {
              app.actdiscountvalue = element.Slabs;
            }

            if (app.items) {
              let actvalud = 0;
              if (app.selecteddivision == "Cosmetics") { actvalud = app.actdiscountperc; }
              else if (app.selecteddivision == "Injectables") { actvalud = app.actdiscountvalue; }
              app.items.forEach(element => {
                if (element.Discount) {
                  if (parseFloat(actvalud) < parseFloat(element.Discount)) {
                    element.ishigh = true;
                  } else {
                    element.ishigh = false;
                  }
                } else {
                  element.ishigh = false;
                }
              });
              app.$forceUpdate();
            }
          });
          document.getElementById("pricing-term").disabled = true;
        }

        app.SelectMaterials();
      }
    },

    OndivisionChange() {
      if (IsSalesOrder == false) {
        app.items = [];
        app.selectbrand = "";
        app.selectedbillingaccount = "";
        document.getElementById("pricing-term").disabled = false;
        app.selecteterm = "";
        document.getElementById("pricing-term").disabled = true;
        app.partList = [];

        if (app.selecteddivision == "Cosmetics") {
          app.brandist = CosBrandarr.split(";");
        }
        else if (app.selecteddivision == "Injectables") {
          app.brandist = InjBrandarr.split(";");
        }
      }
    },

    OnbillingAcc() {
      if (IsSalesOrder == false) {
        console.log(app.selectedbillingaccount);
        document.getElementById("pricing-term").disabled = false;
        app.selecteterm = "";
        document.getElementById("pricing-term").disabled = false;
        app.selectbrand = null;
      }
    },

    async SelectMaterials() {
      if (1 == 1) {
        let flag = 1;
        let i = 0;

        while (flag == 1) {
          var req_data = {
            "parameters": { "select_query": "select id,Description,Product_Name,Unit_Price,Maximum_Selling_Price,HSN.Total_GST from Products Where Product_Category='" + app.selecteddivision + "' and Brand ='" + app.selectbrand + "' LIMIT " + i + ",200" },
            "method": "POST",
            "url": "https://www.zohoapis.com/crm/v2/coql"
          }
          var conn_name = "crmall";
          await ZOHO.CRM.CONNECTION.invoke(conn_name, req_data)
            .then(async function (response) {
              console.log(response);
              if (response.details.statusMessage.info.more_records == true) {
                i = i + 199;
              } else {
                flag = 0;
              }
              if (response.code == "SUCCESS") {
                if (response.details.status == "true") {
                  if (response.details.statusMessage.data) {
                    let Size_Opt = response.details.statusMessage.data;
                    Size_Opt.forEach(element => {
                      var obj = {};
                      obj.id = element.id;
                      obj.Product_Name = element.Product_Name;
                      obj.Description = element.Description;
                      obj.Unit_Price = element.Unit_Price;
                      obj.Maximum_Selling_Price = element.Maximum_Selling_Price;
                      obj.tax = element["HSN.Total_GST"];
                      app.partList.push(obj);
                    });
                  }
                }
              }
            });
        }
        app.displayhide();
      }
    },
  }
});

ZOHO.embeddedApp.on("PageLoad", function (data) {
  // Initialize the app
  ZOHO.CRM.CONFIG.getCurrentUser().then(function (userInfo) {
    const userDiv = document.getElementById('user-info');
    console.log(userInfo);
    ZOHO.CRM.API.getUser({ ID: userInfo.users[0].zuid }).then(function (userData) {
      console.log("data");
      console.log(data);
      EntityName = data.Entity;
      if (EntityName == "Sales_Orders") {
        app.buttonText = "Update";
      }
      if (data.ButtonPosition) {
        app.EntityId = data.EntityId[0];
      }
      else {
        app.EntityId = data.EntityId;
        app.buttonText = "Approve";
      }

      if (userData) {
        userdivisions = userData.users[0].Division;
      }

      console.log(app.EntityId);

      ZOHO.CRM.API.getOrgVariable("Cos_brand").then(function (data) {
        console.log(data);
        CosBrandarr = data.Success.Content;
      }).catch(function (error) {
        console.error(error);
      });
      ZOHO.CRM.API.getOrgVariable("Inj_Brand").then(function (data) {
        console.log(data);
        InjBrandarr = data.Success.Content;
      }).catch(function (error) {
        console.error(error);
      });

      //Get Billing Account
      if (EntityName == "Sales_Orders") {
        app.Sale_orderid = app.EntityId;
        IsSalesOrder = true;
        var conn_name = "z_crm";
        var req_data = {
          "method": "GET",
          "url": "https://www.zohoapis.com/crm/v8/Sales_Orders/" + app.Sale_orderid,
        };
        ZOHO.CRM.CONNECTION.invoke(conn_name, req_data)
          .then(function (data) {
            console.log(data);
            var response = data;
            if (response.code == "SUCCESS") {
              var res = response.details.statusMessage.data[0];
              if (res) {
                console.log(res);
                app.EntityId = res.Account_Name.id;

                const obj = {};
                obj.text = res.Billing_Account.name;
                obj.value = res.Billing_Account.id;
                const billist = [];
                billist.push(obj);
                app.billingaccounts = billist;
                app.selectedbillingaccount = obj;
                app.selecteddivision = res.Division;
                app.selecteterm = res.Pricing_Terms;
                app.selectbrand = res.Brand;
                app.supplyType = res.Supply_Type || "";
                app.communicationBox = res.Communication_Box || "";

                document.getElementById("pricing-term").disabled = true;
                document.getElementById("divisionid").disabled = true;
                document.getElementById("billingselect").disabled = true;
                document.getElementById("billingbrand").disabled = true;

                app.SelectMaterials();
                app.items = [];
                app.partList = [];
                let lineitems = [];
                lineitems = res.Ordered_Items;
                lineitems.forEach(element => {
                  var newobj = {};
                  var prdlist = [];
                  var prd = {};
                  prd.id = element.Product_Name.id;
                  prd.Product_Name = element.Product_Name.name;
                  prd.Unit_Price = element.Unit_Price;
                  prd.Maximum_Selling_Price = element.Maximum_Selling_Price_1;
                  prd.Description = element.Description;
                  prdlist.push(prd);

                  var serialNo = app.items.length;
                  serialNo = serialNo + 1;
                  newobj.id = element.id;
                  newobj.isEdit = true;
                  newobj.S_No = serialNo;
                  newobj.Product = prd;
                  newobj.Unit_Price = element.List_Price;
                  newobj.Maximum_Selling_Price = element.Maximum_Selling_Price_1;
                  newobj.tax = parseFloat(element.Tax_Value);
                  newobj.Qty = parseFloat(element.Quantity);
                  newobj.Discount = element.Discount;
                  newobj.Total = parseFloat(element.Total_Amount);
                  newobj.mrp_total = (parseFloat(newobj.Qty || 0) * (parseFloat(newobj.Maximum_Selling_Price) || 0)).toFixed(2);
                  newobj.partList = app.partList;

                  app.items.push(newobj);
                });
                app.alllinesum();
                app.Onbrandchange();
                app.$forceUpdate();
                console.log(app.items);
              }
            }
          });
      }
      else {
        app.getbillingaccount(app.EntityId);
      }

    });

  }).catch(function (err) {
    console.error('Error:', err);
  });
});

ZOHO.embeddedApp.init().then(function (testFunc) {
  ZOHO.CRM.UI.Resize({ height: "100%", width: "100%" }).then(function (data) { });
});