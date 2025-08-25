
import { Order } from '@/types/OrderTypes';
import {
    Document,
    Image,
    Page,
    StyleSheet,
    Text,
    View,
} from "@react-pdf/renderer";
import React from 'react';
import Logo from "/client/hero/logo.webp";

const styles = StyleSheet.create({
    page: {
        paddingLeft: 20,
        paddingRight: 20,
        fontSize: 10,
        paddingBottom:40
    },
    part1: {
        display: "flex",
        justifyContent: "space-between",
        flexDirection: "row",
        gap: 5,
        paddingTop: 10,
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom:10,
        marginBottom: 5,
    },
    part1Image: {
        width: 70,
        height: 70,
    },
    companyName: {
        color: "black",
        fontSize: 26,
        fontWeight: "bold",
    },
    registrationName: {
        fontSize: 16,
        color: "black",
        fontWeight: "bold",
    },
    companyDetails: {
        display: "flex",
        justifyContent: "center",
    },
    textBold: {
        fontWeight: "bold",
    },
    table: {
        display: 'flex',
        width: '100%',
        border: '2 solid #dee2e6',
    },
    row: {
        flexDirection: 'row',
        borderBottom: '1 solid #dee2e6',
      
    },
    headerRow: {
        backgroundColor: '#00bf63',
        color: '#ffffff',
        fontWeight: 'bold',
       
        
    },
    cell: {
        flex: 1,
        paddingLeft: 4,
        paddingRight:4,
        paddingBottom:8,
        paddingTop:8,
        borderRight: '1 solid #dee2e6',
        textAlign: 'left',
        fontSize: 10,
    },
    lastCell: {
        borderRight: 'none',
    },
    pageNumber: {
        position: 'absolute',
        bottom: 10,
        left: 0,
        right: 0,
        textAlign: 'center',
        fontSize: 9,
    },
    greenBox: {
        backgroundColor: "#00bf63",
        height: 20,
    },
    part3Bottom: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        fontSize: 10,
        gap: 5,
        width: "100%",
        marginBottom: 8,
        color: "#2e2e2e",
        paddingLeft: 10,
        paddingRight: 10,
    },
    part3Bottom1: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-start",
        fontSize: 11,
        gap: 10,
        width: "100%",
        marginBottom: 8,
        color: "#2e2e2e",
        paddingLeft: 10,
        paddingRight: 10,
    },
    part3BottomItem: {
        display: "flex",
        gap: 5,
    },
    part4: {
        display: "flex",
        justifyContent: "space-between",
        width: "100%",
        paddingLeft: 10,
        paddingRight: 10,
        
    },
    invoiceTable: {
        display: "flex",
        flexDirection: "column",
        width: "100%",
        borderCollapse: "collapse",
        marginBottom: 5,
        marginTop: 5,
    },
    tableHeader: {
        backgroundColor: "#262626",
        color: "#fff",
        border: "1px solid #ccc",
        fontSize: 10,
        padding: 8,
        flex: 1,
    },
    tableCell: {
        border: '1 solid #dee2e6',
        fontSize: 10,
        padding: 8,
        flex: 1,
    },
    part6: {
        display: "flex",
        
        justifyContent: "space-between",
        flexDirection: "column",
        fontSize: 11,
        width: "100%",
        paddingTop: 10,
        marginBottom: 20,
        bottom:-50,
        height: 60,
        marginTop: 'auto',
    },
    part6Details:{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        paddingLeft: 10,
        paddingRight: 10,
        width: "100%",
    },
    horizontalLine: {
        height: 0.5,
        backgroundColor: "#7575746b",
        marginBottom: 10,
    },
    icon: {
        height: 10,
        width: 10,
        color: "#00bf63",
        marginRight: 5,
    },
    iconLine: {
        display: "flex",
        flexDirection: "row",
        gap:5
    },
    salesSummery:{
        paddingLeft:10,
        paddingBottom:10,
        fontSize:12
    },
    summeryItem:{
        display:"flex",
        flexDirection:"row",
        gap:5
    }, part2Image: {
        width: 12,
        height: 8,
      },
});

interface DownloadReportProps {
    orders: Order[];
    selectedBranchName: string;
    selectedProductName: string;
    selectedAgentName:string;
    selectedRepName:string;
    selectedOrderStatus: string;
    totalSalesRevenue: number;
    totalNumberOfOrders: number;
    totalItemsSold: number;
    totalDiscountsApplied: number;
    startDate: Date | null;
  endDate: Date | null;
}

