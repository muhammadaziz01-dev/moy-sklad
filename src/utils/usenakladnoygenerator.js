import {
  Document, Packer, Paragraph, TextRun,
  Table, TableRow, TableCell,
  AlignmentType, BorderStyle, WidthType,
  VerticalAlign,
} from "docx";
import { saveAs } from "file-saver";

const FONT = "Times New Roman";

const border    = { style: BorderStyle.SINGLE, size: 1, color: "000000" };
const borders   = { top: border, bottom: border, left: border, right: border };
const noBorder  = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
const noBorders = { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder };

const run = (text, { bold = false, size = 22 } = {}) =>
  new TextRun({ text: String(text), bold, size, font: FONT, color: "000000" });

// ─── Oddiy paragraf ───────────────────────────────────────────
const makeParagraph = (text, options = {}) =>
  new Paragraph({
    alignment: options.align || AlignmentType.LEFT,
    spacing: { after: options.spacingAfter ?? 80 },
    children: [run(text, { bold: options.bold, size: options.size })],
  });

// ─── Jadval katagi (rangsiz) ──────────────────────────────────
const makeCell = (text, width, options = {}) =>
  new TableCell({
    borders,
    width: { size: width, type: WidthType.DXA },
    columnSpan: options.columnSpan,
    margins: { top: 60, bottom: 60, left: 100, right: 100 },
    verticalAlign: VerticalAlign.CENTER,
    children: [new Paragraph({
      alignment: options.align || AlignmentType.LEFT,
      children: [run(text, { bold: options.bold, size: options.size || 18 })],
    })],
  });

// ─── Imzo katagi ──────────────────────────────────────────────
const makeSignCell = (title, fullName, width) =>
  new TableCell({
    borders: noBorders,
    width: { size: width, type: WidthType.DXA },
    margins: { top: 80, bottom: 80, left: 80, right: 80 },
    children: [
      new Paragraph({ children: [run(title, { bold: true, size: 20 })] }),
      new Paragraph({
        spacing: { before: 200 },
        children: [run("________________", { size: 20 })],
      }),
      new Paragraph({
        spacing: { before: 80 },
        children: [run(`(${fullName || "                    "})`, { size: 18 })],
      }),
    ],
  });

// ─── Mahsulotlarni kategoriya bo'yicha guruhlash ──────────────
// item.category bo'lmasa — guruhsiz (oddiy ro'yxat) chiqadi
const groupCart = (cart) => {
  const map = new Map();
  cart.forEach((item) => {
    const key = item.category || "";
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(item);
  });
  return [...map.entries()];
};

