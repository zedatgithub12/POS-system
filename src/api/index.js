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
    //stores api
    createstore: '/createstore',
    viewstore: '/viewstore',
    updatestore: '/updatestore/',
    deletestore: '/deletestore/',
    addmanager: '/addmanager/',

    //product api's
    addproduct: '/addproduct',
    viewproduct: '/viewproduct',
    productdetail: '/products/',
    viewstoreproduct: '/viewstoreproduct/', //an api to fetch view sales role in store product
    updateproduct: '/updateproduct/',
    deleteproduct: '/deleteproduct/',

    //product api's
    addpackage: '/addpackage',
    viewpackages: '/viewpackages',
    packagedetail: '/package/',
    viewstorepackage: '/viewstorepackage/',
    updatepackage: '/updatepackage/',
    deletepackage: '/deletepackage/',

    //category api's
    addcategory: '/addcategory',
    viewcategory: '/viewcategory',
    editcategory: '/editcategory/',
    deletecategory: '/deletecategory/',

    //sales api
    createsale: '/createsale',
    viewsale: '/viewsale',
    viewstoresale: '/viewstoresale/', //an api to fetch view sales role sale
    updatesale: '/updatesale/',
    deletesale: '/deletesale/',

    //customer api
    addcustomer: '/addcustomer',
    viewcustomer: '/viewcustomer',
    viewstorecustomer: '/viewstorecustomer/', //an api to fetch customer sales role customer
    updatecustomer: '/updatecustomer/',
    deletecustomer: '/deletecustomer/',

    //users api
    adduser: '/adduser',
    viewuser: '/viewuser',
    updateuser: '/updateuser/',
    deleteuser: '/deleteuser/',

    //price updates
    priceupdates: '/priceupdates/',
    updateprice: '/updateprice',

    //Notifaction Api's
    adminnotification: '/adminnotification',
    salesnotification: '/salesnotification/',
    updateStatus: '/updatestatus/',
    updateSalesStatus: '/updatesalesstatus/'
};

export default Connections;