const DownloadReport: React.FC<DownloadReportProps> = ({
    orders,
    selectedBranchName,
    selectedProductName,
    selectedAgentName,
    selectedRepName,
    selectedOrderStatus,
    totalSalesRevenue,
    totalNumberOfOrders,
    totalItemsSold,
    totalDiscountsApplied,
    startDate,
    endDate
}) => (
    <Document>
        <Page size="A4" style={styles.page} wrap>
            <View style={styles.greenBox} fixed></View>
            <View style={styles.part1} fixed>
                <View style={styles.companyDetails}>
                    <Text style={[styles.companyName, styles.textBold]}>
                        Harithaweli
                    </Text>
                    <Text style={[styles.registrationName, styles.textBold]}>
                        Sales Report
                    </Text>
                    {startDate ? (
  <Text style={[ { paddingTop: 5 }]}>
    {startDate.toLocaleDateString()} - {endDate ? endDate.toLocaleDateString() : ''}
  </Text>
) : (
  ""
)}
                     </View>
                <Image style={styles.part1Image} src={Logo} />
            </View>

            <View style={[styles.part3Bottom]}>
                <View style={styles.part3BottomItem}>
                    <Text> Selected Branch: {selectedBranchName}</Text>
                    {selectedAgentName && (<Text>Selected Agent: {selectedAgentName}</Text>)}
                </View>
                <View style={styles.part3BottomItem}>
                    <Text>Selected Product: {selectedProductName}</Text>
                   {selectedRepName && ( <Text>Selected Sales Rep: {selectedRepName}</Text>)}
                    
                </View>
                <View style={styles.part3BottomItem}>
                <Text>Selected Order Status: {selectedOrderStatus ? selectedOrderStatus : "All"}</Text>
                    
                </View>
            </View>
            <View style={{display:"flex", flexDirection:"row",gap:5}}>
  <Text style={[styles.textBold, styles.salesSummery]}>
    Sales Summary:
  </Text>
 
</View>
            <View style={[styles.part3Bottom1]}>
                <View style={styles.part3BottomItem}>
                    <View style={styles.summeryItem}><Text>Total Sales Revenue: </Text></View>
                    <View style={styles.summeryItem}><Text>Total Number of Orders: </Text></View>
                    <View style={styles.summeryItem}><Text>Total Items Sold: </Text></View>
                    <View style={styles.summeryItem}><Text>Total Discounts Applied: </Text></View>
                </View>
                <View style={styles.part3BottomItem}>
                <Text style={styles.textBold}>{totalSalesRevenue} LKR</Text>
                <Text style={styles.textBold}>{totalNumberOfOrders}</Text>
                <Text style={styles.textBold}>{totalItemsSold}</Text>
                <Text style={styles.textBold}> {totalDiscountsApplied} LKR</Text>
                </View>
               
            </View>

            <View style={styles.part4}>
                <View style={styles.invoiceTable}>
                    {/* Table Header */}
                    <View style={[styles.row, styles.headerRow,{height:50}]} >
                        <Text style={[styles.cell, styles.textBold, { flex: 0.3 ,textAlign:"center" }]}>Id</Text>
                        <Text style={[styles.cell, styles.textBold, { flex: 1.6,textAlign:"center"  }]}>Customers      Details</Text>
                        <Text style={[styles.cell, styles.textBold, { flex: 2.2 ,textAlign:"center" }]}>Address</Text>
                        <Text style={[styles.cell, styles.textBold, { flex: 1.0 ,textAlign:"center" }]}>Branch</Text>
                        <Text style={[styles.cell, styles.textBold, { flex: 1.7 ,textAlign:"center" }]}>Products</Text>
                        <Text style={[styles.cell, styles.textBold, { flex: 1.0 ,textAlign:"center" }]}>Date</Text>
                        <Text style={[styles.cell, styles.textBold, { flex: 1.0 ,textAlign:"center" }]}>Order Status</Text>
                        <Text style={[styles.cell, styles.textBold, { flex: 0.8 ,textAlign:"center" }]}>Paid Amount</Text>
                    </View>

                    {/* Table Rows */}
                    {orders.map((order, index) => (
                        <View key={index} style={[styles.row, index % 2 === 0 ? { backgroundColor: '#f0f0f0'} : { backgroundColor: '#ffffff' }]} wrap={false}>
                            <Text style={[styles.cell, { flex: 0.3,borderLeft: '1 solid #dee2e6',textAlign:"center" }]}>{order.orderId}</Text>
                            <Text style={[styles.cell, { flex: 1.6 }]}>{order.name}</Text>
                            <Text style={[styles.cell, { flex: 2.2 }]}>{order.address}</Text>
                            <Text style={[styles.cell, { flex: 1.0 }]}>{order.branch}</Text>
                            <Text style={[styles.cell, { flex: 1.7 }]}>{order.orderedProducts}</Text>
                            <Text style={[styles.cell, { flex: 1.0 }]}>{order.date}</Text>
                            <Text style={[styles.cell, { flex: 1.0 }]}>{order.status.toLowerCase()}</Text>
                            <Text style={[styles.cell, { flex: 0.8 }]}>{order.netAmount}</Text>
                        </View>
                    ))}
                </View>
            </View>

            {/* Page Number */}
           

            <View style={styles.part6} fixed>
        
                <View style={styles.part6Details}>
                <View style={styles.iconLine}>
                    <Image style={styles.icon} src="../Admin/report/phone1.png" />
                    <Text style={styles.textBold}>+94 710 500 800</Text>
                </View>
                <Text style={styles.textBold}> Info@harithweli.lk</Text>
                </View>
               
            </View>
            <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
                `Page ${pageNumber} of ${totalPages}`
            )} fixed/>
            
        </Page>
    </Document>
);

export default DownloadReport;