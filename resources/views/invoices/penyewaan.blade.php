<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invoice Penyewaan - {{ $penyewaan->id_penyewaan }}</title>
    <style>
        body { font-family: 'Helvetica', 'Arial', sans-serif; line-height: 1.6; font-size: 12px; color: #333; }
        .container { width: 100%; margin: 0 auto; padding: 20px; }
        .header { text-align: center; margin-bottom: 20px; }
        .header h1 { margin: 0; font-size: 24px; color: #2E7D32; }
        .header p { margin: 0; font-size: 14px; }
        .invoice-details, .customer-details, .item-details { margin-bottom: 20px; }
        .invoice-details table, .customer-details table, .item-details table { width: 100%; border-collapse: collapse; }
        .invoice-details th, .invoice-details td,
        .customer-details th, .customer-details td,
        .item-details th, .item-details td { padding: 8px; border: 1px solid #ddd; text-align: left;}
        .item-details th { background-color: #f2f2f2; }
        .text-right { text-align: right; }
        .font-bold { font-weight: bold; }
        .total-section { margin-top: 20px; }
        .footer { text-align: center; margin-top: 30px; font-size: 10px; color: #777; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>PMAQ Tenda</h1>
            <p>Layanan Penyewaan Tenda</p>
            <p>0812-3456-7890</p>
            <hr>
            <h2>INVOICE PENYEWAAN</h2>
        </div>

        <div class="invoice-details">
            <table>
                <tr>
                    <td style="width:50%;"><strong>ID Penyewaan:</strong> {{ $penyewaan->id_penyewaan }}</td>
                    <td style="width:50%;" class="text-right"><strong>Tanggal Cetak:</strong> {{ $tanggalCetak }}</td>
                </tr>
            </table>
        </div>

        <div class="customer-details">
            <h3>Data Penyewa:</h3>
            <table>
                <tr><td style="width:30%;">Nama Lengkap</td><td>: {{ $pelanggan->nama }}</td></tr>
                <tr><td>Nomor Telepon</td><td>: {{ $pelanggan->no_telp }}</td></tr>
                <tr><td>Alamat Pemasangan</td><td>: {{ $pelanggan->alamat }}</td></tr>
            </table>
        </div>

        <div class="item-details">
            <h3>Rincian Penyewaan:</h3>
            <table>
                <tr><td style="width:30%;">Tanggal Sewa</td><td>: {{ \Carbon\Carbon::parse($penyewaan->tanggal_penyewaan)->isoFormat('D MMMM YYYY') }}</td></tr>
                <tr><td>Durasi</td><td>: {{ $penyewaan->durasi_penyewaan }} hari</td></tr>
                @if($penyewaan->catatan)
                <tr><td>Catatan</td><td>: {{ $penyewaan->catatan }}</td></tr>
                @endif
            </table>
        </div>

        <div class="item-details">
            <h3>Rincian Item dan Biaya:</h3>
            <table>
                <thead>
                    <tr>
                        <th>Nama Tenda</th>
                        <th class="text-right">Jumlah</th>
                        <th class="text-right">Harga Satuan</th>
                        <th class="text-right">Subtotal</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{{ $itemTenda->tenda->nama_tenda }}</td>
                        <td class="text-right">{{ $itemTenda->jumlah_tenda }}</td>
                        <td class="text-right">Rp{{ number_format($itemTenda->tenda->harga, 0, ',', '.') }}</td>
                        <td class="text-right">Rp{{ number_format($itemTenda->biaya, 0, ',', '.') }}</td>
                    </tr>
                    </tbody>
                <tfoot>
                    <tr class="font-bold">
                        <td colspan="3" class="text-right">Total Biaya:</td>
                        <td class="text-right">Rp{{ number_format($itemTenda->biaya, 0, ',', '.') }}</td>
                        </tr>
                </tfoot>
            </table>
        </div>

        <div class="footer">
            <p>Terima kasih telah menggunakan layanan PMAQ Tenda.</p>
            <p>&copy; {{ date('Y') }} PMAQ Tenda. All Rights Reserved.</p>
        </div>
    </div>
</body>
</html>