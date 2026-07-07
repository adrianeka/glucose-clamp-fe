"use client";

import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import dayjs from "dayjs";
import 'dayjs/locale/id';

const styles = StyleSheet.create({
    page: { padding: 40, fontSize: 10, color: "#212121", fontFamily: "Helvetica", lineHeight: 1.5 },
    headerContainer: { borderBottom: "2px solid #009BB1", paddingBottom: 8, marginBottom: 15 },
    headerTitle: { fontSize: 20, color: "#009BB1", textTransform: "uppercase", fontWeight: "bold" },
    metaText: { fontSize: 9, color: "#707784", marginTop: 10 },
    sectionTitle: { fontSize: 13, color: "#212121", marginTop: 14, marginBottom: 6, borderBottom: "1px solid #E2E4E6", paddingBottom: 4, fontWeight: "bold" },
    gridContainer: { flexDirection: "row", flexWrap: "wrap", marginBottom: 10 },
    gridBox: { width: "50%", paddingRight: 10, marginBottom: 6 },
    label: { fontSize: 9, color: "#707784" },
    value: { fontSize: 11, color: "#212121", marginTop: 2 },

    chartWrapper: {
        marginVertical: 6,
        backgroundColor: "#FFFFFF",
        overflow: "hidden",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
    },
    chartImageMain: {
        width: "100%",
        height: 200,
        objectFit: "contain",
    },
    chartImageSub: {
        width: "100%",
        height: 200,
        objectFit: "contain",
    },

    table: { width: "auto", marginVertical: 10, borderStyle: "solid", borderWidth: 1, borderColor: "#E2E4E6", borderRadius: 4, overflow: "hidden" },
    tableRow: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "#E2E4E6", minHeight: 24, alignItems: "center" },
    tableHeader: { backgroundColor: "#F1F9FA" },
    tableCellHeader: { color: "#0076D2", fontSize: 9, padding: 6 },
    tableCell: { fontSize: 9, padding: 6, color: "#595F6A" },
    colW10: { width: "10%" },
    colW20: { width: "20%" },
    colW30: { width: "30%" },
    colW40: { width: "40%" },
    pageNumber: { position: "absolute", fontSize: 9, bottom: 20, left: 0, right: 0, textAlign: "center", color: "#A0AEC0" },
});

interface ClampingReportDocumentProps {
    sessionData: any;
    mainChartImage: string | null;
    subChartImage: string | null;
    measurements: Array<{
        time: string;
        glucose: number;
        operator: string;
    }>;
    aucValue: number;
    glucoseTargets: {
        targetMin: number;
        targetMax: number;
        extremeMin: number;
        extremeMax: number;
    };
    pkMeasurements: Array<{
        time: string;
        value: number;
        unit: string;
        operator: string;
    }>;
    cPeptideMeasurements: Array<{
        time: string;
        value: number;
        unit: string;
        operator: string;
    }>;
}