// ─── Asosiy eksport funksiyasi ────────────────────────────────
// Eslatma: komponent hozir tanlangan shaxsni (Торговый агент) `clientName`
// va `agent.region` orqali yuboradi, shuning uchun Агент = clientName.
export const generateNakladnoyWord = async ({
  number,
  date,
  agent,
  clientName,
  comment,
  cart,
  totalSum,
}) => {
  const agentName = clientName || agent?.fulName || "";

  // A4 portrait, kontent kengligi = 11906 - 1600 = 10306 DXA
  const colWidths = {
    num:   500,
    name:  5006,
    qty:   1200,
    price: 1600,
    total: 2000,
  };
  const tableWidth = Object.values(colWidths).reduce((a, b) => a + b, 0); // 10306

  // ── Sarlavha qatori ───────────────────────────────────────
  const headerRow = new TableRow({
    tableHeader: true,
    children: [
      makeCell("№",            colWidths.num,   { align: AlignmentType.CENTER, bold: true }),
      makeCell("Номенклатура", colWidths.name,  { align: AlignmentType.LEFT,   bold: true }),
      makeCell("Кол.",         colWidths.qty,   { align: AlignmentType.CENTER, bold: true }),
      makeCell("Цена",         colWidths.price, { align: AlignmentType.CENTER, bold: true }),
      makeCell("Сумма",        colWidths.total, { align: AlignmentType.CENTER, bold: true }),
    ],
  });

  // ── Kategoriya sarlavhalari + mahsulot qatorlari ──────────
  const bodyRows = [];
  groupCart(cart).forEach(([category, items]) => {
    if (category) {
      bodyRows.push(new TableRow({
        children: [
          makeCell(category, tableWidth, { columnSpan: 5, bold: true }),
        ],
      }));
    }
    items.forEach((item, idx) => {
      bodyRows.push(new TableRow({
        children: [
          makeCell(idx + 1,                                  colWidths.num,   { align: AlignmentType.CENTER }),
          makeCell(item.name,                                colWidths.name),
          makeCell(`${item.quantity} ${item.unit || ""}`.trim(), colWidths.qty, { align: AlignmentType.CENTER }),
          makeCell((item.price || 0).toLocaleString("ru-RU"), colWidths.price, { align: AlignmentType.RIGHT }),
          makeCell(((item.price || 0) * item.quantity).toLocaleString("ru-RU"),
                                                             colWidths.total, { align: AlignmentType.RIGHT, bold: true }),
        ],
      }));
    });
  });

  // ── Jami qatori ───────────────────────────────────────────
  const totalRow = new TableRow({
    children: [
      makeCell("ИТОГО:", tableWidth - colWidths.total, {
        columnSpan: 4, align: AlignmentType.RIGHT, bold: true, size: 22,
      }),
      makeCell(`${(totalSum || 0).toLocaleString("ru-RU")} сом`, colWidths.total, {
        align: AlignmentType.RIGHT, bold: true, size: 22,
      }),
    ],
  });

  const productTable = new Table({
    width: { size: tableWidth, type: WidthType.DXA },
    columnWidths: Object.values(colWidths),
    rows: [headerRow, ...bodyRows, totalRow],
  });

  // ── Imzo jadvali ──────────────────────────────────────────
  const signColW = Math.floor(tableWidth / 3);
  const signTable = new Table({
    width: { size: tableWidth, type: WidthType.DXA },
    columnWidths: [signColW, signColW, tableWidth - signColW * 2],
    rows: [new TableRow({
      children: [
        makeSignCell("Отпустил (склад):", "склад",    signColW),
        makeSignCell("Агент:",            agentName,  signColW),
        makeSignCell("Получил (клиент):", "",         tableWidth - signColW * 2),
      ],
    })],
  });

  // ── Hujjat ────────────────────────────────────────────────
  const doc = new Document({
    sections: [{
      properties: {
        page: {
          size: { width: 11906, height: 16838 },
          margin: { top: 1000, right: 800, bottom: 1000, left: 800 },
        },
      },
      children: [
        new Paragraph({
          alignment: AlignmentType.CENTER, spacing: { after: 40 },
          children: [run("НАКЛАДНАЯ", { bold: true, size: 32 })],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER, spacing: { after: 200 },
          children: [run(`№ ${number}   от   ${date}`, { bold: true, size: 24 })],
        }),
        new Paragraph({
          spacing: { after: 120 },
          border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: "000000" } },
          children: [new TextRun({ text: "" })],
        }),

        // Агент — tanlangan agent nomi
        makeParagraph(`Агент:   ${agentName}`, { bold: true, size: 22 }),
        // Регион — tanlangan agent regioni
        makeParagraph(`Регион:   ${agent?.region || ""}`, { size: 20 }),
        // Клиент — Word ichida qo'lda to'ldirish uchun bo'sh
        makeParagraph("Клиент:   _______________________________", { bold: true, size: 22 }),

        ...(comment
          ? [makeParagraph(`Комментарий:   ${comment}`, { size: 20, spacingAfter: 160 })]
          : [new Paragraph({ spacing: { after: 160 } })]
        ),

        productTable,
        new Paragraph({ spacing: { after: 500 } }),
        signTable,
      ],
    }],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `Накладная_№${number}_${date.replace(/\./g, "-")}.docx`);
};