import { OrderItem, SenderProfile } from '../../orders/types'

/**
 * Genera y descarga un archivo Excel (.xls compatible con Excel 2007+)
 * con las cabeceras oficiales requeridas por Shalom para carga masiva.
 * Usa mso-number-format:"\@" para asegurar que los DNIs y celulares
 * nunca pierdan los ceros a la izquierda.
 */
export function exportShalomExcel(orders: OrderItem[], sender: SenderProfile, filename = 'Carga_Masiva_Shalom_TikShip.xls') {
  if (orders.length === 0) return

  const headers = [
    'ITEM',
    'COURIER',
    'TIPO_DOC_REMITENTE',
    'NUM_DOC_REMITENTE',
    'REMITENTE',
    'TELEFONO_REMITENTE',
    'AGENCIA_ORIGEN',
    'TIPO_DOC_DESTINATARIO',
    'NUM_DOC_DESTINATARIO',
    'DESTINATARIO',
    'TELEFONO_DESTINATARIO',
    'DEPARTAMENTO_DESTINO',
    'PROVINCIA_DESTINO',
    'AGENCIA_SHALOM_DESTINO',
    'CONTENIDO',
    'BULTOS',
    'CONDICION_FLETE',
    'OBSERVACIONES',
  ]

  let tableHtml = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
      <!--[if gte mso 9]>
      <xml>
        <x:ExcelWorkbook>
          <x:ExcelWorksheets>
            <x:ExcelWorksheet>
              <x:Name>Carga Masiva Shalom</x:Name>
              <x:WorksheetOptions>
                <x:DisplayGridlines/>
              </x:WorksheetOptions>
            </x:ExcelWorksheet>
          </x:ExcelWorksheets>
        </x:ExcelWorkbook>
      </xml>
      <![endif]-->
      <style>
        th {
          background-color: #0f172a;
          color: #ffffff;
          font-weight: bold;
          font-size: 11pt;
          text-align: center;
          border: 1px solid #334155;
          padding: 6px;
        }
        td {
          font-size: 10pt;
          border: 1px solid #cbd5e1;
          padding: 5px;
        }
        .text-cell {
          mso-number-format: "\\@";
        }
        .center-cell {
          text-align: center;
        }
      </style>
    </head>
    <body>
      <table>
        <thead>
          <tr>
            ${headers.map((h) => `<th>${h}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
  `

  orders.forEach((ord, index) => {
    tableHtml += `
      <tr>
        <td class="center-cell">${index + 1}</td>
        <td class="center-cell">${ord.courier || 'SHALOM'}</td>
        <td class="center-cell">${sender.docType}</td>
        <td class="text-cell">${sender.docNumber}</td>
        <td>${escapeXml(sender.businessName)}</td>
        <td class="text-cell">${sender.phone}</td>
        <td>${escapeXml(sender.originAgency)}</td>
        <td class="center-cell">${ord.recipientDocType}</td>
        <td class="text-cell">${ord.recipientDocNumber}</td>
        <td>${escapeXml(ord.recipientName)}</td>
        <td class="text-cell">${ord.recipientPhone}</td>
        <td>${escapeXml(ord.destinationDepartment)}</td>
        <td>${escapeXml(ord.destinationProvince)}</td>
        <td>${escapeXml(ord.destinationAgency)}</td>
        <td>${escapeXml(ord.packageContent)}</td>
        <td class="center-cell">${ord.packageQuantity}</td>
        <td class="center-cell">${ord.paymentCondition === 'PAGO_EN_DESTINO' ? 'PAGO EN DESTINO' : 'PAGADO'}</td>
        <td>${escapeXml(ord.notes || '')}</td>
      </tr>
    `
  })

  tableHtml += `
        </tbody>
      </table>
    </body>
    </html>
  `

  const blob = new Blob([tableHtml], { type: 'application/vnd.ms-excel;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', filename)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * También exporta como CSV UTF-8 con BOM
 */
export function exportShalomCsv(orders: OrderItem[], sender: SenderProfile, filename = 'Carga_Masiva_Shalom_TikShip.csv') {
  if (orders.length === 0) return

  const headers = [
    'ITEM',
    'COURIER',
    'TIPO_DOC_REMITENTE',
    'NUM_DOC_REMITENTE',
    'REMITENTE',
    'TELEFONO_REMITENTE',
    'AGENCIA_ORIGEN',
    'TIPO_DOC_DESTINATARIO',
    'NUM_DOC_DESTINATARIO',
    'DESTINATARIO',
    'TELEFONO_DESTINATARIO',
    'DEPARTAMENTO_DESTINO',
    'PROVINCIA_DESTINO',
    'AGENCIA_SHALOM_DESTINO',
    'CONTENIDO',
    'BULTOS',
    'CONDICION_FLETE',
    'OBSERVACIONES',
  ]

  const rows = orders.map((ord, idx) => [
    idx + 1,
    ord.courier || 'SHALOM',
    sender.docType,
    `"${sender.docNumber}"`,
    `"${sender.businessName.replace(/"/g, '""')}"`,
    `"${sender.phone}"`,
    `"${sender.originAgency.replace(/"/g, '""')}"`,
    ord.recipientDocType,
    `"${ord.recipientDocNumber}"`,
    `"${ord.recipientName.replace(/"/g, '""')}"`,
    `"${ord.recipientPhone}"`,
    `"${ord.destinationDepartment.replace(/"/g, '""')}"`,
    `"${ord.destinationProvince.replace(/"/g, '""')}"`,
    `"${ord.destinationAgency.replace(/"/g, '""')}"`,
    `"${ord.packageContent.replace(/"/g, '""')}"`,
    ord.packageQuantity,
    ord.paymentCondition === 'PAGO_EN_DESTINO' ? 'PAGO EN DESTINO' : 'PAGADO',
    `"${(ord.notes || '').replace(/"/g, '""')}"`,
  ])

  const csvContent = '\uFEFF' + [headers.join(';'), ...rows.map((r) => r.join(';'))].join('\r\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', filename)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<':
        return '&lt;'
      case '>':
        return '&gt;'
      case '&':
        return '&amp;'
      case '\'':
        return '&apos;'
      case '"':
        return '&quot;'
      default:
        return c
    }
  })
}

