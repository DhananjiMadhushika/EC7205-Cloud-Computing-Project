import { Document, Image, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import Logo from "/client/hero/logo.webp";

const styles = StyleSheet.create({
    page: {
        paddingLeft: 20,
        paddingRight:20,
        fontSize: 10,
    },
    header: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
        paddingLeft:10,
        paddingRight:10
    },
    companyName: {
        fontSize: 26,
        fontWeight: "bold",
    },
    estimateTable: {
        width: '100%',
        marginBottom: 20,
        paddingLeft:10,
        paddingRight:10
    },
    tableRow: {
        flexDirection: 'row',
        marginTop:5,
        backgroundColor:"#F7F7F7"
    },
    tableRowLast: {
      flexDirection: 'row',
      justifyContent:"flex-end",
      marginTop:25,
      fontSize:12,
      backgroundColor:"#F7F7F7"
  },
    tableHeader: {
        backgroundColor: '#00bf63',
        color: '#fff',
        fontWeight: 'bold',
    },
    tableCell: {
        flex: 1,
        padding: 8,
  
        textAlign: 'center',
    },
    tableCelllast: {
      flex: 1,
      padding: 8,

      textAlign: 'right',
      backgroundColor:"#F7F7F7"
  },
  
    instructions: {
        marginBottom: 20,
        paddingLeft:10,
        paddingRight:10
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        textAlign: 'center',
        fontSize: 12,
        paddingLeft:20,
        paddingRight:20
    },
    greenBox: {
      backgroundColor: "#00bf63",
      height: 20,
      marginBottom:10,
      marginLeft:10,
      marginRight:10
  },
  greenBoxLast: {
    backgroundColor: "#00bf63",
    height: 20,
    marginTop:10,
    marginLeft:10,
    marginRight:10
},
  line:{
    height: 2,
        width: '100%',
        backgroundColor: '#000',
        marginTop: 50
  },
  icon: {
    height: 10,
    width: 10,
    color: "#00bf63",
    marginRight: 5,
},
textBold: {
  fontWeight: "bold",
},
iconLine: {
  display: "flex",
  flexDirection: "row",
  gap:5
},
part6Details:{
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  paddingLeft: 10,
  paddingRight: 10,
  width: "100%",
},
});

interface DownloadReportProps {
  productName: string;
  inches: number;
  quality:number,
  quantity:number,
  totalPrice:number,
  mixing: string,
  applicationMethod: string,
  storage:string

}

const CalReport: React.FC<DownloadReportProps> = ({ productName, inches, quality, quantity, totalPrice,mixing,applicationMethod,storage }) => (
    <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.greenBox} fixed></View>
            <View style={styles.header}>
                <Text style={styles.companyName}>ESTIMATE</Text>
                <Image src={Logo} style={{ width: 70, height: 70 }} />
            </View>

            <View style={styles.estimateTable}>
                <View style={[styles.tableRow, styles.tableHeader]}>
                    <Text style={styles.tableCell}>PRODUCT</Text>
                    <Text style={styles.tableCell}>QUALITY</Text>
                    <Text style={styles.tableCell}>FEET</Text>
                    <Text style={styles.tableCell}>QTY</Text>
                    <Text style={[styles.tableCell]}>PRICE</Text>
                </View>
                <View style={styles.tableRow}>
                    <Text style={styles.tableCell}>{productName}</Text>
                    <Text style={styles.tableCell}>{quality === 1 ? "Low" : quality === 2 ? "Medium" : "High"}</Text>
                    <Text style={styles.tableCell}>{inches}</Text>
                    <Text style={styles.tableCell}>{quantity}</Text>
                    <Text style={[styles.tableCell]}>LKR {totalPrice.toFixed(2)}</Text>
                </View>
                <View style={styles.tableRowLast}>
                   
                    <Text style={[styles.tableCelllast]}>TOTAL: LKR {totalPrice.toFixed(2)}</Text>
                </View>
                <hr style={styles.line}/>
            </View>

            <View style={styles.instructions}>
                <Text style={{ fontWeight: 'bold', marginBottom: 10 }}>Mixing</Text>
                <Text>{mixing}</Text>
                </View>

            <View style={styles.instructions}>
                <Text style={{ fontWeight: 'bold', marginBottom: 10 }}>Application method</Text>
                <Text>{applicationMethod}</Text>
                 </View>

            <View style={styles.instructions}>
                <Text style={{ fontWeight: 'bold', marginBottom: 10 }}>Storage</Text>
               <Text>{storage}</Text>  </View>

            <View style={styles.footer}>
                 <View style={styles.part6Details}>
                                <View style={styles.iconLine}>
                                    <Image style={styles.icon} src="../Admin/report/phone1.png" />
                                    <Text >+94 710 500 800</Text>
                                </View>
                                <Text > Info@harithweli.lk</Text>
                                </View>
                                <View style={styles.greenBoxLast} fixed></View>
            </View>
        </Page>
    </Document>
);

export default CalReport;