export default function ClampingReportDocument({ sessionData, mainChartImage, subChartImage, measurements = [], aucValue, glucoseTargets, pkMeasurements = [], cPeptideMeasurements = [], }: ClampingReportDocumentProps) {
    const printedAt = new Date().toLocaleString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    }).replaceAll(".", ":");
    const activities = sessionData?.activities || [];

    return (
        <Document>
            {/* HALAMAN 1: RINGKASAN & GRAFIK VISUAL */}
            <Page size="A4" style={styles.page}>
                <View style={styles.headerContainer}>
                    <Text style={styles.headerTitle}>Laporan Glucose Clamping</Text>
                    <Text style={styles.metaText}>PROTOCOL: {sessionData?.protocolName} | SESSION ID: S-{sessionData?.sessionId} | Dicetak pada: {printedAt}</Text>
                </View>

                <Text style={styles.sectionTitle}>1. Ringkasan Sesi & Data Partisipan</Text>
                <View style={styles.gridContainer}>
                    <View style={styles.gridBox}>
                        <Text style={styles.label}>Nama Partisipan:</Text>
                        <Text style={styles.value}>{sessionData?.participantName || "Loading..."}</Text>
                    </View>
                    <View style={styles.gridBox}>
                        <Text style={styles.label}>Nama Proses:</Text>
                        <Text style={styles.value}>{sessionData?.protocolName || "Laporan_Clamping"} S-{sessionData?.sessionId}</Text>
                    </View>
                    <View style={styles.gridBox}>
                        <Text style={styles.label}>Waktu Mulai:</Text>
                        <Text style={styles.value}>
                            {sessionData?.visitDate
                                ? dayjs(sessionData.visitDate).locale('id').format("D MMMM YYYY")
                                : "-"}
                        </Text>
                    </View>
                    <View style={styles.gridBox}>
                        <Text style={styles.label}>Total AUC:</Text>
                        <Text style={styles.value}>{aucValue}</Text>
                    </View>
                    <View style={styles.gridBox}>
                        <Text style={styles.label}>Target Control:</Text>
                        <Text style={styles.value}>{glucoseTargets.targetMin} - {glucoseTargets.targetMax} mg/dL</Text>
                    </View>
                    <View style={styles.gridBox}>
                        <Text style={styles.label}>Safety Alarm:</Text>
                        <Text style={styles.value}>&lt; {glucoseTargets.extremeMin} OR &gt; {glucoseTargets.extremeMax} mg/dL</Text>
                    </View>
                </View>

                <Text style={styles.sectionTitle}>2. Grafik Visual</Text>

                {/* BARIS 1: GD Chart penuh */}
                <View style={styles.chartWrapper}>
                    {mainChartImage ? (
                        <Image src={mainChartImage} style={styles.chartImageMain} />
                    ) : (
                        <Text style={{ color: "#EF4444", fontSize: 9, padding: 10 }}>Gagal memuat Grafik Respons Gula Darah.</Text>
                    )}
                </View>

                {/* BARIS 2: PK Chart & C-Peptide Chart berdampingan secara horizontal (bawaan komponen web) */}
                <View style={styles.chartWrapper}>
                    {subChartImage ? (
                        <Image src={subChartImage} style={styles.chartImageSub} />
                    ) : (
                        <Text style={{ color: "#EF4444", fontSize: 9, padding: 10 }}>Gagal memuat Sub-Charts.</Text>
                    )}
                </View>

                <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => `Halaman ${pageNumber} dari ${totalPages}`} fixed />
            </Page>

            {/* HALAMAN 2: DATA DETAIL MEASUREMENTS */}
            <Page size="A4" style={styles.page}>
                <Text style={styles.sectionTitle}>3. Data Pengukuran Detail - Gula Darah</Text>
                <View style={styles.table}>
                    <View style={[styles.tableRow, styles.tableHeader]}>
                        <Text style={[styles.tableCellHeader, styles.colW10]}>No</Text>
                        <Text style={[styles.tableCellHeader, styles.colW30]}>Waktu</Text>
                        <Text style={[styles.tableCellHeader, styles.colW30]}>Gula Darah (mg/dL)</Text>
                        <Text style={[styles.tableCellHeader, styles.colW30]}>Operator</Text>
                    </View>
                    {measurements.length > 0 ? (
                        measurements.map((row: any, index: number) => (
                            <View style={styles.tableRow} key={index} wrap={false}>
                                <Text style={[styles.tableCell, styles.colW10]}>{index + 1}</Text>
                                <Text style={[styles.tableCell, styles.colW30]}>{row.time}</Text>
                                <Text style={[styles.tableCell, styles.colW30, { fontWeight: "bold" }]}>{row.glucose}</Text>
                                <Text style={[styles.tableCell, styles.colW30]}>{row.operator}</Text>
                            </View>
                        ))
                    ) : (
                        <View style={styles.tableRow}>
                            <Text style={[styles.tableCell, { flex: 1, textAlign: "center" }]}>Tidak ada data</Text>
                        </View>
                    )}
                </View>

                <View style={{ marginTop: 20 }} />

                <Text style={styles.sectionTitle}>4. Data Pengukuran Detail - Insulin & C-Peptide</Text>
                <View style={styles.table}>
                    <View style={[styles.tableRow, styles.tableHeader]}>
                        <Text style={[styles.tableCellHeader, styles.colW10]}>No</Text>
                        <Text style={[styles.tableCellHeader, styles.colW20]}>Waktu</Text>
                        <Text style={[styles.tableCellHeader, styles.colW20]}>Insulin / PK (mg/L)</Text>
                        <Text style={[styles.tableCellHeader, styles.colW20]}>C-Peptide (ng/mL)</Text>
                        <Text style={[styles.tableCellHeader, styles.colW20]}>Operator</Text>
                    </View>

                    {pkMeasurements?.length > 0 || cPeptideMeasurements?.length > 0 ? (
                        Array.from({ length: Math.max(pkMeasurements?.length || 0, cPeptideMeasurements?.length || 0) }).map((_, index) => {
                            const pkRow = pkMeasurements?.[index];
                            const pepRow = cPeptideMeasurements?.[index];

                            return (
                                <View style={styles.tableRow} key={index} wrap={false}>
                                    <Text style={[styles.tableCell, styles.colW10]}>{index + 1}</Text>
                                    <Text style={[styles.tableCell, styles.colW20]}>{pkRow?.time || pepRow?.time || "-"}</Text>
                                    <Text style={[styles.tableCell, styles.colW20]}>{pkRow?.value !== undefined ? pkRow.value : "-"}</Text>
                                    <Text style={[styles.tableCell, styles.colW20]}>{pepRow?.value !== undefined ? pepRow.value : "-"}</Text>
                                    <Text style={[styles.tableCell, styles.colW20]}>{pkRow?.operator || pepRow?.operator || "-"}</Text>
                                </View>
                            );
                        })
                    ) : (
                        <View style={styles.tableRow}>
                            <Text style={[styles.tableCell, { flex: 1, textAlign: "center" }]}>Tidak ada data laboratorium</Text>
                        </View>
                    )}
                </View>

                <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => `Halaman ${pageNumber} dari ${totalPages}`} fixed />
            </Page>

            {/* HALAMAN 3: AUDIT TRAIL */}
            <Page size="A4" style={styles.page}>
                <Text style={styles.sectionTitle}>5. Log Aktivitas Sistem (Audit Trail)</Text>
                <View style={styles.table}>
                    <View style={[styles.tableRow, styles.tableHeader]}>
                        <Text style={[styles.tableCellHeader, styles.colW10]}>No</Text>
                        <Text style={[styles.tableCellHeader, styles.colW20]}>Waktu</Text>
                        <Text style={[styles.tableCellHeader, styles.colW30]}>Aktor</Text>
                        <Text style={[styles.tableCellHeader, styles.colW40]}>Aktivitas</Text>
                    </View>
                    {activities.length > 0 ? (
                        activities.map((log: any, index: number) => (
                            <View style={styles.tableRow} key={index} wrap={false}>
                                <Text style={[styles.tableCell, styles.colW10]}>{index + 1}</Text>
                                <Text style={[styles.tableCell, styles.colW20]}>{log.time?.includes("T") ? log.time.split("T")[1].substring(0, 8) : log.time}</Text>
                                <Text style={[styles.tableCell, styles.colW30]}>{log.actor || log.activityType}</Text>
                                <Text style={[styles.tableCell, styles.colW40]}>{log.activity || log.activityDesc}</Text>
                            </View>
                        ))
                    ) : (
                        <View style={styles.tableRow}><Text style={[styles.tableCell, { flex: 1, textAlign: "center" }]}>Tidak ada log</Text></View>
                    )}
                </View>
                <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => `Halaman ${pageNumber} dari ${totalPages}`} fixed />
            </Page>
        </Document>
    );
}