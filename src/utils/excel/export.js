const csvData =
    selectedRows.length > 0
        ? selectedRows.map((id) => {
              const sale = salesData.find((item) => item.id === id);
              return {
                  Shop: sale.shop,
                  SoldOn: sale.date,
                  Reference: sale.reference,
                  customer: sale.customer,
                  GrandTotal: sale.grandtotal,
                  Payment_Status: sale.payment_status,
                  payment_method: sale.payment_method,
                  Note: sale.note,
                  Time: sale.time
              };
          })
        : filteredSalesData.map((sale) => ({
              Shop: sale.shop,
              SoldOn: sale.date,
              Reference: sale.reference,
              customer: sale.customer,
              GrandTotal: sale.grandtotal,
              Payment_Status: sale.payment_status,
              payment_method: sale.payment_method,
              Note: sale.note,

              Time: sale.time
          }));

const handleDownloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(csvData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sales');
    const excelBuffer = XLSX.write(workbook, {
        bookType: 'xlsx',
        type: 'array'
    });
    const fileData = new Blob([excelBuffer], {
        type: 'application/octet-stream'
    });
    saveAs(fileData, 'sales.xlsx');
};
