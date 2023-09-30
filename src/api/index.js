const Connections = {
    api: 'http://localhost:8000/api',
    images: 'http://localhost:8000/api/images/',
    // api: 'https://addischircharo.com/backend/api',
    // images: 'https://addischircharo.com/backend/api/images/',
    login: '/login',
    forgotpassword: '/forgotpassword',
    resetpassword: '/resetpassword',
    changepass: '/changepass/',
    //stats api
    adminstat: '/adminstat',
    shopstat: '/shopstat',
    againsttarget: '/againsttarget/',
    monthlytarget: '/monthlytarget/',
    eachShops: '/shopstarget',
    // admin dashboard sidebar
    lowstock: '/lowstock/',
    customercount: '/customercount',

    //stores api
    createstore: '/createstore',
    viewstore: '/viewstore',
    updatestore: '/updatestore/',
    deletestore: '/deletestore/',
    addmanager: '/addmanager/',
    changeStatus: '/changeStatus',
    updateStatus: '/updateStatus',

    //product api's
    addproduct: '/addproduct',
    viewproduct: '/viewproduct',
    productdetail: '/products/',
    viewstoreproduct: '/viewstoreproduct/', //an api to fetch view sales role in store product
    updateproduct: '/updateproduct/',
    deleteproduct: '/deleteproduct/',

    //item api's
    items: '/items',
    allItems: '/getallitems',
    addItems: '/add-items',
    getItems: '/get-items/',
    updateItems: '/update-items/',
    deleteItems: '/delete-items/',
    updateproductstatus: '/update-product-status/',

    //Stock api's
    stocks: '/stocks',
    shopStocks: '/shopStocks/',
    getShopStocks: '/getShopStocks/',
    createStocks: '/create-stocks',
    getStock: '/get-stocks/',
    updateStock: '/update-stocks/',
    updateStockStatus: '/update-stock-status/',
    deleteStocks: '/delete-stocks/',

    //package api's
    addpackage: '/addpackage',
    viewpackages: '/viewpackages',
    packagedetail: '/package/',
    viewstorepackage: '/viewstorepackage/',
    updatepackage: '/updatepackage/',
    deletepackage: '/deletepackage/',

    //packaged items api
    packagedItems: '/packaged-items/',
    addPackagedItem: '/add-packaged-items/',
    deletePackagedItem: '/packaged-items/',
    quantityUpdate: '/single-package-item/',

    //sold package Api's
    createpackagesale: '/createpackagesale',
    viewpackagesale: '/viewsoldpackages',
    viewstorepackagesale: '/viewstorepackagesale/',
    updatepackagesale: '/updatepackagesale/',
    deletepackagesale: '/deletepackagesale/',

    //category api's
    addcategory: '/addcategory',
    viewcategory: '/viewcategory',
    editcategory: '/editcategory/',
    deletecategory: '/deletecategory/',

    //sub category api's
    addsubcategory: '/addsubcategory',
    subcategory: '/subcategory/',
    viewsubcategory: '/viewsubcategory',
    editsubcategory: '/editsubcategory/',
    deletesubcategory: '/deletesubcategory/',

    //sales api
    createsale: '/createsale',
    viewsale: '/viewsale',
    viewstoresale: '/viewstoresale/', //an api to fetch view sales role sale
    updatesale: '/updatesale/',
    deletesale: '/deletesale/',

    //sales api
    getSoldItem: '/sold_items/',
    updateSoldItem: '/sold_items/',
    deleteSoldItem: '/sold_items/',

    //customer api
    addcustomer: '/addcustomer',
    viewcustomer: '/viewcustomer',
    viewstorecustomer: '/viewstorecustomer/', //an api to fetch customer sales role customer
    updatecustomer: '/updatecustomer/',
    deletecustomer: '/deletecustomer/',
    customerdetails: '/customer-details/',

    //users api
    adduser: '/adduser',
    viewuser: '/viewuser',
    updateuser: '/updateuser/',
    deleteuser: '/deleteuser/',

    //price updates
    priceupdates: '/priceupdates/',
    updateprice: '/updateprice',
    updateallprice: '/updateallprice',

    // shop targets
    targets: '/targets',
    singleshop: '/singleshop/',
    addtarget: '/addtarget',
    updatetarget: '/updatetarget/',
    deletetarget: '/deletetarget/',

    //replanishments
    newreplanishment: '/newreplanishment',
    singlereplanishment: '/singlereplanishment',
    allreplanishments: '/allreplanishments',
    deleterecord: '/deleterecord',

    //tranfers
    alltransfers: '/alltransfers',
    transfer: '/transfer',
    updatetransfer: '/updatetransfer/',
    deletetransfer: '/deletetransfer/',

    //Notifaction Api's
    adminnotification: '/adminnotification',
    salesnotification: '/salesnotification/',
    updateStatus: '/updatestatus/',
    updateSalesStatus: '/updatesalesstatus/'
};

export default Connections;
